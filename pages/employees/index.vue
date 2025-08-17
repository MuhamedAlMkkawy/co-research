<template>
  <section class="page followers_page">
    <div class="header_page">
      <h3 class="title">
        {{ $t('followers_page.title') }}
      </h3>
      <NuxtLink :to="localeRoute('/employees/modify')" class="main-btn">
        {{ $t('followers_page.add_new_follower') }}
      </NuxtLink>
    </div>
    <div class="content column_research_items">
      <NuxtLink 
        class="research_item researcher_details_item" 
        v-for="item in getResult?.data" 
        :key="item?.id"
        v-if="!globalStore.loading"
        >
        <!-- :to="localeRoute('/researchers/' + item?.id)" -->
        <div class="item_head">
          <div class="info">
            <div class="image">
              <img :src="item?.image" alt="image" loading="lazy">
            </div>
            <div class="text">
              <h3>{{item?.name}}</h3>
              <div class="address">
                <i class="pi pi-map-marker"></i>
                <p>{{item?.city_name}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="column_links">
          <button class="edit_btn" @click="handleModifyMember('edit' , item?.id)">
            <i class="pi pi-pencil"></i>
          </button>
          <NuxtLink 
            :to="localeRoute('/researchers/' + item?.id)">
            {{ $t('followers_page.view_details') }}
          </NuxtLink>
        </div>
      </NuxtLink>
      <Skeleton 
        v-for="i in 18" 
        :key="i" 
        v-if="globalStore.loading"
        class="research_item researcher_details_item !h-[5rem]">
        <template #template>
          <div class="item_head">
            <div class="info">
              <div class="image">
                <Skeleton shape="rectangle" width="100px" height="100px" />
              </div>
              <div class="text">
                <h3><Skeleton /></h3>
                <div class="address">
                  <i class="pi pi-map-marker"></i>
                  <p><Skeleton /></p>
                </div>
              </div>
            </div>
          </div>
          <div class="column_links">
            <button class="edit_btn skeleton_btn">
              <i class="pi pi-pencil"></i>
            </button>
            <NuxtLink class="skeleton_btn">
              {{ $t('followers_page.view_details') }}
            </NuxtLink>
          </div>
        </template>
      </Skeleton>
    </div>
    <Pagination 
      :data="getResult?.pagination"
      endPoint="employees"
    />
    <Empty v-if="!globalStore.loading && getResult?.data?.length == 0" />
  </section>
</template>

<script setup>  
  // define global store
  const globalStore = useGlobalStore()

  // define router
  const router = useRouter()


  // define localeRoute 
  const localeRoute = useLocaleRoute()

  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()

  // handle modify member
  const handleModifyMember = (action , item) => {
    globalStore.memberInfo={
      action : action,
      id : item
    }
    router.push(localeRoute('/employees/modify'))
  }

  onMounted(()=>{
    getMethod('employees' , '' , true , false)
  })

</script>

<style lang="scss" scoped>
  .column_links{
    @include displayFlex($direction : column , $justify : space-between , $align : flex-end);
    height: 80px;
    a{
      padding-block-start: 8px;
      font-size: 14px !important;
      color: $secColor !important;
      text-wrap: nowrap;
      &:hover{
        text-decoration: underline;
      }
    }
    button.edit_btn{
      margin-inline-end: 8px;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: $thirdColor;
      @include displayFlex();
      .pi{
        font-size: 10px;
      }
      &:hover{
        background: $mainColor;
        color: #fff;
      }
    }
  }
</style>