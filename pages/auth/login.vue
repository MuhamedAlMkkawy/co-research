<template>
  <div>
    <section class="auth_page page">
      <div class="image">
        <img src="/assets/images/staticPage_image.png" alt="image" loading="lazy">
      </div>
      <p>{{$t('login.welcome')}}</p>
      <h3 class="title centered">{{$t('login.title')}}</h3>
      <form action="" @submit.prevent="handleSubmit">
        <label for="phone">{{$t('login.phone.label')}}</label>
        <div class="input">
          <div class="image"><img src="/assets/images/phone.svg" alt="image" loading="lazy"></div>
          <input 
            id="phone"
            type="text"
            :placeholder="$t('login.phone.placeholder')"
            v-model="body.phone"
            @keydown.prevent.enter="handleSubmit"
          >
        </div>
        <button class="main-btn">
          {{$t('login.button')}}
        </button>
      </form>
      <h5>
        {{$t('login.register_text')}} 
        <NuxtLink @click="globalStore.defineAuthProcess('signUp')" :to="localeRoute('/auth')">
          {{$t('login.register_link')}}
        </NuxtLink>
      </h5>
      <NuxtLink :to="localeRoute('/')" class="main-btn sec_btn reversed">
        {{$t('login.guest')}}
      </NuxtLink>
    </section>
    <LanguageSwitch />
    <Loading v-if="globalStore?.loading" />
  </div>
</template>

<script setup>
  // define i18n 
  const { t } = useI18n()

  // define global store
  const globalStore = useGlobalStore()

  // define locale route 
  const localeRoute = useLocaleRoute()

  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()

  // handle toast message
  const { showErrorToast } = useToastMsg()

  // for not viweing the layout here 
  definePageMeta({
    layout: false,
  });

  // define body
  const body = ref({
    phone:'',
  })

  // handle submit form
  const handleSubmit = () => {
    if(!body?.value?.phone) {
      showErrorToast(t('validations.login.phone_required'))
    }else if(body?.value?.phone?.length < 9 || body?.value?.phone?.length > 10){
      showErrorToast(t('validations.login.phone_length'))
    }else{
      globalStore.setUserPhone(body?.value?.phone)
      getMethod(`send-code?phone=${body?.value?.phone}&user_type=${globalStore.userType}` , '' , false , true)
    }
  }
</script>

<style lang="scss" scoped>

</style>