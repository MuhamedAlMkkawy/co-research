<template>
  <div>
    <section class="auth_page page">
      <div class="image">
        <img src="/assets/images/staticPage_image.png" alt="image" loading="lazy">
      </div>
      <p>{{$t('identity.welcome')}}</p>
      <h3 class="title centered">{{$t('identity.title')}}</h3>
      <form action="" @submit.prevent="handleSubmit">
        <label for="identity">{{$t('identity.input.label')}}</label>
        <div class="input">
          <div class="image">
            <img src="/assets/images/card.png" alt="image" loading="lazy">
          </div>
          <input 
            id="identity"
            type="number"
            :placeholder="$t('identity.input.placeholder')"
            v-model="body.identity_number"
          >
        </div>
        <button class="main-btn">
          {{$t('identity.button')}}
        </button>
      </form>
      <h5>
        {{$t('identity.login_text')}} 
        <NuxtLink @click="globalStore.defineAuthProcess('signIn')" :to="localeRoute('/auth')">
          {{$t('identity.login_link')}}
        </NuxtLink>
      </h5>
    </section>
    <LanguageSwitch />
    <CheckIdentityPopup 
      v-if="showCheckIdentityPopup"
      :popupTitle="$t('identity.popup.title')"
    />
  </div>
</template>

<script setup>
  // define i18n
  const { t } = useI18n()


  // define locale route
  const localeRoute = useLocaleRoute()

  // define global store 
  const globalStore = useGlobalStore()

  // define router
  const router = useRouter()

  // define toast msg
  const {
    showErrorToast
  } = useToastMsg()

  // for not viweing the layout here 
  definePageMeta({
    layout: false,
  });

  const body = ref({
    identity_number : '',
    terms : false
  })

  // handle show identity popup
  const showCheckIdentityPopup = ref(false)
  const handleShowCheckIdentityPopup = () => {
    showCheckIdentityPopup.value = !showCheckIdentityPopup.value
  }

  // handle submit form
  const handleSubmit = () => {
    if (!body.value.identity_number) {
      showErrorToast(t('validations.identity.required'));
      return;
    }
    else if (body.value.identity_number.toString().length < 10) {
      showErrorToast(t('validations.identity.length'));
      return;
    }
    // else if (!body.value.terms) {
    //   showErrorToast(t('validations.identity.terms_required'));
    // }
    else{
      handleShowCheckIdentityPopup();
      globalStore.handleIdentityNumber(body.value.identity_number);
      setTimeout(()=>{
        router.push(localeRoute('/auth/register'));
      } , 1000)
    }
  }
</script> 

<style lang="scss" scoped>
  .auth_page form{
    margin-top: 50px;
    .input{
      margin-bottom: 60px;
    }
    .input-wrap{
      @include displayFlex($justify : flex-start , $gap:5px);
      input{
        width: 15px;
      }
      label{
        font-size: 18px;
        font-weight: 400;
        margin-bottom: 0;
      }
    }
    .main-btn{
      margin-top: 5px !important;
    }
  }
</style>