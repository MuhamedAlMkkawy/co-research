<template>
  <section class="page wallet">
    <h3 class="title">
      {{ $t('wallet_page.title') }}
    </h3>
    <div class="content">
      <div class="image">
        <img src="/assets/images/wallet.png" alt="image" loading="lazy">
      </div>
      <div class="text">
        <div class="image">
          <img src="/assets/images/dollar_sign.png" alt="image" loading="lazy">
        </div>
        <h3 class="title centered" v-if="getResult">
          {{ $t('wallet_page.your_current_balance') }}
          <br>
          <span>
            {{getResult?.available_balance}} 
            {{$t('wallet_page.currency')}}
          </span>
        </h3>
        <h3 v-else>
          <Skeleton width="100%" height="50px" style="margin-top: 30px;" />
        </h3>
      </div>
      <button class="main-btn" @click="handleShowWalletPopup" v-if="getResult">
        {{ $t('wallet_page.charge_wallet') }}
      </button>
    </div>
    <WalletPopup 
      v-if="showWalletPopup"
      @handleShowWalletPopup="handleShowWalletPopup"
      @handleRecharge="handleRecharge"
    />
    <SuccessPopup 
      v-if="showSuccessPopup"
      :successText="$t('wallet_page.recharge_popup.success')"
      @handleShowSuccessPopup = "handleShowSuccessPopup"
    />
  </section>
</template>

<script setup>
  // define api methods
  const {
    getMethod,
    getResult,
    submitMethod,
    submitResult
  } = useApiMethods()



  // define success popup
  const showSuccessPopup = ref(false)
  const handleShowSuccessPopup = () => {
    showSuccessPopup.value = !showSuccessPopup.value
  }

  // define wallet popup
  const showWalletPopup = ref(false)
  const handleShowWalletPopup = () => {
    showWalletPopup.value = !showWalletPopup.value
  }

  const handleRecharge = (chargeAmount) => {
    submitMethod('charge-wallet' , true , {amount : chargeAmount} , 'POST' , '')
    handleShowWalletPopup()
  }
  
  watchEffect(()=>{
    if(submitResult?.value?.data?.key == 'success'){
      handleShowSuccessPopup()
    }
  })

  onMounted(()=>{
    getMethod('show-wallet' , null , true , false)
  })
</script>

<style lang="scss" scoped>
  .content{
    background: rgba($color: $thirdColor, $alpha: 0.5);
    border-radius: 16px;
    padding: 85px 20px clamp(15px , 2.5vw , 25px);
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
    > .image{
      max-width: 300px;
      margin: 0 auto 50px;
    }

    .text{
      border: 1px dashed $mainColor;
      padding: 20px;
      max-width: 500px;
      margin: 0 auto 30px;
      border-radius: 4px;
      > .image{
        width: 32px;
        margin: 0 auto;
      }
      h3.title{
        margin-bottom: 0;
        font-weight: 700;
        line-height: 1.4;
      }
    }
    .main-btn{
      max-width: 500px;
      margin: 0 auto;
    }
  }
</style>