<template>
  <section class="static_page">
    <div class="image">
      <img src="/assets/images/staticPage_image.png" alt="logo" loading="lazy">
    </div>
    <div class="head">
      <h4 class="title">{{ $t('footer.links.terms') }}</h4>
      <p>
        {{ getResult }}
      </p>
    </div>
  </section>
</template>

<script setup>
  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()

  onMounted(()=>{
    getMethod('terms' , '' , false , false)
  })
</script>

<style lang="scss" scoped>

</style>