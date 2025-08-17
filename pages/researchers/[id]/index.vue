<template>
  <section class="page researcher_page">
    <div class="header_page">
      <h3 class="title">
        {{$t('researcher_page.title')}}
      </h3>
    </div>
    <div class="colored_tab align_start">
      <div class="image" @click="handleImagePopup(getResult?.image)">
        <img v-if="!globalStore?.loading" :src="getResult?.image" alt="image" loading="lazy">
        <Skeleton width="150px" height="150px" v-else />
      </div>
      <ul v-if="!globalStore.loading">
        <h3 class="title">{{getResult?.name}}</h3>
        <li v-if="getResult?.job_title">
          <div class="image icon">
            <img src="/assets/images/user.svg" alt="image" loading="lazy">
          </div>
          <h4>{{getResult?.job_title}}</h4>
        </li>
        <li v-if="getResult?.educational_qualification">
          <div class="image icon">
            <img src="/assets/images/book.svg" alt="image" loading="lazy">
          </div>
          <h4>{{getResult?.educational_qualification}}</h4>
        </li>
        <li v-if="getResult?.city_name">
          <div class="image icon">
            <img src="/assets/images/location.svg" alt="image" loading="lazy">
          </div>
          <h4>{{getResult?.city_name}}</h4>
        </li>
        <li v-if="getResult?.email">
          <div class="image icon">
            <img src="/assets/images/Letter.svg" alt="image" loading="lazy">
          </div>
          <h4>{{getResult?.email}}</h4>
        </li>
        <li>
          <div class="image icon" v-if="getResult?.identity_number">
            <img src="/assets/images/card.svg" alt="image" loading="lazy">
          </div>
          <h4>{{getResult?.identity_number}}</h4>
        </li>
        <li class="column" v-if="getResult?.identity_image">
          <h5>{{ $t('researcher_page.image') }}</h5>
          <div class="images">
            <div class="image" @click="handleImagePopup(getResult?.identity_image)"><img :src="getResult?.identity_image" alt="image" loading="lazy"></div>
            <a :href="getResult?.employee_card_image" download target="_blank" class="image"><img src="/assets/images/pdf.png" alt="image" loading="lazy"></a>
          </div>
        </li>
      </ul>
      <ul v-else>
        <h3 class="title">
          <Skeleton width="300px" height="20px" />
        </h3>
        <li v-for="i in 5">  
          <div class="image icon">
            <Skeleton width="20px" height="20px" />
          </div>
          <h4>
            <Skeleton width="200px" height="20px" />
          </h4>
        </li>
      </ul>
      <div class="flex_buttons" v-if="getResult?.is_mine_opportunity">
        <button class="main-btn success" @click="handleJoinRequest('accept' , user?.id)">
          {{ $t('project_page.accept') }}
        </button>
        <button class="main-btn danger" @click="handleJoinRequest('decline' , user?.id)">
          {{ $t('project_page.reject') }}
        </button>
      </div>
      <NuxtLink 
        v-if="!globalStore.loading"
        @click="handleStartChat(getResult)"
        class="main-btn">
        {{ $t('researcher_page.startChat') }}
      </NuxtLink>
    </div>
    <div class="twice_tabs first_type" v-if="!globalStore.loading">
      <div class="colored_tab" v-if="getResult?.experiences">
        <h3 class="title centered">{{ $t('researcher_page.experiences') }}</h3>
        <p>
          {{ getResult?.experiences }}
        </p>
      </div>
      <div class="colored_tab" v-if="getResult?.courses">
        <h3 class="title centered">{{ $t('researcher_page.trainingCourses') }}</h3>
        <p>
          {{ getResult?.courses }}
        </p>
      </div>
    </div>
    <div class="twice_tabs first_type" v-else>
      <div class="colored_tab" v-for="i in 2">
        <h3 class="title centered">
          <Skeleton width="150px" style="margin: 0 auto;" height="20px" />
        </h3>
        <p v-for="i in 5">
          <Skeleton width="300px" height="10px" />
        </p>
      </div>
    </div>
    <div class="colored_tab column_tab" v-if="!globalStore.loading">
      <h3 class="title">{{ $t('researcher_page.researchSpecializations') }}</h3>
      <ol v-if="getResult?.research_specializations?.length > 0">
        <li 
          v-for="item in getResult?.research_specializations" 
          :key="item?.id">{{item?.name}}</li>
      </ol>
      <ol v-else>
        <li v-for="i in 9">
          <Skeleton width="200px" height="20px" />
        </li>
      </ol>
    </div>
    <div class="colored_tab column_tab" v-else>
      <h3 class="title">
        <Skeleton width="200px" style="margin: 0 auto;" height="20px" />
      </h3>
      <ol>
        <li v-for="i in 9">
          <Skeleton width="200px" height="20px" />
        </li>
      </ol>
    </div>
    <div class="twice_tabs" v-if="!globalStore.loading">
      <div class="colored_tab column_tab">
        <h3 class="title">{{ $t('researcher_page.researchFieldTitle') }}</h3>
        <ol>
          <li>{{getResult?.research_field_name}}</li>
        </ol>
      </div>
      <div class="colored_tab">
        <h3 class="title">
          {{ $t('researcher_page.publishedResearch') }} 
          {{getResult?.published_researches_number}}
        </h3>
      </div>
    </div>
    <div class="colored_tab">
      <h3 class="title">
        {{ $t('researcher_page.participatedResearch') }} 
        {{getResult?.participated_researches_number}}
      </h3>
    </div>
    <div 
      class="colored_tab column_tab" 
      v-for="item in getResult?.participated_researches" 
      :key="item?.id"
    >
      <h4>
        <span>{{ $t('researcher_page.researchType') }} </span>
        <span>{{item?.research_type}}</span>
      </h4>
      <h4>
        <span>{{ $t('researcher_page.researchName') }} </span>
        <span>{{item?.name}}</span>
      </h4>
      <h4>
        <span>{{ $t('researcher_page.researchField') }} </span>
        <span>{{item?.research_field}}</span>
      </h4>
      <h4>
        <span>{{ $t('researcher_page.researchSpecialization') }} </span>
        <div class="specializations">
          <span class="specialization"  v-for="specialization in item?.specializations" :key="specialization?.id">
            {{specialization?.name}}
          </span>
        </div>
      </h4>
      <div class="images" v-if="item.research_file">
        <div class="image">
          <a :href="item.research_file" target="_blank" class="image">
            <img src="/assets/images/pdf.png" alt="image" loading="lazy">
          </a>
        </div>
      </div>
    </div>
    <ImagePopup 
      :image="image"
      v-show="showImagePopup"
      @handleShowImagePopup="handleShowImagePopup"
    />
  </section>
</template>
<script setup>
  // define route 
  const route = useRoute()

  // define router 
  const router = useRouter()

  // define locale route 
  const localeRoute = useLocaleRoute()

  // define global store
  const globalStore = useGlobalStore()


  // handle the src of image popup
  const image = ref()
  const showImagePopup = ref(false)

  const handleShowImagePopup = () => {
    showImagePopup.value = !showImagePopup.value
  }

  const handleImagePopup = (newImage) =>{
    handleShowImagePopup()
    image.value = newImage
  }

  // define api methods 
  const {
    getMethod,
    getResult,
    submitMethod,
    submitResult
  } = useApiMethods()

  // handle start chat
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
    if(submitResult?.value?.data?.key == 'success'){
      globalStore.roomId = submitResult?.value?.data?.room?.id
      router.push(localeRoute(`/chats?' + ${submitResult?.value?.data?.room?.id}`))
    }
  })


  // handle join request
  const handleJoinRequest = (type , userID) => {
    submitMethod(`${type}-employee-request` , true , {
      employee_id : userID
    } , 'POST' , '' , 'employee-requests')
  }



  onMounted(()=>{
    if (globalStore.memberInfo.id) {
      getMethod(`employee-details?employee_id=${route.params.id}`, null, true, false)
    } else {
      getMethod(`researcher-details?id=${route.params.id}`, null, true, false)
    }
  })
</script>

<style lang="scss" scoped>
  .image{
    cursor: pointer; 
  }
  .colored_tab{
    background: #ECECEC80;
    border-radius: 12px;
    padding: 25px 16px 22px;
    @include displayFlex($justify : flex-start);
    position: relative;
    h3.title{
      margin-bottom: 0;
      &.centered{
        text-align: center;
      }
    }
    &.align_start{
      align-items: flex-start !important;
      a.main-btn{
        position: absolute;
        inset-inline-end: 15px;
        bottom: 25px;
        max-width: 200px;
        margin-top: 0;
        font-size: 16px;
        height: 50px;
        @media (max-width : 667px){
          position: unset;
          max-width: unset;
        }
      }
      .flex_buttons{
        margin: 10px 0 0;
        justify-content: flex-end;
        max-width: 400px;
        margin-inline-start: auto;
        .main-btn{
          max-width: unset;
          margin-top: 0;
        }
        @media (max-width : 667px){
          margin-inline-start: unset;
          max-width: unset;
        }
      }
    }
    &:not(:last-of-type){
      margin-bottom: 30px;
    }
    > .image{
      @include circle(150px);
      flex-shrink: 0;
    }
    ul{
      h3.title{
        margin-bottom: 8px;
      }
      li{
        @include displayFlex($justify:flex-start , $gap : 5px);
        .image{
          width: 20px;
        }
        &:not(:last-of-type){
          margin-bottom: 10px;
        }
        &.column{
          flex-direction: column;
          align-items: flex-start;
          .images{
            @include displayFlex($justify : flex-start , $gap : 10px);
            .image{
              width: 50px;
              border-radius: 6px;
              overflow: hidden;
            }
          }
        }
      }
    }
    @media (max-width : 667px){
      flex-wrap: wrap;
      justify-content: center;
    }
    &.column_tab{
      flex-direction: column;
      align-items: flex-start;
      ol{
        @include displayGrid($gap : 40px 20px);
        width: 100%;
        li{
          @include displayFlex($justify : flex-start , $gap : 2px);
          &::before{
            content: url('/assets/images/book.svg');
            line-height: 0;
          }
        }
      }
    }
    &:nth-of-type(6){
      padding-block: 35px;
    }
    &:nth-child(n+7)
    {
      flex-direction: column;
      align-items: flex-start;
      h4{
        color: $mainColor;
        @include displayFlex($justify : flex-start , $gap : 5px);
        span{
          font-weight: 500;
          color: $secColor;
          &:first-of-type:not(.specialization){
            font-weight: 600;
            color: $mainColor;
          }
        }
      }
      .images{
        @include displayFlex($gap : 10px);
      }
    }
  }
  .twice_tabs{
    @include displayFlex($align : stretch);
    margin-bottom: 30px;
    .colored_tab{
      margin-bottom: 0;
      flex-direction: column;
      justify-content: center;
      flex-grow: 1;
      h3.title{
        width: 100%;
        margin-bottom: 0;
      }
    }
    @media (max-width : 767px){
      flex-wrap: wrap;
    }
    &.first_type{
      .colored_tab{
        border: 1px solid $secColor;
      }
    }
  }

  .specializations{
    @include displayFlex($justify : flex-start , $gap : 5px);
    position: relative;
    span:not(:last-of-type)::after{
      content: '-';
      margin-inline-start: 5px;
    }
  }
</style>