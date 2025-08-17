<template>
  <div class="popup">
    <div class="content">
      <div class="image">
        <img src="/assets/images/time.png" alt="image" loading="lazy">
      </div>
      <h3 class="title centered">
        {{ $t('research_details_page.join_request.popup.title') }}
      </h3>
      <div class="flex_buttons">
        <NuxtLink :to="$localeRoute('/projects')" class="main-btn">
          {{ $t('research_details_page.join_request.popup.flex_buttons.projects') }}
        </NuxtLink>
        <NuxtLink :to="$localeRoute('/')" class="main-btn reversed">
          {{ $t('research_details_page.join_request.popup.flex_buttons.home') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>