<template>
  <section class="page">
    <h3 class="title" v-if="!globalStore.loading">{{ $t('researcher.title') }}</h3>
    <div class="form search_bar" v-if="!globalStore.loading">
      <div class="input">
        <i class="pi pi-search"></i>
        <input 
          type="text"
          :placeholder="$t('researcher.searchPlaceholder')"
          v-model="searchInput"
          autofocus
        >
      </div>
      <button class="main-btn sec_btn image" @click="handleShowFilterResearcherPopup">
        <img src="/assets/images/filter_icon.png" alt="image" loading="lazy">
      </button>
    </div>
    <div class="content column_research_items" v-if="researchers.length > 0">
      <div 
        class="research_item research_item_row" 
        v-for="item in researchers"
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
                <i class="pi pi-user"></i>
                <p>{{item?.job_title}}</p>
              </div>
              <div class="flex_buttons">
                <NuxtLink :to="$localeRoute('/researchers/' + item?.id)" class="main-btn">
                  {{ $t('researcher.viewDetails') }}
                </NuxtLink>
                <button @click="handleStartChat(item)" class="main-btn reversed">
                  {{ $t('researcher.startChat') }}
                </button>
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
                  width="100%" 
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
      endPoint="researchers"
      @handlePagination="researchers = $event"
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

  // define locale route 
  const localeRoute = useLocaleRoute()

  // define router 
  const router = useRouter()

  // define researchers
  const researchers = ref([])
  
  // define api methods
  const {
    getMethod,
    getResult,
    submitMethod,
    submitResult
  } = useApiMethods()


  // define search input
  const searchInput = ref('')

  // handle filtered Data
  const handleSearchResearchers = debounce((val) => {
    getMethod(`researchers?name=${val}`, '', true, false)
  }, 300)

  watch(()=> searchInput?.value, (val) => {
    handleSearchResearchers(val)
  })

  const handleStartChat = (user)=>{
    if(!user?.room_id){
      submitMethod('create-private-room' , true , {
        memberable_id : user?.id,
        memberable_type : 'User'
      } , 'POST' , '')
    }else{
      globalStore.roomId = user?.room_id
      router.push(localeRoute('/chats'))
    }
  }


  watchEffect(()=>{
    if(getResult?.value){
      researchers.value = getResult?.value?.data
    }
    if(submitResult?.value?.data?.key == 'success'){
      globalStore.roomId = submitResult?.value?.data?.data?.room?.id
      router.push(localeRoute(`/chats?' + ${submitResult?.value?.data?.data?.room?.id}`))
    }
  })

  // handle filter research popup
  const showFilterResearcherPopup = ref(false)
  const handleShowFilterResearcherPopup = () => {
    showFilterResearcherPopup.value = !showFilterResearcherPopup.value
  }
  const handleResearchersFilter = (specializations) => {
    getMethod(`researchers?research_fields[]=${specializations.map(s => s.id).join('&research_fields[]=')}`, '' , true , false)
    handleShowFilterResearcherPopup()
  }

  onMounted(()=>{
    globalStore.memberInfo.id = null
    getMethod('researchers' , 1 , true , false)
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
        font-size: 20px;
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