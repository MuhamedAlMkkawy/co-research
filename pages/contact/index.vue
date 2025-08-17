<template>
  <section class="static_page">
    <div class="image">
      <img src="/assets/images/staticPage_image.png" alt="logo" loading="lazy">
    </div>
    <div class="head">
      <h4 class="title">{{ $t('contact.title') }}</h4>
      <form action="" @submit.prevent="handleSubmit">
        <label for="name">{{ $t('contact.form.name.label') }}</label>
        <div class="input">
          <input 
            id="name"
            type="text"
            v-model="body.name"
            v-on:input="body.name = body.name.replace(/^ /, '')"          
          >
          <div class="input_placeholder">
            <i class="pi pi-user"></i>
            <span v-if="!body.name">{{ $t('contact.form.name.placeholder') }}</span>
          </div>
        </div>
        <label for="phone">{{$t('contact.form.phone.label')}}</label>
        <div class="input">
          <input 
            id="phone"
            type="text"
            v-model="body.phone"
            v-on:input="body.phone = body.phone.replace(/^ /, '')" 
          >
          <div class="input_placeholder">
            <i class="pi pi-phone"></i>
            <span v-if="!body.phone">{{ $t('contact.form.phone.placeholder') }}</span>
          </div>
        </div>
        <label for="message_title">{{ $t('contact.form.title.label') }}</label>
        <div class="input">
          <textarea 
            id="message_title"
            v-model="body.message"
            v-on:input="body.message = body.message.replace(/^ /, '')"
            />
            <!-- :placeholder="$t('contact.form.title.placeholder')" -->
          <div class="input_placeholder">
            <i class="pi pi-clipboard"></i>
            <span v-if="!body.message">{{ $t('contact.form.title.placeholder') }}</span>
          </div>
        </div>
        <button class="main-btn" type="submit">
          {{ $t('contact.form.send') }}
        </button>
      </form>
    </div>
    <SuccessPopup 
      v-if="showSuccessPopup"
      :successText="$t('popup.contact_text')"
      @handleShowSuccessPopup="handleShowSuccessPopup"
    />
  </section>
</template>

<script setup>
  // define i18n
  const { t } = useI18n()

  // define body
  const body = ref({
    name: null,
    phone: null,
    message: null,
  })

  // define toast message
  const {
    showErrorToast
  } = useToastMsg()

  // define api methods
  const {
    submitMethod,
    submitResult
  } = useApiMethods()


  // define success popup
  const showSuccessPopup = ref(false)
  const handleShowSuccessPopup = () => {
    showSuccessPopup.value = !showSuccessPopup.value
  }

  // define submit function
  const handleSubmit = () => {
    if(!body.value.name.trim()){
      showErrorToast(t('validations.contact.name_required'))
    }else if(body.value.name.length < 2){
      showErrorToast(t('validations.contact.name_length'))
    }else if(!body.value.phone.trim()){
      showErrorToast(t('validations.contact.phone_required'))
    }else if(body.value.phone.length < 9 ){
      showErrorToast(t('validations.contact.phone_length'))
    }else if(!body.value.message.trim()){
      showErrorToast(t('validations.contact.message_required'))
    }
    // else if(body.value.message.length < 10){
    //   showErrorToast(t('validations.contact.message_length'))
    // }
    else{
      submitMethod('contact-us' , true , body.value , 'POST' , '')
    }
  }

  watchEffect(()=>{
    if(submitResult?.value?.data?.key == 'success'){
      handleShowSuccessPopup()
    }
  })
</script>

<style lang="scss" scoped>
  .static_page{
    // align-items: flex-start;
    gap: 0px 100px;
    .head{
      flex-grow: 1;
      width: 100%;
      form{
        margin-top: clamp(20px , 2.5vw , 60px);
        label{
          display: block;
          margin-bottom: 5px;
        }
        .input{
          margin-bottom: 20px;
          input , textarea{
            padding-inline-start: 18px;
          }
        }
      }
    }
    @media (max-width : 991px){
      flex-direction: column;
      .image{
        display: none;
      }
    }
  }
</style>