<template>
  <div class="popup">
    <div class="content">
      <button class="close_btn" @click="emit('handleShowLogoutPopup')">
        <i class="pi pi-times"></i>
      </button>
      <div class="image">
        <img src="/assets/images/logout.png" alt="image" loading="lazy">
      </div>
      <h3 class="title centered">
        {{ $t('logout_popup.title') }}
      </h3>
      <div class="flex_buttons">
        <button class="main-btn danger" @click="emit('handleLogout')">
          {{ $t('logout_popup.logout') }}
        </button>
        <button class="main-btn reversed" @click="emit('handleShowLogoutPopup')">
          {{ $t('logout_popup.back') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  // define emits 
  const emit = defineEmits(['handleShowLogoutPopup' , 'handleLogout'])
</script>

<style lang="scss" scoped>
  .popup{
    .content{
      gap: 50px;
      .image{
        margin-bottom: 0;
      }
    }
  }
</style>