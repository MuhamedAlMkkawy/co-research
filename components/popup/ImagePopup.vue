<template>
  <div>
    <div class="popup">
      <div class="content">
        <button class="close_btn" @click="emit('handleShowImagePopup')">
          <i class="pi pi-times"></i>
        </button>
        <div class="image">
          <img :src="props.image" alt="image" loading="lazy">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  // define emits 
  const emit = defineEmits(['handleShowImagePopup'])
  // define props
  const props =defineProps({
    image : {
      type : String,
      default : ""
    }
  })
</script>

<style lang="scss" scoped>
  .popup .content {
    border-radius: 15px !important;
    padding: 10px !important;
    .image{
      margin-bottom: 0 !important;
      max-width: unset !important;
      img{
        object-fit: contain;
        max-height: 500px;
      }
    }
  }
</style>