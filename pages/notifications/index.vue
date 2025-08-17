<template>
  <section class="page notifications_page">
    <div class="header_notification">
      <h3 class="title">{{$t('header_notification.title')}}</h3>
      <button 
        class="danger" 
        @click="handleDeleteAllNotifications"
        v-if="getResult?.notifications?.data?.length > 0"
      >
        {{$t('header_notification.deleteAll')}}
      </button>
    </div>
    <ol class="profile_dropdown notifications">
      <NuxtLink 
        v-for="(notification, index) in Array(5).fill(0)" 
        :key="index"
        v-if="globalStore?.loading"
      >
        <div class="notification">
          <Skeleton width="2rem" height="2rem" />
          <Skeleton width="100%" height="1.5rem" />
        </div>
      </NuxtLink>
      <NuxtLink 
        v-for="(notification, index) in getResult?.notifications?.data"
        :key="index"
        v-if="getResult?.notifications?.data && !globalStore?.loading"
        :to="localeRoute(
          notification?.type == 'admin_notify' ? '' : 
          notification?.type == 'change_complaint_status' ? 
          localeRoute(`/complaints/${notification?.data?.complaint_id}`) : 
          `/researches/${notification?.data?.opportunity_id}` 
        )"
      >
        <div class="notification">
          <div class="image">
            <!-- <img v-if="notification.type == 'admin_notify'" src="/assets/images/settings.png" alt="image" loading="lazy"> -->
            <img src="/assets/images/logo.png" alt="image" loading="lazy">
          </div>
          <p>{{notification?.body}}</p>
        </div>
        <button @click="handleDeleteNotification(notification?.id)" class="pi pi-times"></button>
      </NuxtLink>
      <Empty v-if="getResult?.notifications?.data?.length == 0 && !globalStore?.loading" />
    </ol>
  </section>
</template>

<script setup>
  // define globalStore
  const globalStore = useGlobalStore()

  // define locale route
  const localeRoute = useLocaleRoute()


  // define api methods
  const {
    getMethod,
    getResult,
    submitMethod
  } = useApiMethods()


  // handle delete notification
  const handleDeleteNotification = (notificationID) =>{
    submitMethod(`delete-notification/${notificationID}` , true , '' , 'DELETE' , '' , 'notifications')
  }
  
  // handle delete all notifications
  const handleDeleteAllNotifications = () =>{
    submitMethod('delete-notifications' , true , '' , 'DELETE' , 'reload_page')
  }


  watchEffect(() => {
    if(getResult?.value?.data?.key == 'success' && getResult?.value?.endPoint.startsWith('delete-notification')){
      globalStore.totalNotifications -= 1
    }
  })

  watch(() => globalStore.totalNotifications, (newVal) => {
    if(newVal && newVal != (getResult?.value?.notifications?.pagination?.total_items || 0)){
      getMethod('notifications', '', true, false)
    }
  })

  onMounted(()=>{
    getMethod('notifications' , '' , true , false)
  })
</script>

<style lang="scss" scoped>
  .notifications_page{
    .header_notification{
      @include displayFlex($justify : space-between);
      width: 100%;
      button{
        color: $dangerColor;
        transition: 0.3s;
        &:hover{
          text-decoration: underline;
        }
      }
    }
    .profile_dropdown.notifications{
      max-width: unset;
      a{
        @include displayFlex($justify : space-between , $gap : 5px);
        width: 100%;
        &:not(:last-of-type){
          border-bottom: 0.5px solid #ECECEC;
        }
        .notification{
          padding-block: 24px;
          // padding-inline: 14px;
          @include displayFlex($justify : flex-start , $gap : 5px);
          font-size: 16px;
          font-weight: 500;
          position: relative;
          transition: 0.3s;
          border-radius: 0 0 5px 5px;
          flex-grow: 1;
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
          .image{
            max-width: 25px !important;
          }
          p{
            @include textTruncate(1);
          }
          &:hover , 
          &.active{
            background: unset !important;
            &::after{
              background: unset !important;
            }
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
    }
  }
</style>