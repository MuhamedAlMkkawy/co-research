<template>
  <div class="page auth_page settings_page">
    <h3 class="header_title">
      {{ $t('settings_page.changePhoneNumber') }}
    </h3>
    <div class="image">
      <img src="/assets/images/staticPage_image.png" alt="image" loading="lazy">
    </div>
    <h3 class="title">{{ $t('settings_page.new_phone.new_phone_text') }}</h3>
    <form action="" @submit.prevent="handleSubmit">
      <label for="phone">{{ $t('settings_page.new_phone.phone_label') }}</label>
      <div class="input">
        <div class="image"><img src="/assets/images/phone.svg" alt="image" loading="lazy"></div>
        <input 
          id="phone"
          type="text"
          :placeholder="$t('settings_page.new_phone.phone_placeholder')"
          v-model="body.phone"
          @keydown.prevent.enter="handleSubmit"
        >
      </div>
      <button class="main-btn">
        {{ $t('settings_page.new_phone.submit_btn') }}
      </button>
    </form>
  </div>
</template>

<script setup>
  // define body
  const body = ref({
    phone : '',
    country_code : '966'
  })


  // define global store 
  const globalStore = useGlobalStore()


  // define api methods
  const {
    submitMethod
  } = useApiMethods()


  // handle submit 
  const handleSubmit = () => {
    globalStore.pageBeforeActivationCode = 'new_phone'
    globalStore.setUserPhone(body.value.phone)
    submitMethod('change-phone-send-code' , true , body.value , 'POST' , '/settings/activation_code')
  }
</script>

<style lang="scss" scoped>
  .auth_page{
    background: transparent;
    padding: 0;
    // margin: 0;
    > h3.header_title{
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 50px;
    }
    h3.title{
      text-align: center;
    }
  }
  .main-btn,form{
    max-width: 500px;
    margin: 0 auto;
    margin-top: 65px;
  }
</style>