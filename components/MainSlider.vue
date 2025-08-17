<template>
  <div class="home_slider">
    <Carousel id="product_gallery" v-bind="galleryConfig" v-model="currentSlide">
      <Slide v-if="!globalStore.loading" v-for="item in getResult" :key="item?.id">
        <img :src="item?.image" alt="Gallery Image" class="gallery-image" />
      </Slide>
      <Slide v-else>
        <Skeleton width="100%" height="355px" />
      </Slide>
      <template #addons>
        <Pagination />
      </template>
    </Carousel>
  </div>
</template>


<script setup>
  import 'vue3-carousel/carousel.css';
  import { Carousel, Slide, Pagination } from 'vue3-carousel';
  import { ref } from 'vue';

  const currentSlide = ref(0);

  const slideTo = (nextSlide) => (currentSlide.value = nextSlide);

  const galleryConfig = {
    height : 355 ,
    itemsToShow: 1,
    wrapAround: true,
    slideEffect: 'fade',
    mouseDrag: false,
    touchDrag: false,
    autoplay: 1500, // Enables autoplay
    duration: 3000, // Time interval between slides (in milliseconds)
  };

  // define global store
  const globalStore = useGlobalStore()


  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()


  onMounted(()=>{
    getMethod('images' , '' , false , false)
  })
</script>

<style lang="scss" scoped>

</style>