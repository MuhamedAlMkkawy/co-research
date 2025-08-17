<template>
  <section class="page researches_page">
    <div class="header_page" v-if="!globalStore.loading">
      <h3 class="title">
        {{ $t('research_details_page.title') }}
      </h3>
    </div>
    <div class="row_items" v-if="!globalStore.loading">
      <div class="research_item" v-if="!getResult?.is_researcher_own_opportunity">
        <h3 class="title">{{ $t('research_details_page.title_item') }}</h3>
        <div class="item_head">
          <div class="info" v-if="getResult?.show_researcher">
            <div class="image">
              <img :src="getResult?.researcher?.image" alt="image" loading="lazy">
            </div>
            <div class="text">
              <h3>
                {{getResult?.researcher?.name}}
              </h3>
              <div class="address">
                <i class="pi pi-users"></i>
                <h5>{{ getResult?.researcher?.job_title }}</h5>
              </div>
              <div class="flex_buttons">
                <NuxtLink :to="$localeRoute('/researchers/' + getResult?.researcher?.id)" class="main-btn sec_btn">
                  {{ $t('research_details_page.research_item.flex_buttons.view_details') }}
                </NuxtLink>
                <NuxtLink @click="handleStartChat(getResult)" class="main-btn sec_btn reversed">
                  {{ $t('research_details_page.research_item.flex_buttons.start_conversation') }}
                </NuxtLink>
              </div>
            </div>
          </div>
          <h4 v-else>
            {{ $t('research_details_page.hidden_text') }}
          </h4>
        </div>
      </div>
      <div class="estimated_time">
        <h6>{{ $t('research_details_page.estimated_time.title') }}</h6>
        <div class="time">
          <i class="pi pi-stopwatch"></i>
          <h6>
            {{getResult?.research_expectation_period}} 
            {{ $t('research_details_page.estimated_time.period') }}
          </h6>
        </div>
      </div>
    </div>
    <div class="research_details" v-if="!globalStore.loading">
      <h4>{{ $t('research_details_page.research_details.title') }}</h4>
      <h5>
        {{$t('research_details_page.research_details.research_text')}} 
        {{getResult?.title}}
      </h5>
      <h6>
        {{ $t('research_details_page.research_details.field_of_research') }} : 
        <p>
          {{getResult?.research_field}}
        </p>
      </h6>
      <h6>
        {{ $t('research_details_page.research_details.research_specialty') }} : 
        <p>
          {{getResult?.research_specialization}}
        </p>
      </h6>
      <h6>
        {{ $t('research_details_page.research_details.research_summary') }} : 
        <p>
          {{getResult?.description}}
        </p>
      </h6>
    </div>
    <div class="share_types" v-if="!globalStore.loading && !getResult?.sent_join_request && !getResult?.contributions[0]?.is_count_completed">
      <button 
        class="main-btn sec_btn" 
        @click="handleShowFilterJoinRequestsPopup"
        v-if="!getResult?.sent_join_request"
      >
        {{ $t('research_details_page.share_types.button') }}
      </button>
      <h4>
        {{ $t('research_details_page.share_types.title') }}
      </h4>
      <ul >
        <li v-for="item in getResult?.contributions?.filter((item) => !item?.is_count_completed)" :key="item.id">
          <h5>
            {{item?.name}} : 
            <span>
              {{item?.reward}}
            </span> - 
            {{ $t('research_details_page.share_types.number_of_participants') }} : 
            {{item?.member_count}}
          </h5>
        </li>
      </ul>
    </div>
    <div class="join_request" v-if="!globalStore.loading && !getResult?.sent_join_request && !getResult?.is_researcher_own_opportunity">
      <h3 class="title">
        {{ $t('research_details_page.join_request.title') }}
      </h3>
      <div class="input">
        <textarea 
          name="notes" 
          id="notes"
          v-model="body.notes"
          ></textarea>
          <div class="input_placeholder" v-if="!body.notes">
            <i class="pi pi-clipboard"></i>
            {{ $t('research_details_page.join_request.placeholder') }}
          </div>
      </div>
    </div>
    <button class="main-btn" @click="handleJoinRequest" v-if="!globalStore.loading && !getResult?.sent_join_request && !getResult?.is_researcher_own_opportunity">
      {{ $t('research_details_page.join_request_btn') }}
    </button>

    <!-- skeleton loading -->
    <div class="research_details" v-for="i in 4" v-if="globalStore.loading">
      <h4>
        <Skeleton width="100%" height="30px" />
      </h4>
      <h5 v-for="i in 4">
        <Skeleton width="100%" height="20px" />
      </h5>
    </div>
    <!-- البوب اب الخاصه بـنجاح طلب الانضمام -->
    <JoinRequestedPopup 
      v-if="showJoinRequestedPopup"
      @handleShowJoinRequestedPopup = "handleShowJoinRequestedPopup"
    />
    <!-- البوب اب الخاصه ب تحديد نوع المشاركة للباحث -->
    <FilterJoinRequestsPopup 
      v-if="showFilterJoinRequestPopup"
      :joinType="Number(body.contribution_type_id)"
      :available_contribution_types="getResult?.contributions?.filter((item) => !item?.is_count_completed)"
      @handleShowFilterJoinRequestsPopup="handleShowFilterJoinRequestsPopup"
      @handleJoinType = "handleJoinType"
    />
  </section>
</template>

<script setup>
  // define global store
  const globalStore = useGlobalStore()

  // define route 
  const route = useRoute()
  
  // define router
  const router = useRouter()

  // define locale route
  const localeRoute = useLocaleRoute()

  // define i18n
  const { t } = useI18n()

  // define api methods
  const {
    getMethod,
    getResult,
    submitMethod,
    submitResult,
    showErrorToast
  } = useApiMethods()

  // define body 
  const body = ref({
    research_opportunity_id : route.params.id,
    contribution_type_id: "",
    notes : ""
  })

  // handle join request (الخاصه ب نجاح طلب الانضمام للفرصه)
  const showJoinRequestedPopup = ref(false)
  const handleShowJoinRequestedPopup = () => {
    showJoinRequestedPopup.value = !showJoinRequestedPopup.value
  }

  // handle filter join request popup (الخاصه ب تحديد نوع المشاركة للباحث)
  const showFilterJoinRequestPopup = ref(false)
  const handleShowFilterJoinRequestsPopup = () => {
    showFilterJoinRequestPopup.value = !showFilterJoinRequestPopup.value
  }

  // handle join type (لتحديد نوع المشاركة)
  const handleJoinType = (joinType) => {
    body.value.contribution_type_id = joinType
    showFilterJoinRequestPopup.value = false
  }

  // handle join request (لتقديم طلب الانضمام للفرصه البحثية)
  const handleJoinRequest = () => {
    if(!body.value.contribution_type_id){
      showErrorToast(t('research_details_page.contribution_type_required'))
    }else {
      submitMethod('send-join-request' , true , body.value , 'POST' , '' , '')
    }
  }


  const handleStartChat = (user)=>{
    if(!user.researcher.room_id){
      submitMethod('create-private-room' , true , {
        memberable_id : user?.researcher?.id,
        memberable_type : 'User'
      } , 'POST' , '')
    }else{
      globalStore.roomId = user.researcher.room_id
      router.push(localeRoute('/chats'))
    }
  }


  watchEffect(()=>{
    if(submitResult?.value?.endPoint == 'send-join-request' && submitResult?.value?.data?.key == 'success'){
      handleShowJoinRequestedPopup()
    }
    if(submitResult?.value?.endPoint == 'create-private-room' && submitResult?.value?.data?.key == 'success'){
      console.log(submitResult?.value?.data?.data)
      globalStore.roomId = submitResult?.value?.data?.data?.room?.id
      router.push(localeRoute(`/chats?' + ${submitResult?.value?.data?.data?.room?.id}`))
    }
  })


  onMounted(()=> {
    getMethod(`available-research-opportunities/${route.params.id}/show` , null , true , false)
  })
</script>

<style lang="scss" scoped>
  .row_items{
    @include displayFlex();
    width: 100%;
    margin-bottom: 20px;
    @media (max-width : 992px){
      flex-wrap: wrap;
      .research_item{
        max-width: unset;
      }
    }
  }
  .research_item {
    max-width: 600px;
    flex-grow: 1;
    h3.title{
      margin-bottom: 5px;
    }
    .item_head {
      margin-bottom: 0;
      .info {
        align-items: stretch;
        width: 100%;
        .image{
          width: 150px;
          height: unset;
        }
        .text{
          width: 100%;
        }
      }
      h4{
        padding: 50px 0;
        text-align: center;
        width: 100%;
        font-size: clamp(16px , 2.5vw , 20px);
        font-weight: 600;
      }
    }
  }
  .estimated_time{
    flex-grow: 1;
    margin-bottom: 0;
  }
  .share_types{
    position: relative;
    h4{
      margin-bottom: 10px;
      font-size: 20px;
    }
    button.main-btn{
      position: absolute;
      inset-inline-end: 10px;
      top: 10px;
      max-width: 200px;
      height: 45px;
      font-size: 16px;
      margin: 0;
      @media (max-width : 767px){
        position: unset;
        width: 100%;
        max-width: unset;
        margin-bottom: 10px;
      }
    }
  }
  .join_request{
    h3.title{
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 0;
    }
    + .main-btn{
      max-width: 992px;
      margin: 30px auto 0;
    }
  }
  .flex_buttons{
    justify-content: flex-start;
  }
</style>