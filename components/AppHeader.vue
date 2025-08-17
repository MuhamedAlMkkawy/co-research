<template>
  <div class="navbar">
    <div class="container mx-auto">
      <div class="content">
        <NuxtLink :to="localeRoute('/')" class="image">
          <img :src="logo" :style="globalStore.lang == 'ar' ? 'object-fit:contain;' : ''" alt="image" loading="lazy">
        </NuxtLink>
        <ul>
          <li>
            <NuxtLink :to="localeRoute('/')">{{$t('navbar.home')}}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localeRoute('/projects')">{{$t('navbar.projects')}}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localeRoute('/chats')">{{$t('navbar.chats')}}</NuxtLink>
          </li>
        </ul>
        <div class="flex_buttons" v-if="!useCookie('token')?.value">
          <NuxtLink @click="globalStore.defineAuthProcess('signUp')" :to="localeRoute('/auth')" class="main-btn reversed">
            {{$t('navbar.signUp')}}
          </NuxtLink>
          <NuxtLink @click="globalStore.defineAuthProcess('signIn')" :to="localeRoute('/auth')" class="main-btn">
            {{$t('navbar.signIn')}}
          </NuxtLink>
        </div>
        <div class="profile_control" v-else>
          <button :class="['pi pi-bell notification', { active : showNotifications }]" @click="handleNotifications">
            <div class="notification_badge" v-if="globalStore?.isNotified">
              <!-- {{ countNotifications }} -->
            </div>
          </button>
          <div class="profile" @click="showProfileDropdown = !showProfileDropdown">
            <div class="image">
              <img :src="globalStore?.user?.image || '/assets/images/user.svg'" alt="image" loading="lazy">
            </div>
            <span>{{globalStore?.user?.name || ''}}</span>
            <i class="pi pi-angle-down"></i>
          </div>
          <LanguageSwitch />
          <ol class="profile_dropdown" v-if="showProfileDropdown">
            <li>
              <NuxtLink :to="localeRoute('/profile')">
                <span>{{$t('navbar.profileDropdown.profile')}}</span>
                <i class="pi pi-angle-left"></i>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localeRoute('/settings')">
                <span>{{$t('navbar.profileDropdown.settings')}}</span>
                <i class="pi pi-angle-left"></i>
              </NuxtLink>
            </li>
            <li v-if="globalStore.userType == 2">
              <NuxtLink :to="localeRoute('/wallet')">
                <span>{{$t('navbar.profileDropdown.wallet')}}</span>
                <i class="pi pi-angle-left"></i>
              </NuxtLink>
            </li>
            <li v-if="globalStore.userType == 2">
              <NuxtLink :to="localeRoute('/packages')">
                <span>{{$t('navbar.profileDropdown.packages')}}</span>
                <i class="pi pi-angle-left"></i>
              </NuxtLink>
            </li>
            <li v-if="globalStore.userType == 2">
              <NuxtLink :to="localeRoute('/my_package')">
                <span>{{$t('navbar.profileDropdown.myPackages')}}</span>
                <i class="pi pi-angle-left"></i>
              </NuxtLink>
            </li>
            <li v-if="globalStore.userType == 2">
              <NuxtLink :to="localeRoute('/employees')">
                <span>{{$t('navbar.profileDropdown.followers')}}</span>
                <i class="pi pi-angle-left"></i>
              </NuxtLink>
            </li>
            <li v-if="globalStore.userType == 2">
              <NuxtLink :to="localeRoute('/join_requests')">
                <span>{{$t('navbar.profileDropdown.requests')}}</span>
                <i class="pi pi-angle-left"></i>
              </NuxtLink>
            </li>
            <li class="logout" @click="handleShowLogoutPopup">
              <span>{{$t('navbar.profileDropdown.logout')}}</span>
              <i class="pi pi-angle-left"></i>
            </li>
          </ol>
          <ol class="profile_dropdown notifications" v-if="showNotifications">
            <div class="header_notification">
              <h4>{{$t('navbar.profileDropdown.notifications')}}</h4>
              <NuxtLink :to="localeRoute('/notifications')">{{$t('navbar.profileDropdown.showMore')}}</NuxtLink>
            </div>
            <li 
              v-for="(notification, index) in getResult?.notifications?.data?.slice(0, 5)"
              :key="index"
              v-if="!globalStore?.loading"
            >
              <NuxtLink 
                :to="localeRoute(
                  notification?.type == 'admin_notify' ? '' : 
                  notification?.type == 'change_complaint_status' ? 
                  localeRoute(`/complaints/${notification?.data?.complaint_id}`) : 
                  `/researches/${notification?.data?.opportunity_id}` 
                )">
                <div class="image">
                  <!-- <img v-if="notification.type == 'admin_notify'" src="/assets/images/settings.png" alt="image" loading="lazy"> -->
                  <img src="/assets/images/logo.png" alt="image" loading="lazy">
                </div>
                <p>{{notification?.body}}</p>
              </NuxtLink>
              <button @click="handleDeleteNotification(notification?.id)" class="pi pi-times"></button>
            </li>
            <li 
              v-for="(skeleton, index) in 5" 
              :key="'skeleton-'+index"
              v-if="globalStore?.loading"
              class="skeleton-item"
            >
              <NuxtLink>
                <div class="image skeleton-image">
                  <Skeleton width="2rem" height="2rem" />
                </div>
                <p style="width: 100%; margin-inline-start: 10px;"><Skeleton width="100%" height="1.5rem" /></p>
              </NuxtLink>
            </li>
            <li class="!justify-center" v-if="!globalStore.loading &&  getResult?.notifications?.data?.length == 0">
              {{ globalStore.lang == 'ar' ? 'لا توجد إشعارات' : 'No Notifications' }}
            </li>
          </ol>
        </div>
      </div>
    </div>
    <LogoutPopup 
      v-if="showLogoutPopup"
      @handleShowLogoutPopup = "handleShowLogoutPopup"
      @handleLogout="handleLogout"
    />
  </div>
</template>

<script setup>
  import en_logo from '@/assets/images/staticPage_image.png'
  import ar_logo from '@/assets/images/header_logo.png'

  const { locale } = useI18n()

  const logo = computed(()=>{
    if(locale.value == 'ar'){
      return ar_logo
    }else{
      return en_logo
    }
  })
  
  // define auth store
  const auth = useAuth()

  // define global store
  const globalStore = useGlobalStore()

  // define route
  const route = useRoute()

  // define locale route 
  const localeRoute = useLocaleRoute()

  // define sapi methods
  const {
    submitMethod,
    submitResult,
    getMethod,
    getResult
  } = useApiMethods()
  
  // handle logout popup
  const showLogoutPopup = ref(false)
  const handleShowLogoutPopup = () => {
    showLogoutPopup.value = !showLogoutPopup.value
  }

  const handleLogout = () => {
    handleShowLogoutPopup()
    useCookie('auth').value = ''
    submitMethod(`sign-out?device_id=${globalStore.device_id}` , true , '' , 'DELETE' , 'reload_page')
  }

  // define show profile dropdown
  const showProfileDropdown = ref(false)

  // define handle notifications
  const showNotifications = ref(true)


  const handleNotifications = () => {
    showNotifications.value = !showNotifications.value
    globalStore.isNotified = false
  }

  const handleClickOutside = (event) => {
    const dropdown = document.querySelector('.profile_control');
    if (showProfileDropdown.value && dropdown && !dropdown.contains(event.target)) {
      showProfileDropdown.value = false;
    }
    if (showNotifications.value && dropdown && !dropdown.contains(event.target)) {
      showNotifications.value = false;
    }
  };

  const handleDeleteNotification = (notificationID) =>{
    submitMethod(`delete-notification/${notificationID}` , true , '' , 'DELETE' , '' , 'notifications')
  }


  watchEffect(()=>{
    if(route.path){
      showNotifications.value = false
      showProfileDropdown.value = false
    }

    if(submitResult?.value?.data?.key == 'success' && submitResult?.value?.endPoint.startsWith('delete-notification')){
      globalStore.totalNotifications -= 1
    }
  })

  watch(() => globalStore.totalNotifications, (newVal) => {
    if(newVal && newVal != (getResult?.value?.notifications?.pagination?.total_items || 0)){
      getMethod('notifications', '', true, false)
    }
  })

  watch(showProfileDropdown, (newValue) => {
    if (newValue) {
      showNotifications.value = false
    }
  })

  watch(showNotifications, (newValue) => {
    if (newValue) {
      showProfileDropdown.value = false
    }
  })

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    getMethod('notifications' , '' , true , false)
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });


</script>

<style lang="scss" scoped>
  .navbar{
    margin-bottom: 30px;
    .content{
      @include displayFlex($justify : flex-start );
      .image{
        max-width: 250px;
        height: 70px;
        flex-shrink: 0;
      }
      ul{
        @include displayFlex();
        margin-inline-start: 50px;
        li{
          a{
            padding-block: 24px;
            padding-inline: 14px;
            @include displayFlex();
            font-size: 16px;
            font-weight: 500;
            position: relative;
            transition: 0.3s;
            border-radius: 0 0 5px 5px;
            &::after{
              content: '';
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 90%;
              height: 5px;
              border-radius: 5px;
              background:transparent
            }
            &:hover{
              background: rgba(236, 236, 236, 0.5019607843);
              &::after{
                background: $secColor;
              }
            }
          }
        }
        @media (max-width : 1100px){
          display: none;
        }
      }
      .flex_buttons{
        max-width: 450px;
        width: 100%;
        gap: 10px;
        margin-block: 0;
        margin-inline-start: auto;
        justify-content: flex-end;
        .main-btn{
          margin-top: 0;
          margin: 0;
          max-width: 150px !important;
        }
      }
      .pi-bell{
        font-size: 20px;
        width: 60px;
        height: 100%;
        position: relative;
        transition: 0.3s;
        border-radius: 0 0 5px 5px;
        padding-block: 24px;
          .notification_badge{
            position: absolute;
            inset-inline-start: 15px;
            top: 15px;
            width: 10px;
            height: 10px;
            font-size: 12px;
            background: #FF3535;
            color: #fff;
            border-radius: 50%;
            z-index: 9;
            @include displayFlex();
            animation: pulse 1s infinite alternate-reverse ;
          }
        &::after{
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          height: 5px;
          border-radius: 5px;
          background:transparent;
          transition: 0.3s;
        }
        &:hover , 
        &.active{
          background: rgba(236, 236, 236, 0.5019607843);
          &::after{
            background: $secColor;
          }
        }
      }
      .profile_control{
        margin-inline-start: auto;
        @include displayFlex();
        position: relative;
        cursor: pointer;
        .profile{
          @include displayFlex($gap : 5px);
          .image{
            width: 30px;
            height: 30px;
            border-radius: 50%;
            overflow: hidden;
          }
          span{
            flex-shrink: 0;
            max-width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .profile_dropdown{
          position: absolute;
          top: 60px;
          right: 60px;
          z-index: 9999;
          background: #fff;
          padding: 10px 8px;
          border-radius: 0 0 8px 8px;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1019607843);
          width: 186px;
          li{
            &:not(:last-of-type){
              border-bottom: 0.5px solid #ECECEC;
            }
            a{
              @include displayFlex($justify : space-between);
              padding-block: 10px;
              flex-grow: 1;
              span{
                font-size: 14px;
              }
              // .pi-angle-left{
              //   transition: 0.3s;
              // }
              // &:hover{
              //   .pi-angle-left{
              //     transition: 0.3s;
              //     transform: translateX(-8px);
              //   }
              // }
            }
            &.logout{
              @include displayFlex($justify : space-between);
              color: $dangerColor;
              padding-block-start: 5px;
            }
          }
          &.notifications{
            right: -50%;
            max-width: 400px;
            width: 100%;
            padding-inline: 10px;
            box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.22);
            .header_notification{
              @include displayFlex($justify : space-between);
              margin-bottom: 8px;
              h4{
                font-size: 16px;
              }
              a{
                font-size: 14px;
                color: $secColor;
                &:hover{
                  text-decoration: underline;
                }
              }
            }
            li{
              @include displayFlex($justify : space-between , $gap : 5px);
              width: 100%;
              a{
                justify-content: flex-start;
                gap: 5px;
                .image{
                  max-width: 25px !important;
                }
                p{
                  @include textTruncate(1);
                }
              }
              button.pi-times{
                font-size: 14px;
                color: $dangerColor;
                background: #fff;
                border: 1px solid #fff;
                padding: 5px;
                border-radius: 3px;
                &:hover{
                  background: $dangerColor;
                  color: #fff;
                }
              }
            }
            .empty{
              min-height: unset;
            }
            .image{
              height: fit-content !important;
            }
            
          }
        }
      }
      @media (max-width : 567px){
        flex-wrap: wrap;
        justify-content: center;
        .flex_buttons{
          justify-content: center;
          flex-wrap: nowrap;
          margin: 0 auto;
        }
        .profile_control{
          margin-inline-start: unset;
        }
      }
    }
  }

  .empty {
    margin: 0 !important;
  }
  .eyes-container{
    display: none !important;
  }
</style>