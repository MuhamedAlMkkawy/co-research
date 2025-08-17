<template>
  <div>
    <section class="auth_page page">
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
    <LanguageSwitch />
    <Loading v-if="globalStore?.loading" />
    <CheckIdentityPopup 
      v-if="showCheckIdentityPopup"
      :popupTitle="globalStore.lang == 'ar' ?
        'تم إرسال طلب الانضمام للاداره وفـ انتظار الموافقه عليه' : 
        'The request to join the administration has been sent and is pending approval'"
    />
  </div>
</template>

<script setup>
  // define code
  const code = ref('')

  // for not viweing the layout here 
  definePageMeta({
    layout: false,
  });

  // define global store
  const globalStore = useGlobalStore()

  // define useToastMsg
  const { showErrorToast } = useToastMsg()

  // define api methods
  const {
    submitMethod,
    submitResult,
    getMethod,
  } = useApiMethods()

  // Use the composable
  const { 
    formattedMinutes, 
    formattedSeconds, 
    isTimerRunning, 
    startTimer, 
    stopTimer 
  } = useTimer(2, 0);


  // handle showCheckIdentityPopup
  const showCheckIdentityPopup = ref(false)
  
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
      activateForm.append('phone', globalStore.userPhone);
      activateForm.append('user_type', globalStore.userType);
      activateForm.append('lang', globalStore.lang);
      activateForm.append('device_id', globalStore.device_id);
      activateForm.append('device_type', 'web');
      submitMethod('sign-in', false , activateForm  , 'POST' , '/')
    }
  }


  watchEffect(()=>{
    if(submitResult?.value?.data?.key == 'needApproval'){
      showCheckIdentityPopup.value = true
    }
  })

  // handle resend code
  const handleResendCode = () =>{
    startTimer()
    getMethod(`send-code?phone=${globalStore.userPhone}&user_type=${globalStore.userType}`, '' , false , true)
  }


  // Lifecycle hooks
  onMounted(() => {
    startTimer();
  });

  onUnmounted(() => {
    stopTimer();
  });
</script>

<style lang="scss" scoped>
  .main-btn{
    margin-top: 65px;
  }
</style>