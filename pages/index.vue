<template>
  <div class="home_page page">
    <MainSlider />
    <section class="about flex-wrap">
      <div class="image" v-if="!globalStore.loading">
        <img src="/assets/images/staticPage_image.png" alt="image" loading="lazy">
      </div>
      <div class="head_text">
        <h4 class="title">{{ $t('home.about.title') }}</h4>
        <p v-if="!globalStore.loading">
          {{ getResult }}
        </p>
        <Skeleton v-else width="100%" height="12rem" style="margin-bottom: 30px;"/>
        <NuxtLink :to="localeRoute('/about')" class="main-btn">
          {{$t('home.about.button')}}
        </NuxtLink>
      </div>
    </section>
    <section class="departments">
      <h3 class="title centered">{{ $t('home.departments.title') }}</h3>
      <div class="flex_links flex-wrap">  
        <NuxtLink :to="localeRoute('/researches')">
          <div class="image">
            <img src="/assets/images/1.png" alt="image" loading="lazy">
          </div>
          <h5>{{ $t('home.departments.chances') }}</h5>
        </NuxtLink>
        <NuxtLink :to="localeRoute('/create_research')">
          <div class="image">
            <img src="/assets/images/2.png" alt="image" loading="lazy">
          </div>
          <h5>{{ $t('home.departments.create') }}</h5>
        </NuxtLink>
      </div>
      <div class="tab">
        <NuxtLink :to="localeRoute('/researchers')">
          <h6>{{ $t('home.departments.researchers') }}</h6>
          <div class="icon">
            <i :class="`pi pi-arrow-${globalStore.lang == 'ar' ? 'left' : 'right'}`"></i>
          </div>
        </NuxtLink>
        <div class="image">
          <img src="/assets/images/3.png" alt="image" loading="lazy">
        </div>
      </div>
      <div class="tab">
        <div class="image">
          <img src="/assets/images/4.png" alt="image" loading="lazy">
        </div>
        <NuxtLink :to="globalStore.userType == 1 ? localeRoute(`/organizations/${auth.profile.organization_id}`) : localeRoute('/organizations')">
          <div class="icon">
            <i :class="`pi pi-arrow-${globalStore.lang == 'ar' ? 'right' : 'left'}`"></i>
          </div>
          <h6 v-if="globalStore.userType == 1">{{ $t('home.departments.organization') }}</h6>
          <h6 v-else>{{ $t('home.departments.organizations') }}</h6>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
  // define locale route 
  const localeRoute = useLocaleRoute()

  // define global store
  const globalStore = useGlobalStore()

  // define auth 
  const auth = useAuth()

  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()


  onMounted(()=>{
    globalStore.roomId = ''
    getMethod('about' , '' , false , false)
  })
</script>

<style lang="scss" scoped>
  // about section 
  .about{
    @include displayFlex($justify : flex-start);
    .image{
      max-width: 300px;
      width: 100%;
      img{
        object-fit: contain;
      }
    }
    .head_text{
      flex-grow: 1;
      p{
        @include textTruncate(5);
      }
    }
    @media (max-width : 767px){
      flex-wrap: wrap;
      // justify-content: flex-start;
      .image{
        max-width: 200px;
        margin: 0 ;
      }
    }
  }
  // departments section
  .departments{
    .flex_links{
      @include displayFlex($align : stretch);
      justify-content: space-between;
      a{
        @include displayFlex($direction : column);
        flex-grow: 1;
        background: $thirdColor;
        padding: 50px 20px;
        max-width: 580px;
        border-radius: 16px;
        transition: 0.3s;
        .image{
          max-width: 200px;
          margin-bottom: 20px;
          transition: 0.3s;
          img{
            object-fit: contain;
          }
          @media(max-width : 767px){
            max-width: 150px;
          }
          @media(max-width : 567px){
            max-width: 100px;
          }
        }
        h5{
          font-size: 20px;
          font-weight: 500;
          opacity: 0;
          transition: 0.3s;
        }
        &:hover{
          background: $secColor;
          .image{
            filter: brightness(0)invert(1);
          }
          h5{
            opacity: 1;
            color: #fff;
          }
        }
      }
      @media (max-width : 767px){
        @include displayGrid();
      }
    }
    .tab{
      @include displayFlex($align : flex-end , $gap : 50px);
      width: 100%;
      a{
        flex-grow: 1;
        @include displayFlex($justify : space-between);
        background: $thirdColor;
        border-radius: 16px;
        padding: 30px 50px;
        transition: 0.3s;
        h6{
          font-size: clamp(18px , 4vw , 30px);
          font-weight: 500;
        }
        .icon{
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: $mainColor;
          @include displayFlex();
          color: #fff;
        }
        &:hover{
          background: $secColor;
          h6{
            color: #fff;
          }
          .icon{
            background: $thirdColor;
            // color: $thirdColor;
          }
        }
      }
      .image{
        width: 250px;
      }
      @media (max-width : 767px){
        .image{
          width: 150px;
        }
      }
      @media (max-width : 567px){
        .image{
          width: 100px;
        }
      }
      @media (max-width : 400px){
        .image{
          display: none;
        }
      }
      &:not(:last-of-type){
        margin-top: 30px;
        margin-bottom: clamp(10px , 4vw , 50px);
      }
    }
  }
</style>