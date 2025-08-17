<template>
  <div class="popup">
    <div class="content">
      <button class="close_btn" @click="emit('handleShowOrganizationProjectsPopup')">
        <i class="pi pi-times"></i>
      </button>
      <h3 class="title">
        {{
          $t('settings_page.orgnaization_visibility')
        }}
      </h3>
    </div>
  </div>
</template>

<script setup>
  // define emits
  const emit = defineEmits(['handleShowOrganizationProjectsPopup'])
</script>

<style lang="scss" scoped>

</style>