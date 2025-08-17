<template>
  <section class="page packages">
    <h3 class="title">{{ $t('my_package.title') }}</h3>
    <div class="content">
      <div 
        class="package_item" 
        v-if="!useGlobalStore().loading"
      >
        <div class="image">
          <img :src="getResult.image" alt="image" loading="lazy">
        </div>
        <h3 class="title centered">
          {{getResult.title}}
        </h3>
        <ul>
          <li>
            <div class="image">
              <img src="/assets/images/users.png" alt="image" loading="lazy">
            </div>
            <h4>{{getResult.members_count}} {{$t('packages_page.user')}}</h4>
          </li>
          <li>
            <div class="image">
              <img src="/assets/images/price.png" alt="image" loading="lazy">
            </div>
            <h4>{{getResult.price}} {{$t('packages_page.currency')}}</h4>
          </li>
          <li>
            <div class="image">
              <img src="/assets/images/timer.png" alt="image" loading="lazy">
            </div>
            <h4>{{$t('packages_page.title')}} {{getResult.package_period_type}}</h4>
          </li>
        </ul>
        <p>
          {{ getResult.description }}
        </p>
      </div>
      <div 
        class="package_item" 
        v-for="i in 18" 
        :key="i"
        v-if="useGlobalStore().loading"
      >
        <div class="image" style="margin-bottom: 15px;">
          <Skeleton width="100%" height="100%" />
        </div>
        <h3 class="title centered">
          <Skeleton width="100%" height="40px" />
        </h3>
        <ul>
          <li v-for="i in 3" :key="i">
            <div class="image">
              <Skeleton width="20px" height="20px" />
            </div>
            <h4>
              <Skeleton width="280px" height="20px" />
            </h4>
          </li>
        </ul>
        <Skeleton width="100%" height="40px" style="margin-top: 20px;"/>
      </div>
    </div>
    <Empty v-if="!getResult && !useGlobalStore().loading" />
  </section>
</template>

<script setup>
  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()

  onMounted(()=>{
    getMethod('current-enrolled-package' , null , true , false)
  })
</script>

<style lang="scss" scoped>
  .packages .content{
    @include displayFlex();
    .package_item{
      flex-shrink: 0;
      max-width: 400px;
    }
  }
</style>