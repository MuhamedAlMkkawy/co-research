<template>
  <section class="page available_departments_page">
    <div class="header_page">
      <h3 class="title">{{ $t('available_departments_page.title') }}</h3>
      <div class="icon_filter" @click="handleShowFilterResearchesPopup">
        <div class="image">
          <img src="/assets/images/filter_icon.png" alt="image" loading="lazy">
        </div>
        <h6>{{ $t('available_departments_page.filter_departments') }}</h6>
      </div>
    </div>
    <div class="content column_research_items" v-if="getResult?.data?.length > 0">
      <div 
        class="research_item"
        v-for="item in researches"
        v-if="!globalStore.loading"
        :key="item.id"
      >
        <h3 class="title">
          {{ $t('available_departments_page.research_item.search_label') }} 
          {{item?.title}}
        </h3>
        <div class="item_head">
          <div class="info">
            <div class="image">
              <img src="/assets/images/book.svg" alt="image" loading="lazy">
            </div>
            <div class="text">
              <h3>
                {{ $t('available_departments_page.research_item.research_field') }} 
                {{ item?.research_field }}
              </h3>
            </div>
          </div>
        </div>
        <div class="buttons">
          <NuxtLink 
            :to="'/researches/' + item?.id" 
            class="main-btn sec_btn">
              {{ $t('available_departments_page.research_item.view_details') }}
          </NuxtLink>
        </div>
      </div>
      <div 
        class="research_item"
        v-for="i in 18"
        v-else
        :key="i"
      >
        <h3 class="title">
          <Skeleton width="300px" height="20px" style="margin-bottom: 15px;" />
        </h3>
        <div class="item_head">
          <div class="info">
            <div class="image">
              <Skeleton width="20px" height="20px" />
            </div>
            <div class="text">
              <h3>
                <Skeleton width="200px" height="20px" />
              </h3>
            </div>
          </div>
        </div>
        <div class="buttons">
          <Skeleton width="150px" height="40px" class="main-btn sec_btn" />
        </div>
      </div>
    </div>
    <Empty v-else />
    <Pagination 
      :data="getResult?.pagination"
      endPoint="available-research-opportunities"
      @handlePagination="researches = $event"
    />
    <FilterResearchesPopup 
      v-if="showFilterResearchesPopup"
      @handleShowFilterResearchesPopup="handleShowFilterResearchesPopup"
      @handleFilterResearches="handleFilterResearches"
    />
  </section>
</template>

<script setup>
  // define global store 
  const globalStore = useGlobalStore()

  
  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()

  // define researches data
  const researches = ref('')

  // // handle  researches filtered data
  // const researchesFilteredData = ref([''])


  // handle filter researches popup
  const showFilterResearchesPopup = ref(false)
  const handleShowFilterResearchesPopup = () => {
    showFilterResearchesPopup.value = !showFilterResearchesPopup.value
  }
  const handleFilterResearches = (researchFilterValues) => {
    const queryParams = []
    if(researchFilterValues.specializations.length > 0){
      queryParams.push(`specializations[]=${researchFilterValues.specializations.map(s => s.id).join('&specializations[]=')}`)
    }
    if(researchFilterValues.contribution_types.length > 0){
      queryParams.push(`contribution_type_id=${researchFilterValues.contribution_types.map(c => c).join('&contribution_type_id=')}`)
    }
    getMethod(`available-research-opportunities?${queryParams.join('&')}`, '' , true , false)
    handleShowFilterResearchesPopup()
  }


  watchEffect(()=>{
    if(getResult?.value){
      researches.value = getResult?.value?.data
    }
  })

  
  onMounted(()=>{
    getMethod('available-research-opportunities' , 1 , true , false)
  })
</script>

<style lang="scss" scoped>
  h3.title{
    font-size: 18px;
    margin-bottom: 0px;
  }
  .content.column_research_items .research_item .item_head .info{
    .image{
      width: 30px;
      height: 30px;
      img{
        object-fit: contain;
      }
    }
    .text{
      h3{
        font-size: 16px;
        color: $secColor;
      }
    }
  }
  .main-btn.sec_btn{
    margin: 0;
    height: 45px;
    font-size: 16px;
  }
</style>