<template>
  <div class="popup">
    <div class="content">
      <button class="close_btn" @click="emit('handleShowDeleteAccountPopup')">
        <i class="pi pi-times"></i>
      </button>
      <div class="image">
        <img src="/assets/images/user-remove.svg" alt="image" loading="lazy">
      </div>
      <h3 class="title centered">
        {{ $t('delete_account_popup.title') }}
      </h3>
      <div class="flex_buttons">
        <button class="main-btn danger" @click="emit('handleDeleteAccount')">
          {{ $t('delete_account_popup.delete_account') }}
        </button>
        <button class="main-btn reversed" @click="emit('handleShowDeleteAccountPopup')">
          {{ $t('delete_account_popup.back') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  const emit = defineEmits(['handleShowDeleteAccountPopup' , 'handleDeleteAccount'])
</script>

<style lang="scss" scoped>  </style>