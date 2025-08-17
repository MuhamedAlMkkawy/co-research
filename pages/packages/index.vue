<template>
  <section class="page packages">
    <h3 class="title">{{ $t('packages_page.title') }}</h3>
    <div class="content" v-if="getResult?.length > 0">
      <div 
        class="package_item" 
        v-for="item in getResult" 
        :key="item?.id"
        v-if="!useGlobalStore().loading"
      >
        <div class="image">
          <img :src="item?.image" alt="image" loading="lazy">
        </div>
        <h3 class="title centered">
          {{item?.title}}
        </h3>
        <ul>
          <li>
            <div class="image">
              <img src="/assets/images/users.png" alt="image" loading="lazy">
            </div>
            <h4>{{item?.members_count}} {{$t('packages_page.user')}}</h4>
          </li>
          <li>
            <div class="image">
              <img src="/assets/images/price.png" alt="image" loading="lazy">
            </div>
            <h4>{{item?.price}} {{$t('packages_page.currency')}}</h4>
          </li>
          <li>
            <div class="image">
              <img src="/assets/images/timer.png" alt="image" loading="lazy">
            </div>
            <h4>{{$t('packages_page.title')}} {{item?.package_period_type}}</h4>
          </li>
        </ul>
        <p>
          {{ item?.description }}
        </p>
        <button class="main-btn" @click="handleShowPackageSubscribePopup(item?.id)">
          {{ $t('packages_page.subscribe') }}
        </button>
      </div>
      <div 
        class="package_item" 
        v-for="i in 18" 
        :key="i"
        v-else
      >
        <div class="image" style="margin-bottom: 15px;">
          <Skeleton width="100%" height="100%" />
        </div>
        <h3 class="title centered">
          <Skeleton width="100%" height="40px" />
        </h3>
        <ul>
          <li v-for="i in 3" :key="i">
            <div class="image">
              <Skeleton width="20px" height="20px" />
            </div>
            <h4>
              <Skeleton width="280px" height="20px" />
            </h4>
          </li>
        </ul>
        <Skeleton width="100%" height="40px" style="margin-top: 20px;"/>
      </div>
    </div>
    <Empty v-else />
    <PackageSubscribePopup 
      v-if="showPackageSubscribePopup"
      @handleShowPackageSubscribePopup="handleShowPackageSubscribePopup"
      @handleSubscribePackage = "handleSubscribePackage"
    />
    <SuccessPopup 
      v-if="showSuccessPopup"
      :successText="$t('packages_page.popup.success')"
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
    submitResult,
    showErrorToast
  } = useApiMethods()

  // define the package user want to enroll 
  const package_id = ref()

  // handle success popup
  const showSuccessPopup = ref(false)
  const handleShowSuccessPopup = () => {
    showSuccessPopup.value = !showSuccessPopup.value
  }

  // handle package popup
  const showPackageSubscribePopup = ref(false)
  const handleShowPackageSubscribePopup = (packageID) =>{
    package_id.value = packageID
    showPackageSubscribePopup.value = !showPackageSubscribePopup.value
  }

  const handleSubscribePackage = (pay_method) => {
    if(!pay_method){
      showErrorToast(useGlobalStore().lang == 'ar' ? 'الرجاء اختيار طريقة الدفع' : 'Please select a payment method')
      return
    }
    else if(pay_method == 'electronic'){
      showErrorToast(useGlobalStore().lang == 'ar' ? 'لم يتم تفعيل دفع الكتروني' : 'The electronic payment has not been activated')
    }else{
      submitMethod(`enroll-package-by-${pay_method}` , true , {package_id : package_id.value} , 'POST' , '' , '')
      handleShowPackageSubscribePopup()
    }
  }
  
  
  watchEffect(()=>{
    if(submitResult?.value?.data?.key == 'success'){
      handleShowSuccessPopup()
    }
  })

  onMounted(()=>{
    getMethod('packages' , null , true , false)
  })
</script>

<style lang="scss" scoped>
</style>