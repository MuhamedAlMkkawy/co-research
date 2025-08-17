<template>
  <section class="page complaints_page">
    <div class="header_page">
      <h3 class="title">{{ $t('complaints_page.title') }}</h3>
      <button class="main-btn" @click="handleShowAddComplaintPopup">
        {{ $t('complaints_page.new_complaint') }}
      </button>
    </div>
    <div class="content">
      <div 
        class="complaint_item" 
        v-if="!globalStore.loading && complaintsData?.data?.length > 0" 
        v-for="(item , index) in complaintsData?.data" 
        :key="index"
      >
        <h4 class="number">{{ item.complaint_num }}</h4>
        <div class="complaint_text">
          <h5>
            {{ $t('complaints_page.complaint_item.status') }} {{item.status_text}}
          </h5>
          <div class="date">{{ item.date }}</div>
          <NuxtLink :to="localeRoute('/complaints/' + item?.id)" class="main-btn sec_btn">{{ $t('complaints_page.complaint_item.details') }}</NuxtLink>
        </div>
      </div>
      <div v-for="index in 9" :key="'skeleton-' + index" class="complaint_item" v-else-if="globalStore.loading">
      <div class="number">
        <Skeleton width="50px" height="50px" borderRadius="0" />
      </div>
      <div class="complaint_text">
        <div class="date">
          <Skeleton width="80px" height="16px" />
        </div>
        <h5>
          <Skeleton width="100%" height="20px" class="mb-2" />
          <Skeleton width="70%" height="20px" />
        </h5>
        <div class="main-btn">
          <Skeleton width="100px" height="40px" borderRadius="20px" />
        </div>
      </div>
    </div>
      <Empty v-if="!globalStore.loading && complaintsData?.data?.length == 0" />
    </div>
    <Pagination 
      :data = "complaintsData?.pagination"
      :endPoint="'list-complaints'"
      @handlePagination = 'complaintsData = $event'
    />
    <AddComplaintPopup 
      v-if="showAddComplaintPopup"
      @handleShowAddComplaintPopup="handleShowAddComplaintPopup"
      @handleSuccessPopup="handleSuccessPopup"
    />
    <!-- ######## Success Popup ######## -->
    <SuccessPopup  
      v-if="showSuccessPopup"
      :successText="$t('complaints_page.success_popup.text')"
    />
  </section>
</template>

<script setup>
  // define global store
  const globalStore = useGlobalStore()


  // define complaints data
  const complaintsData = ref()

  // define locale route
  const localeRoute = useLocaleRoute()

  // handle success popup
  const {
    showSuccessPopup,
    handleSuccessPopup
  } = useSuccessPopup()

  // handle complaint popup
  const showAddComplaintPopup = ref(false)
  const handleShowAddComplaintPopup = () => {
    showAddComplaintPopup.value = !showAddComplaintPopup.value
  }

  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()

  watchEffect(()=>{
    if(getResult?.value){
      complaintsData.value = getResult?.value
    }
  })

  onMounted(()=>{
    getMethod('list-complaints' , 1 , true , false)
  })
</script>

<style lang="scss" scoped>
  .complaints_page{
    .content{
      @include displayFlex($wrap : wrap , $gap : 20px);
      .complaint_item{
        width: 30%;
        flex-grow: 1;
        @include displayFlex($align : stretch , $gap : 0px);
        border-radius: 12px;
        overflow: hidden;
        background: #ECECEC80;
        .number{
          flex-shrink: 0;
          @include displayFlex();
          background: $mainColor;
          color: #fff;
          font-size: 50px;
          font-weight: 500;
          padding-inline: clamp(10px , 2.5vw , 35px);
        }
        .complaint_text{
          flex-grow: 1;
          padding: 20px 12px;
          position: relative;
          .date{
            position: absolute;
            inset-inline-end: 12px;
            inset-block-start: 15px;
            color: $secColor;
          }
          h5{
            padding-block-start: 30px;
            font-size: 16px;
            font-weight: 500;
            color: $secColor;
          }
          .main-btn{
            height: fit-content;
            padding-block: 10px;
            font-size: 16px;
          }
        }
      }
      @media (max-width : 1200px){
        flex-wrap: wrap;
        .complaint_item{
          width: 45%;
        }
      }
      @media (max-width : 567px){
        .complaint_item{
          width: 100%;
        }
      }
    }
  }
</style>