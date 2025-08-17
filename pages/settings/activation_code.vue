<template>
  <div>
    <section class="auth_page page">
      <h3 class="header_title">{{$t('settings_page.changePhoneNumber')}}</h3>
      <div class="image">
        <img src="/assets/images/staticPage_image.png" alt="image" loading="lazy">
      </div>
      <p>{{$t('code.text')}}</p>
      <h3 class="title centered">{{$t('code.title')}}</h3>
      <form action="" @submit.prevent="handleSubmit">
        <div class="card flex justify-content-center" style="direction: ltr !important;">
          <InputOtp 
            v-model="code" 
            integerOnly 
            @keydown.prevent.enter="handleSubmit" 
          />
        </div>
        <button class="main-btn">
          {{$t('code.button')}}
        </button>
      </form>
      <h5>
        {{$t("code.have_code") }} 
        <button 
          @click="handleResendCode"
          :class="{'disabled' : isTimerRunning}"
        >
          {{ $t('code.send')}}
        </button>
      </h5>
      <h5> <span>{{ formattedMinutes }}:{{ formattedSeconds }}</span> </h5>
    </section>
    <Loading v-if="globalStore?.loading" />
  </div>
</template>

<script setup>
  // define route 
  const route = useRoute()


  // define code
  const code = ref()

  // define global store
  const globalStore = useGlobalStore()

  // define useToastMsg
  const { showErrorToast } = useToastMsg()

  // define api methods
  const {
    getMethod,
    submitMethod,
  } = useApiMethods()

  // Use the composable
  const { 
    formattedMinutes, 
    formattedSeconds, 
    isTimerRunning, 
    startTimer, 
    stopTimer 
  } = useTimer(2, 0);
  
  // handle submit form
  const handleSubmit = () => {
    if(!code?.value) {
      showErrorToast(globalStore.lang == 'ar' ? 'الرجاء ادخال الكود للاستمرار' : 'Please enter the correct code to continue')
    }
    else if(code?.value?.length < 4) {
      showErrorToast(globalStore.lang == 'ar' ? 'الرجاء ادخال الكود الصحيح' : 'Please enter the correct code')
    }else{
      const activateForm = new FormData();
      activateForm.append('code', code.value);
      if(globalStore.pageBeforeActivationCode == 'new_phone'){
        activateForm.append('country_code', globalStore.country_code);
        activateForm.append('phone', globalStore.userPhone);
      }
      submitMethod(
        globalStore.pageBeforeActivationCode == 'change_phone' ?
        'current-phone-check-code' : 
        'change-phone-check-code', 
        true , 
        activateForm  , 
        'POST' , 
        globalStore.pageBeforeActivationCode == 'change_phone' ?
        '/settings/new_phone' :
        '/profile'
      )
    }
  }

  // handle resend code
  const handleResendCode = () =>{
    startTimer()
    if(globalStore.pageBeforeActivationCode == 'change_phone'){
      getMethod('current-phone-send-code', '' , true , false)
    }else if(globalStore.pageBeforeActivationCode == 'new_phone'){
      submitMethod(
        'change-phone-send-code' , 
        true , 
        {
          country_code : globalStore.country_code,
          phone : globalStore.userPhone
        } , 
        'POST' , 
        ''
      )
    }
  }


  // Lifecycle hooks
  onMounted(() => {
    if(globalStore.pageBeforeActivationCode == 'change_phone'){
      getMethod('current-phone-send-code', '' , true , false)
    }
    startTimer();
  });

  onUnmounted(() => {
    stopTimer();
  });
</script>

<style lang="scss" scoped>
  .auth_page{
    background: transparent;
    padding: 0;
    // margin: 0;
    > h3.header_title{
      font-size: 20px;
      font-weight: 600;
    }
  }
  .main-btn{
    max-width: 500px;
    margin-top: 65px;
  }
</style>