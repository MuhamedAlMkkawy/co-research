<template>
  <div class="popup">
    <div class="content">
      <!-- <buuton class="close_btn" @click="handleSuccessPopup">
        <i class="pi pi-times"></i>
      </buuton> -->
      <div class="image">
        <img src="/assets/images/success_popup.png" alt="image" loading="lazy">
      </div>
      <h3 class="title centered">
        {{ props.successText }}
      </h3>
      <div class="flex_buttons">
        <button class="main-btn" @click="router.push(localeRoute('/'))">
          {{$t('popup.home')}}
        </button>
        <button class="main-btn reversed" @click="$route.path.endsWith('profile') ? router.push(localeRoute('/profile')) : router.go(0)">
          {{$t('popup.back')}}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  // define router
  const router = useRouter()

  // define locale route
  const localeRoute = useLocaleRoute()

  //  define props
  const props = defineProps({
    successText : String
  })
</script>

<style lang="scss" scoped>
  .popup .content {
    min-height: 400px;
    .image{
      margin-bottom: 0;
    }
  }
  h3.title{
    margin-bottom:0;
  }
</style>