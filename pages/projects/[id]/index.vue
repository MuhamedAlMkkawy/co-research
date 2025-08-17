<template>
  <section class="page project_page">
    <div v-if="!globalStore.loading">
      <div class="head">
        <h3>{{ $t('project_page.title') }}</h3>
        <p>
          {{ $t('project_page.requestNumber') }}
          {{ getResult?.research_num }}
        </p>
        <!-- ################################################################## -->
        <!-- ################ للتحكم ف حالة الفرصة البحثية ################## -->
        <!-- ################################################################## -->
        <div class="flex_buttons" v-if="getResult?.is_mine_opportunity && getResult?.status <= 3">
          <!-- لتأكيد تسليم الاعضاء المقابل المادي -->
          <div class="input-wrap" v-if="getResult?.status == 3">
            <input 
              type="checkbox" 
              name="delivered" 
              id="delivered" 
              v-model="researchPaymentStatus"
            >
            <label for="delivered">{{ $t('project_page.membersCompensationAcknowledgment') }}</label>
          </div> 
          <button class="main-btn" @click="handleChangeResearchStatus(getResult?.id)"> 
            {{ 
              getResult?.status == 0 ? 
              $t('project_page.startResearch') : 
              getResult?.status == 1 ? 
              $t('project_page.completedResearch') :  
              getResult?.status == 3 ? 
              $t('project_page.endRequest') : null
            }}
          </button>
          <button class="main-btn danger" v-if="getResult?.status == 0" @click="handleShowCancelResearchPopup(getResult?.id)">
            {{ $t('project_page.cancelRequest') }}
          </button>
        </div>
        <div :class="['research_status' , {canceled : getResult?.status == 2}]" v-if="!getResult?.is_mine_opportunity">
          {{getResult?.status_text}}
        </div>
      </div> 
        <!-- ################################################################## -->
        <!-- ######################## تفاصيل الباحث ########################## -->
        <!-- ################################################################## -->
      <div class="researcher_details" v-if="getResult?.researcher && globalStore?.userType != 2">
        <h3 class="title">{{ $t('project_page.mainResearcherDetails') }}</h3>
        <div class="research_item research_item_row researcher_details_item">
          <div class="item_head"> 
            <div class="info">
              <div class="image">
                <img :src="getResult?.researcher?.image" alt="image" loading="lazy">
              </div>
              <div class="text">
                <h3>{{getResult?.researcher?.name}}</h3>
                <div class="address">
                  <i class="pi pi-map-marker"></i>
                  <p>{{getResult?.researcher?.city?.name}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex_buttons">
          <NuxtLink class="main-btn" :to="$localeRoute(`/researchers/${getResult?.researcher?.id}`)">
            {{ $t('project_page.viewDetails') }}
          </NuxtLink>
          <NuxtLink class="main-btn reversed" :to="$localeRoute('/chats')" @click="globalStore.roomId = getResult?.researcher?.room_id">
            {{ $t('project_page.startChat') }}
          </NuxtLink>
          </div>
        </div>
      </div>
      <div class="researcher_details" v-if="globalStore.loading">
        <h3 class="title">
          <Skeleton width="100%" height="30px"/>
        </h3>
        <div class="research_item research_item_row researcher_details_item">
          <div class="item_head"> 
            <div class="info">
              <div class="image">
                <Skeleton width="100%" height="100%"/>
              </div>
              <div class="text">
                <h3>
                  <Skeleton width="200px" height="30px"/>
                </h3>
                <div class="address">
                  <Skeleton width="15px" height="15px" />
                  <p>
                    <Skeleton width="100px" height="15px" />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex_buttons">
          <button class="main-btn" v-for="i in 2" :key="i">
            <Skeleton width="200px" height="30px" />
          </button>
          </div>
        </div>
      </div>
        <!-- ################################################################## -->
        <!-- ######################## تفاصيل البحث ########################### -->
        <!-- ################################################################## -->
      <div class="research_details">
        <div class="research_status" v-if="getResult?.my_contribution_type">
          {{ $t('project_page.shareType') }} : {{getResult?.my_contribution_type}}
        </div>
        <!-- <div class="research_status" v-if="getResult?.status != 0">
          {{getResult?.status_text}}
        </div> -->
        <h4>{{ $t('project_page.researchDetails') }}</h4>
        <h5>
          {{ $t('project_page.research_title') }} 
          {{ getResult?.title }}
        </h5>
        <h6>
          {{ $t('project_page.researchField') }} 
          <p> 
            {{ getResult?.research_field }}
          </p>
        </h6>
        <h6>
          {{ $t('project_page.researchSpecialization') }} 
          <p> 
            {{ getResult?.research_specialization }} 
          </p>
        </h6>
        <h6>{{ $t('project_page.researchSummary') }} 
        <p>
          {{getResult?.description}}
        </p>
        </h6>
      </div>
        <!-- ################################################################## -->
        <!-- ########################## سبب الالغاء ########################### -->
        <!-- ################################################################## -->
      <div class="research_details canceled_reason" v-if="getResult?.cancel_reason">
        <h3 class="title">
          {{ $t('project_page.cancelReason') }}
        </h3>
        <p>
          {{ getResult?.cancel_reason }}
        </p>
      </div>
      <div class="estimated_time">
        <h6>{{ $t('project_page.estimatedTime') }}</h6>
        <div class="time">
          <i class="pi pi-stopwatch"></i>
          <h6>
            {{getResult?.research_expectation_period}}
            <!-- {{ $t('project_page.days') }} -->
          </h6>
        </div>
      </div>
      <!-- ################################################################## -->
      <!-- ####################### أنواع المشاركات ######################### -->
      <!-- ################################################################## -->
      <div class="share_types">
        <h4>{{ $t('project_page.shareTypes') }}</h4>
        <ul>
          <li 
            v-for="item in getResult?.contributions" 
            :key="item?.id"
          >
            <h5>
              {{item?.name}} : 
              <span>
                <!-- {{ $t('project_page.compensation') }} -->
                  {{ item?.reward }}
              </span> -
              {{ $t('project_page.membersCount') }} : 
              {{ item?.member_count }}
            </h5>
          </li>
        </ul>
      </div>
      <!-- ################################################################## -->
      <!-- ######################## بيانات الاعضاء ########################## -->
      <!-- ################################################################## -->
      <div class="join_request" v-if="getResult?.members?.length > 0">
        <div class="head">
          <h3>
            {{ 
              getResult?.status == 0 ? 
              $t('project_page.joinRequests')
              :
              $t('project_page.membersData') 
            }}
          </h3>
        <button 
          class="image" 
          @click="handleShowFilterJoinRequestsPopup"
          v-if="getResult?.status == 0"
        >
          <img src="/assets/images/filter_icon.png" alt="image" loading="lazy">
        </button>
        <button 
          class="main-btn view_members_chat"
          @click="handleStartChat(getResult)"
          v-if="getResult?.status != 0"
        >
          {{ $t('project_page.viewMembersChat') }}
        </button>
        </div>
        <div class="content">
          <div 
            class="research_item" 
            v-for="member in getResult?.members"
            :key="member?.user_id"

          >
            <div class="item_head"> 
              <div class="info">
                <div class="image">
                  <img :src="member?.user_image" alt="image" loading="lazy">
                </div>
                <div class="text">
                  <h3>
                    {{ member?.user_name }}
                  </h3>
                  <div class="address">
                    <i class="pi pi-map-marker"></i>
                    <p>
                      {{ member?.city_name }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="buttons">
                <NuxtLink 
                  :to="$localeRoute(`/researchers/${member?.user_id}`)" 
                  class="main-btn "
                >
                  {{ $t('project_page.viewDetails') }}
                </NuxtLink>
                <button 
                  @click="handleStartChat(member)"
                  class="main-btn reversed"
                >
                  {{ $t('project_page.startChat') }}
                </button>
              </div>
            </div>
            <ul>
              <li>
                <p>
                  {{ $t('project_page.participationType') }} 
                </p> 
                {{ member?.contribution_type }}
              </li>
              <li v-if="member?.notes">
                <p>
                  {{ $t('project_page.researcherNotes') }} 
                </p> 
                {{ member?.notes }}
              </li>
            </ul>
            <div class="flex_buttons" v-if="getResult?.status == 0">
            <button class="main-btn success" @click="handleAcceptJoinRequest(member?.id)">
              {{ $t('project_page.accept') }}
            </button>
            <button class="main-btn danger" @click="handleRefuseJoinRequest(member?.id)">
              {{ $t('project_page.reject') }}
            </button>
            </div>
          </div>
          <!-- <div class="research_item research_item_row">
            <div class="item_head"> 
              <div class="info">
                <div class="image">
                  <img src="https://th.bing.com/th/id/OIP.eyoc5DH4d6YXk4v58qwi-QHaEK?w=313&h=180&c=7&r=0&o=5&pid=1.7" alt="image" loading="lazy">
                </div>
                <div class="text">
                  <h3>محمد المكاوي</h3>
                  <div class="address">
                    <i class="pi pi-user"></i>
                    <p>مدير مركز التلوين</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex_buttons">
              <button class="main-btn">
              {{ $t('project_page.viewDetails') }}
              </button>
              <button class="main-btn reversed">
              {{ $t('project_page.startChat') }}
              </button>
            </div>
          </div> -->
        </div>
      </div>
      <!-- ################################################################## -->
      <!-- ######### فلتر طلبات الانضمام بناءا علي نوع المشاركة ########### -->
      <!-- ################################################################## -->
      <FilterJoinRequestsPopup 
        v-if="showFilterJoinRequestsPopup"
        :joinType="Number(body.contribution_type_id)"
        :available_contribution_types="getResult?.contributions"
        @handleShowFilterJoinRequestsPopup="handleShowFilterJoinRequestsPopup"
        @handleJoinType = "handleJoinType"
      />
      <!-- ################################################################## -->
      <!-- ############### البوب اب الخاصه بـالغاء البحث ################## -->
      <!-- ################################################################## -->
      <CancelResearchPopup 
        v-if="showCancelResearchPopup"
        @handleShowCancelResearchPopup="handleShowCancelResearchPopup"
        @handleSubmitCancelResearchPopup="handleSubmitCancelResearchPopup"
      />
      <!-- ################################################################## -->
      <!-- ############### البوب اب الخاصه نجاح الغاء البحث ############## -->
      <!-- ################################################################## -->
      <SuccessPopup 
        v-if="showSuccessPopup"
        @handleShowSuccessPopup="handleShowSuccessPopup"
        :successText="$t('project_page.cancelSuccess')"
      />
    </div>
    <div class="research_details" v-for="i in 6" v-else>
      <h4>
        <Skeleton width="100%" height="40px"/>
      </h4>
      <h5 v-for="i in 4" :key="i">
        <Skeleton width="100%" height="20px"/>
      </h5>
    </div>
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
    contribution_type_id: ""
  })

  
  // handle success popup
  const showSuccessPopup = ref(false)
  const handleShowSuccessPopup = () =>{
    showSuccessPopup.value = !showSuccessPopup.value
  }


  // handle filter join request popup
  const showFilterJoinRequestsPopup = ref(false)
  const handleShowFilterJoinRequestsPopup = () =>{
    showFilterJoinRequestsPopup.value = !showFilterJoinRequestsPopup.value
  }


  // handle accept / finish research 
  const researchPaymentStatus = ref(false)
  const handleChangeResearchStatus = () => {
    if(getResult?.value?.status == 3){
      if(researchPaymentStatus?.value){
        getMethod(`research-opportunities/${route.params.id}/change-status` , null , true , true)
      }
      else{
      showErrorToast(globalStore?.lang == 'ar' 
        ? 'يجب الاقرار بتسليم الأعضاء المقابل المادي' 
        : 'You must acknowledge the receipt of payment to the members')
      }
    }else{
      getMethod(`research-opportunities/${route.params.id}/change-status` , null , true , true)
    }
  }


  // handle cancel research popup
  const researcherID = ref()

  // handle show cancel research popup
  const showCancelResearchPopup = ref(false)
  const handleShowCancelResearchPopup = (id) =>{
    researcherID.value = id
    showCancelResearchPopup.value = !showCancelResearchPopup.value
  }

  // handle submit cancel research
  const handleSubmitCancelResearchPopup = (cancelReason) =>{
    if(!cancelReason){
      showErrorToast(globalStore?.lang == 'ar' ? 'يجب إضافة سبب الالغاء' : 'You must add a reason for cancellation')
    }else{
      submitMethod(`research-opportunities/${route.params.id}/cancel`, true , {
        cancel_reason : cancelReason
      } , 'POST' , '')
    }
  }


  // handle accept join request 
  const handleAcceptJoinRequest = (userID) => {
    submitMethod(`research-opportunities/accept-join-request` , true , {
      research_opportunity_id : route.params.id,
      member_id : userID
    } , 'POST' , '' , route.query.type == 'owned' ? 
      `research-opportunities/${route.params.id}/show` :
      `participated-researches/${route.params.id}/show`)
  }


  // handle refuse join request
  const handleRefuseJoinRequest = (userID) => {
    submitMethod(`research-opportunities/refuse-join-request` , true , {
      research_opportunity_id : route.params.id,
      member_id : userID
    } , 'POST' , '' , route.query.type == 'owned' ? 
      `research-opportunities/${route.params.id}/show` :
      `participated-researches/${route.params.id}/show`)
  }

  // handle join type (لتحديد نوع المشاركة)
  const handleJoinType = (joinType) => {
    body.value.contribution_type_id = joinType
    handleShowFilterJoinRequestsPopup()
  }

    // handle start chat
  const handleStartChat = (user)=>{
    // console.log(user)
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
    if(submitResult?.value?.data?.key == 'success'){
      if(submitResult?.value?.endPoint == 'research-opportunities/refuse-join-request'){
        handleShowCancelResearchPopup()
        handleShowSuccessPopup()
      }
      if(submitResult?.value?.endPoint == 'create-private-room'){
        // console.log(submitResult?.value?.data?.data)
        globalStore.roomId = submitResult?.value?.data?.data?.room?.id
        router.push(localeRoute('/chats?'))
      }
    }
  })


  onMounted(()=>{
    getMethod(
      route.query.type == 'owned' ? 
      `research-opportunities/${route.params.id}/show` :
      `participated-researches/${route.params.id}/show`,
      null , 
      true , 
      false
    )
  })
</script>

<style lang="scss" scoped>
  .project_page{
    .head{
      @include displayFlex($gap :15px , $justify : space-between ,$wrap :wrap);
      margin-bottom: 15px;
      h3{
        text-wrap: nowrap;
        font-size: clamp(18px , 2.5vw ,24px);
        font-weight: 500;
      }
      p {
        font-size: 18px;
        font-weight: 400;
        color: #6F6F6F;
        margin-inline: clamp(20px , 2.5vw ,100px) auto;
        text-wrap: nowrap;
        @media (max-width : 567px){
          margin-inline: 0;
          margin-inline-start: auto;
          flex-grow: 1;
          text-align: end;
        }
      }
      .flex_buttons{
        justify-content: flex-end;
        margin-top: 0;
        width: fit-content;
        // margin-inline-start: auto;
        .main-btn{
          max-width: 300px;
          width: 100%;
          flex-shrink: 0;
          margin-top: 0;
          padding-inline: 12px;
        }
      }
      @media (max-width : 767px){
        flex-wrap: wrap;
        gap : 10px;
        margin-bottom: 20px;
        .flex_buttons{
          // margin-inline: auto;
          .main-btn{
            width: fit-content;
          }
        }
      }
      @media (max-width : 600px){
        .flex_buttons{
          width: 100%;
          flex-wrap: wrap;
          .main-btn{
            // width: 100%;
            flex-grow: 1;
          }
        }
      }
      @media (max-width : 467px){
        .flex_buttons{
          flex-wrap: wrap;
          justify-content: center;
          width: 100%;
          .main-btn{
            width: unset;
            flex-grow: 1;
          }
        }
      }
      .input-wrap{
        margin-top: 0;
        margin-inline-start: auto;
        @include displayFlex($gap : 4px);
        label{
          font-size: 18px;
          font-weight: 400;
          color: $mainColor;
          text-wrap: nowrap;
          cursor: pointer;
        }
        @media (max-width : 767px){
          margin-inline-start: 0;
          label{
            font-size: 14px;
          }
        }
      }
    }
    .research_item .item_head{
      align-items: flex-start;
      .buttons{
        flex-grow: 0;
        .main-btn{
          max-width: unset !important;
          // width: 100px !important;
          height: 35px !important;
          margin: 0 !important;
          // color: unset !important;
          &:first-of-type{
            margin-bottom: 5px !important;
          }
        }
      }
    }
    .canceled_reason{
      border: 1px solid $secColor;
      background: #FF35354D;
      padding-bottom: 15px;
      h3.title{
        color: #FF3535;
        font-size: clamp(14px , 2.5vw , 20px);
        margin-bottom: 0px;
      }
    }
    .researcher_details{
      h3.title{
        margin-bottom: 5px;
      }
    }
    .view_members_chat{
      font-size: 16px;
      height: 50px;
      width: 200px;
    }

    .research_item .item_head {
      .info {
        flex-shrink: unset !important;
        @media (max-width : 567px){
          max-width:100px;
        }
      }
      .buttons{
        width: 120px !important;
        .main-btn{
          color: #fff !important;
          &.reversed{
            background: #fff !important;
            color:$secColor !important;
            &::after,
            &::before{
              background: transparent !important;
            }
          }
        }
      }
    }
  }
</style>