<template>
  <div class="popup">
    <div class="content">
      <div class="image">
        <img src="/assets/images/time.png" alt="image" loading="lazy">
      </div>
      <h3 class="title">
       {{ props.text }}
      </h3>
      <div class="flex_buttons">
        <NuxtLink to="/researches" class="main-btn">الفرص البحثية</NuxtLink>
        <NuxtLink to="/" class="main-btn reversed" style="margin: 0;">الرئيسية</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
  // define props
  const props = defineProps({
    text : String
  })
</script>

<style lang="scss" scoped>
  .popup{
    .content{
      justify-content: center;
      min-height: unset !important;
      gap: 30px;
      padding-block: 20px;
      h3.title{
        font-size: 18px;
        font-weight: 600;
      }
      .flex_buttons{
        .main-btn{
          width: unset;
          flex-grow: 1 !important;
        }
      }
    }
  }
</style>