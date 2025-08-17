<template>
  <div class="popup">
    <div class="content">
      <button class="close_btn"  @click="emit('handleShowPackageSubscribePopup')">
        <i class="pi pi-times"></i>
      </button>
      <h3 class="title centered">
        {{ $t('packages_page.popup.title') }}
      </h3>
      <form action="">
        <div class="input-wrap">
          <input 
            type="radio" 
            name="pay" 
            id="wallet" 
            value="wallet"
            v-model="body.pay_method"
          >
          <label for="wallet">{{ $t('packages_page.popup.wallet') }}</label>
        </div>
        <div class="input-wrap">
          <input 
            type="radio" 
            name="pay" 
            id="electronic" 
            value="electronic"
            v-model="body.pay_method"
          >
          <label for="electronic">{{ $t('packages_page.popup.electronic') }}</label>
        </div>
      </form>
      <div class="flex_buttons">
        <button 
          class="main-btn" 
          @click="emit('handleSubscribePackage' , body.pay_method)"
        >
          {{ $t('packages_page.popup.agree') }}
        </button>
        <button 
          class="main-btn reversed" 
          @click="emit('handleShowPackageSubscribePopup')"
        >
          {{ $t('packages_page.popup.back') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  // define emits 
  const emit = defineEmits(['handleShowPackageSubscribePopup' , 'handleSubscribePackage'])

  // define body
  const body = ref({
    pay_method : ""
  })
</script>

<style lang="scss" scoped>
  .popup .content{
    gap: 0;
    min-height: 350px !important;
    h3.title{
      margin-bottom: 0;
    }
    form {
      height: unset;
      label{
        margin-bottom: 0;
        font-weight: 400;
      }
    }
  }
</style>