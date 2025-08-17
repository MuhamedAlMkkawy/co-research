<template>
  <section class="page requests_page">
    <div class="header_page" v-if="getResult?.data?.length > 0">
      <h3 class="title">
        {{ $t('requests_page.title') }}
      </h3>
    </div>
    <div class="content column_research_items" v-if="getResult?.data?.length > 0">
      <div 
        class="research_item" 
        v-for="user in getResult?.data" 
        :key="user?.id"
        v-if="!globalStore.loading"
      >
        <div class="item_head"> 
          <div class="info">
            <div class="image">
              <img :src="user?.image" alt="image" loading="lazy">
            </div>
            <div class="text">
              <h3>{{ user?.name }}</h3>
              <div class="address">
                <i class="pi pi-map-marker"></i>
                <p>{{  user?.city_name }}</p>
              </div>
            </div>
          </div>
          <NuxtLink :to="$localeRoute('/researchers/' + user?.id)">
            {{ $t('requests_page.view_details') }}
          </NuxtLink>
        </div>
        <div class="flex_buttons">
          <button class="main-btn success" @click="handleJoinRequest('accept' , user?.id)">
            {{ $t('project_page.accept') }}
          </button>
          <button class="main-btn danger" @click="handleJoinRequest('decline' , user?.id)">
            {{ $t('project_page.reject') }}
          </button>
        </div>
      </div>
      <div 
        class="research_item" 
        v-for="i in 18" 
        :key="i"
        v-if="globalStore.loading"
      >
        <div class="item_head"> 
          <div class="info">
            <div class="image">
              <Skeleton width="100%" height="100%" />
            </div>
            <div class="text">
              <h3>
                <Skeleton width="200px" height="20px" />
              </h3>
              <div class="address">
                <Skeleton width="20px" height="20px" />
                <p>
                  <Skeleton width="150px" height="20px" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Empty v-if="!globalStore.loading && getResult?.data?.length == 0" />
  </section>
</template>

<script setup>
  // define global store
  const globalStore = useGlobalStore()
  // define api methods
  const {
    getMethod,
    submitMethod,
    getResult
  } = useApiMethods()


  // handle join request
  const handleJoinRequest = (type , userID) => {
    submitMethod(`${type}-employee-request` , true , {
      employee_id : userID
    } , 'POST' , '' , 'employee-requests')
  }


  onMounted(()=>{
    getMethod('employee-requests' , null  , true , false)
  })
</script>

<style lang="scss" scoped>
  .research_item .item_head{
    align-items: flex-start;
    margin-bottom: 20px;
    position: relative;
    .info{
      justify-content: flex-start;
      .text{
        h3{
          max-width: 180px;
        }
      }
      + a {
        padding-block-start: 10px;
        font-size: 14px;
        color: $secColor;
        text-wrap: nowrap;
        position: absolute;
        inset-inline-end: 0;
        &:hover{
          text-decoration: underline;
        }
      }
    }
  }
</style>