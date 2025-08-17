<template>
  <section class="page profile">
    <div class="header_page">
      <h3 class="title">
        {{ $t('profile_page.title') }}
      </h3>
      <NuxtLink :to="$localeRoute('/update_profile')" class="main-btn">{{ $t('profile_page.edit') }}</NuxtLink>
    </div>
    <!--################## بيانات الملف الشخصي ##################-->
    <div class="colored_tab">
      <div class="image">
        <!-- <img  @click="handleImagePopup(getResult?.image)" :src="getResult?.image" alt="image" loading="lazy"> -->
        <Image :src="getResult?.image" style="height: 100%;" alt="image" loading="lazy" preview/>
      </div>
      <ul>
        <h3 class="title">{{getResult?.name}}</h3>
        <li v-if="useGlobalStore().userType == 2 &&  getResult?.name">
          <div class="image icon">
            <img src="/assets/images/users.png" alt="image" loading="lazy">
          </div>
          <h4>{{getResult?.name}}</h4>
        </li>
        <li v-if="getResult?.commercial_number">
          <div class="image icon">
            <img src="/assets/images/user.svg" alt="image" loading="lazy">
          </div>
          <h4>{{$t('organization_page.commercial_number')}} : {{getResult?.commercial_number}}</h4>
        </li>
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
        <li v-if="getResult?.user_type == 1">
          <div class="image icon">
            <img src="/assets/images/card.svg" alt="image" loading="lazy">
          </div>
          <h4>{{getResult?.identity}}</h4>
        </li>
        <li class="column" v-if="getResult?.user_type == 1">
          <h5>{{ $t('profile_page.image') }}</h5>
          <div class="images">
            <div class="image" @click="handleImagePopup('https://cdn.pixabay.com/photo/2024/12/13/21/16/bird-9266166_1280.jpg')"><img src="https://cdn.pixabay.com/photo/2024/12/13/21/16/bird-9266166_1280.jpg" alt="image" loading="lazy"></div>
            <a href="https://cdn.pixabay.com/photo/2024/12/13/21/16/bird-9266166_1280.jpg" download target="_blank" class="image"><img src="/assets/images/pdf.png" alt="image" loading="lazy"></a>
          </div>
        </li>
      </ul>
    </div>
    <div class="colored_tab column" style="align-items: center;border:1px solid #959595;" v-if="useGlobalStore().userType == 2 && getResult?.about_organization">
      <h3 class="title centered">
        {{ $t('profile_page.about_organization') }}
      </h3>
      <p>
        {{ getResult?.about_organization }}
      </p>
    </div>
    <!--################## المجال البحثي وعدد الابحاث المنشوره ##################-->
    <div class="twice_tabs">
      <div class="colored_tab column" v-if="getResult?.research_fields?.length > 0">
        <h3 class="title centered">{{ $t('profile_page.researchField') }}</h3>
        <ol>
          <li v-for="(item, index) in getResult?.research_fields" :key="index">
            <div class="image">
              <img src="/assets/images/book.svg" alt="image" loading="lazy">
            </div>
            {{item?.name}}
          </li>
        </ol>
      </div>
      <div class="colored_tab" v-if="getResult?.published_researches_number">
        <h3 class="title centered">
          {{ $t('profile_page.published_researches_number') }}
          {{ getResult?.published_researches_number }}
        </h3>
      </div>
    </div>
    <!--################## الخبرات والدورات ##################-->
    <div class="twice_tabs" v-if="useGlobalStore().userType != 2">
      <div class="colored_tab column" v-if="getResult?.experiences">
        <h3 class="title centered">{{ $t('profile_page.experiences') }}</h3>
        <p>
          {{getResult?.experiences}}
        </p>
      </div>
      <div class="colored_tab column" v-if="getResult?.courses">
        <h3 class="title centered">{{ $t('profile_page.trainingCourses') }}</h3>
        <p>
          {{getResult?.courses}}
        </p>
      </div>
    </div>
    <!--################## التخصصات البحثية ##################-->
    <div class="colored_tab" :style="useGlobalStore().userType == 2 ? 'border:1px solid #959595;' : ''">
      <h3 class="title">{{ $t('profile_page.researchSpecializations') }}</h3>
      <ol>
        <li v-for="(item, index) in getResult?.research_specializations" :key="index">
          <div class="image">
            <img src="/assets/images/book.svg" alt="image" loading="lazy">
          </div>
          {{item.name}}
        </li>
      </ol>
    </div>
    <!--################## عدد الابحاث المشارك بها ##################-->
    <div class="colored_tab" v-if="getResult?.participated_researches_number">
      <h3 class="title centered">
        {{ $t('profile_page.participatedResearchesNumbers') }}
        {{ getResult?.participated_researches_number }}
      </h3>
    </div>
    <!--################## الابحاث المشارك بها ##################-->
    <div 
      class="colored_tab column"
      v-if="getResult?.participated_researches?.length > 0" 
      v-for="research in getResult?.participated_researches" 
      :key="research.id">
      <h4>
        <span>{{ $t('profile_page.researchType') }} </span>
        <span>{{ research?.research_type }}</span>
      </h4>
      <h4>
        <span>{{ $t('profile_page.researchName') }} </span>
        <span>{{ research?.name }}</span>
      </h4>
      <h4>
        <span>{{ $t('profile_page.researchField') }} </span>
        <span>{{ research?.research_field }}</span>
      </h4>
      <h4 v-if="research?.specializations?.length > 0">
        <span>{{ $t('profile_page.researchSpecialization') }} </span>
        <span 
          v-for="specialization in research?.specializations" 
          :key="specialization?.id">
          {{ specialization?.name }}
        </span>
      </h4>
      <div class="images" v-if="research?.research_file">
        <div class="image">
          <template v-if="research?.research_file?.includes('pdf')">
            <a :href="research?.research_file" download target="_blank" class="image">
              <img src="/assets/images/pdf.png" alt="pdf" loading="lazy">
            </a>
          </template>
          <template v-else>
            <div  @click="handleImagePopup(research?.research_file)" class="image">
              <img :src="research?.research_file" alt="image" loading="lazy">
            </div>
          </template>
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
  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()


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

  onMounted(()=>{
    getMethod('profile' , '' , true , false)
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
    @include displayFlex($justify : flex-start ,$align : flex-start);
    flex-grow: 1;
    width: 100%;
    &:not(:last-of-type){
      margin-bottom: 30px;
    }
    > .image{
      @include circle(150px);
      flex-shrink: 0;
    }
    h3.title{
      margin-bottom: 0
    }
    p{
      @include displayFlex($justify : flex-start , $gap : 5px);
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
    ol{
      @include displayGrid($gap :10px 20px);
      width: 100%;
      li{
        @include displayFlex($justify : flex-start ,$gap : 5px);
        &:not(:last-of-type){
          margin-bottom: 10px;
        }
      }
    }
    @media (max-width : 567px){
      flex-wrap: wrap;
      justify-content: center;
    }
    &:nth-of-type(4){
      // flex-direction: column;
      // align-items: flex-start;
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
    &:nth-of-type(5),
    &:nth-of-type(6),
    &.column{
      flex-direction: column;
      align-items: flex-start;
      h4{
        span{
          font-weight: 500;
          &:first-of-type{
            font-size: 18px;
            color: $mainColor;
          }
          &:not(:first-of-type){
            font-size: 16px;
            color: $secColor;
            position: relative;
            &:not(:last-of-type)::after {
              content: '-';
              margin-inline-start: 5px;
            }
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
      border: 1px solid $secColor;
      h3.title{
        margin-bottom: 0;
      }
    }
    @media (max-width : 767px){
      flex-wrap: wrap;
    }
  }
</style>