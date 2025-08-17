<template>
  <div class="popup">
    <div class="content">
      <button class="close_btn" @click="emit('handleShowWalletPopup')">
        <i class="pi pi-times"></i>
      </button>
      <h3 class="title centered">
        {{$t('wallet_page.recharge_popup.title')}}
      </h3>
      <form action="">
        <label for="money">{{$t('wallet_page.recharge_popup.label')}}</label>
        <div class="input">
          <input 
            id="money"
            type="number"
            v-model="amount"
            :placeholder=" $t('wallet_page.recharge_popup.placeholder')"
            @keydown="($event) => { if ($event.key === '-') $event.preventDefault(); }"
          >
        </div>
      </form>
      <div class="flex_buttons">
        <button class="main-btn" @click="emit('handleRecharge' , amount)">
          {{$t('wallet_page.recharge_popup.recharge')}}
        </button>
        <button class="main-btn reversed"  @click="emit('handleShowWalletPopup')">
          {{$t('wallet_page.recharge_popup.back')}}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
  // define emits 
  const emit = defineEmits(['handleShowWalletPopup' , 'handleRecharge'])

  // define amount
  const amount = ref()
</script>

<style lang="scss" scoped>

</style>