<template>
  <section class="page">
    <h3 class="title" v-if="!globalStore.loading">{{ $t('organizations.title') }}</h3>
    <div class="form search_bar" v-if="!globalStore.loading">
      <div class="input">
        <i class="pi pi-search"></i>
        <input 
          type="text"
          :placeholder="$t('organizations.searchPlaceholder')"
          v-model="searchInput"
          autofocus
        >
      </div>
      <button class="main-btn sec_btn image" @click="handleShowFilterResearcherPopup">
        <img src="/assets/images/filter_icon.png" alt="image" loading="lazy">
      </button>
    </div>
    <div class="content column_research_items" v-if="organizations?.length > 0">
      <div 
        class="research_item research_item_row" 
        v-for="item in organizations"
        :key="item.id"
        v-if="!globalStore.loading"
      >
        <div class="item_head"> 
          <div class="info">
            <div class="image">
              <img :src="item?.image" alt="image" loading="lazy">
            </div>
            <div class="text">
              <h3>{{item?.name}}</h3>
              <div class="address">
                <i class="pi pi-users"></i>
                <p>{{item?.job_title}}</p>
              </div>
              <div class="flex_buttons">
                <NuxtLink :to="$localeRoute('/organizations/' + item?.id)" class="main-btn">
                  {{ $t('organizations.viewDetails') }}
                </NuxtLink>
                <NuxtLink :to="$localeRoute('/chats?' + item?.id)" class="main-btn reversed">
                  {{ $t('organizations.startChat') }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="research_item research_item_row" v-else v-for="i in 18" :key="i">
        <div class="item_head"> 
          <div class="info">
            <div class="image">
              <Skeleton width="100px" height="100px" />
            </div>
            <div class="text">
              <h3>
                <Skeleton width="150px" height="20px" />
              </h3>
              <div class="address">
                <Skeleton width="20px" height="20px" />
                <p>
                  <Skeleton width="200px" height="20px" />
                </p>
              </div>
              <div class="flex_buttons">
                <Skeleton 
                  width="120px" 
                  height="40px" 
                  borderRadius="4px" 
                  v-for="i in 2" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Empty v-else />
    <Pagination 
      v-if="!searchInput"
      :data="getResult?.pagination"
      endPoint="organizations"
      @handlePagination="organizations = $event"
    />
    <FilterResearcherPopup 
      v-if="showFilterResearcherPopup"
      @handleShowFilterResearcherPopup="handleShowFilterResearcherPopup"
      @handleResearchersFilter="handleResearchersFilter"
    />
  </section>
</template>

<script setup>
  import { debounce } from 'lodash'

  // define global store 
  const globalStore = useGlobalStore()

  
  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()


  // define search input
  const searchInput = ref('')


  // define organizations
  const organizations = ref([])

  // handle filtered Data
  const handleSearchOrganizations = debounce((val) => {
    getMethod(`organizations?name=${val}`, '', true, false)
  }, 300)

  watch(()=> searchInput?.value, (val) => {
    handleSearchOrganizations(val)
  })


  // handle filter research popup
  const showFilterResearcherPopup = ref(false)
  const handleShowFilterResearcherPopup = () => {
    showFilterResearcherPopup.value = !showFilterResearcherPopup.value
  }
  const handleResearchersFilter = (specializations) => {
    getMethod(`organizations?research_fields[]=${specializations.map(s => s.id).join('&research_fields[]=')}`, '' , true , false)
    handleShowFilterResearcherPopup()
  }


  watchEffect(()=>{
    if(getResult?.value?.data){
      organizations.value = getResult.value.data
    }
  })


  onMounted(()=>{
    getMethod('organizations' , 1 , true , false)
  })
</script>

<style lang="scss" scoped>
  .search_bar{
    @include displayFlex($align : stretch);
    margin-bottom: 30px;
    .input{
      background: rgba($color: $secColor, $alpha: 0.3);
      border: none;
      i.pi{
        font-size: 16px;
      }
      flex-grow: 1;
    }
    button.main-btn{
      width: 60px;
      margin: 0;
      padding: 12px;
      background: rgba($color: $secColor, $alpha: 0.3);
      img{
        filter: brightness(0);
        object-fit: contain;
      }
      &:hover{
        img{
          filter: unset;
        }
      }
    }
  }
  .content.column_research_items .research_item .item_head {
    margin-bottom: 0;
    .info{
      justify-content: flex-start;
      .image{
        width: 100px;
        height: unset;
        @media (max-width : 400px){
          width: 100%;
        }
      }
      .text{
        flex-grow: 1;
      }
    }
  }
</style>