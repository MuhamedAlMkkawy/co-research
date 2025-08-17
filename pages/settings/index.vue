<template>
  <section class="page settings_page">
    <h3 class="title">{{$t('settings_page.title')}}</h3>
    <ul v-if="!globalStore.loading">
      <li @click="handleChangePhoneNumber">
        <div class="text">
          <div class="image">
            <img src="/assets/images/phone.svg" alt="image" loading="lazy">
          </div>
          <h4>{{$t('settings_page.changePhoneNumber')}}</h4>
        </div>
      </li>
      <li @click="handleSwitchIsNotify">
          <div class="text">
            <div class="image">
              <img src="/assets/images/bell.svg" alt="image" loading="lazy">
            </div>
            <h4>{{$t('settings_page.notifications')}}</h4>
          </div>
          <InputSwitch v-model="body.notifications" />
      </li>
      <li @click="handleSwitchVisiblility" v-if="globalStore?.userType != 2">
          <div class="text">
            <div class="image">
              <img src="/assets/images/visible.svg" alt="image" loading="lazy">
            </div>
            <h4>{{$t('settings_page.visibility')}}</h4>
          </div>
          <InputSwitch v-model="body.visiblitiy" />
      </li>
      <!-- <li v-if="globalStore.userType == 2" @click="handleShowOrganizationProjectsPopup">
        <div class="text">
          <div class="image">
            <img src="/assets/images/book.svg" alt="image" loading="lazy">
          </div>
          <h4>{{$t('settings_page.orgnaization_visibility')}}</h4>
        </div>
      </li> -->
      <li @click="handleShowDeleteAccountPopup">
        <div class="text">
          <div class="image">
            <img src="/assets/images/user-remove.svg" alt="image" loading="lazy">
          </div>
          <h4>{{$t('settings_page.deleteAccount')}}</h4>
        </div>
      </li>
    </ul>
    <ul v-else>
      <li v-for="i in 4" :key="i" style="padding: 0;">
        <Skeleton width="100%" height="100%"  />
      </li>
    </ul>
    <DeleteAccountPopup 
      v-if="showDeleteAccountPopup"
      @handleShowDeleteAccountPopup = "handleShowDeleteAccountPopup"
      @handleDeleteAccount = "handleDeleteAccount"
    />
    <OrganizationProjectsPopup 
      v-if="showOrganizationProjectsPopup"
      @handleShowOrganizationProjectsPopup = "handleShowOrganizationProjectsPopup"
    />
  </section>
</template>

<script setup>
  import InputSwitch from 'primevue/inputswitch';

  // define locale route
  const localeRoute = useLocaleRoute()

  // define router 
  const router = useRouter()

  // define global store
  const globalStore = useGlobalStore()

  // define api methods
  const {
    getMethod,
    getResult,
    submitMethod,
    submitResult
  } = useApiMethods()

  // define popup
  const body = ref({
    notifications : false,
    visiblitiy : false
  })
  
  // handle Change Phone Number
  const handleChangePhoneNumber = () => {
    globalStore.pageBeforeActivationCode = 'change_phone'
    router.push(localeRoute('/settings/activation_code'))
  }
  
  // handleSwitchIsNotify
  const handleSwitchIsNotify = () => {
    submitMethod('switch-notify' , true , '' , 'PATCH' , '' )
  }


  // handle switch visibility
  const handleSwitchVisiblility = () => {
    submitMethod('switch-job-availability?_method=PUT', true , '' , 'POST' , '')
  }


  // handle show organization popup
  const showOrganizationProjectsPopup = ref(false)
  const handleShowOrganizationProjectsPopup = () => {
    showOrganizationProjectsPopup.value = !showOrganizationProjectsPopup.value
  }
  

  // handle delete account popup
  const showDeleteAccountPopup = ref(false)
  const handleShowDeleteAccountPopup = () =>{
    showDeleteAccountPopup.value = !showDeleteAccountPopup.value
  }
  
  const handleDeleteAccount = () => {
    submitMethod('delete-account' , true , {device_id : globalStore.device_id} , 'POST' , 'reload_page')
    // handleShowDeleteAccountPopup()
  }

  watch(()=> getResult?.value, (newVal) => {
    if(newVal){
      body.value.notifications = getResult?.value?.notify
      body.value.visiblitiy = getResult?.value?.show_job_title
    }
  })

  watchEffect(()=>{
    if(submitResult?.value?.data?.key == 'success'){
      console.log(submitResult?.value?.data?.data)
      if(submitResult?.value?.endPoint == 'switch-notify'){
        body.value.notifications = submitResult?.value?.data?.data?.notify
      }
      if(submitResult?.value?.endPoint == 'switch-job-availability?_method=PUT'){
        body.value.visiblitiy = submitResult?.value?.data?.data?.show_job_title
      }
    }
  })

  onMounted(()=>{
    getMethod('profile' , null , true , false)
  })
</script>

<style lang="scss" scoped>
  .settings_page{
    ul{
      @include displayFlex($direction : column , $justify : flex-start);
      max-width: 992px;
      margin: 0 auto;
      li{
        height: 100px;
        width: 100%;
        background: $thirdColor;
        border-radius: 12px;
        padding-inline: clamp(12px , 2.5vw , 30px);
        cursor: pointer;
        border: 1px solid $secColor;
        @include displayFlex($justify : space-between , $gap : 10px);
        transition: 0.3s;
        overflow: hidden;
        .text{
          @include displayFlex($justify : flex-start , $gap : 12px);
          .image{
            width: clamp(20px , 2.5vw , 30px);
          }
          h4{
            font-size: 16px;
            font-weight: 500;
          }
        }
        &:hover{
          box-shadow: 0 0 4px rgba($color: $secColor, $alpha: 0.8);
          border-color: transparent;
        }
        &:last-of-type{
          background: rgba($color: $dangerColor, $alpha: 0.25);
        }
      }
    }
  }
</style>