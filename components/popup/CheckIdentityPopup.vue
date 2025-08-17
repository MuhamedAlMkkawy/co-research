<template>
  <div class="popup">
    <div class="content">
      <div class="image">
        <img src="/assets/images/time.png" alt="image" loading="lazy">
      </div>
      <h3 class="title">
        {{ props.popupTitle }}
      </h3>
    </div>
  </div>
</template>

<script setup>
  // define i18n 
  const {t} = useI18n()


  // define props
  const props = defineProps({
    popupTitle: {
      type: String,
      default: null,
    },
  })
</script>

<style lang="scss" scoped>
  .popup{
    .content{
      justify-content: center;
      min-height: unset !important;
      padding-block: 50px;
      .image{
        animation: rotate 12s infinite linear alternate  ; 
      }
      h3.title{
        font-size: 18px;
        font-weight: 600;
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>