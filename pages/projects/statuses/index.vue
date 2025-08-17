<template>
  <section class="page"> 
    <ul class="statuses">
      <li 
        :class="{active : activeStatus == 'new'}" 
        @click="activeStatus = 'new'"
      >
        {{ $t('projects.statuses.new') }}
      </li>
      <li 
        :class="{active : activeStatus == 'current'}" 
        @click="activeStatus = 'current'"
      >
        {{ $t('projects.statuses.current') }}
      </li>
      <li 
        :class="{active : activeStatus == 'finished'}" 
        @click="activeStatus = 'finished'"
      >
        {{ $t('projects.statuses.completed') }}
      </li>
    </ul>
    <div class="content" v-if="getResult?.data?.length > 0">
      <NuxtLink 
        class="project_item" 
        v-for="item in getResult?.data" 
        :key="item?.id"
        :to="$localeRoute('/projects/' + item?.id + '?type=' + route.query.type)" 
        v-if="!globalStore.loading"
      >
        <div class="image">
          <img src="/assets/images/logo.png" alt="image" loading="lazy">
        </div>
        <div class="item_text">
          <div class="row_item">
            <h4>
              {{ $t('projects.research.title') }}  
              {{item?.title}}
            </h4>
            <p class="research_num">
              {{ $t('projects.research.requestNumber') }} 
              {{ item?.research_num }}
            </p>
          </div>
          <h4>
            {{ $t('projects.research.field') }} 
            {{item?.research_field}}
          </h4>
          <p>
            {{ $t('projects.research.status') }} 
            {{item?.status_text}}
          </p>
        </div>
      </NuxtLink>
      <NuxtLink 
        class="project_item" 
        v-for="i in 18" 
        :key="i"
        v-else
      >
        <div class="image">
          <Skeleton width="100px" height="100px" />
        </div>
        <div class="item_text">
          <div class="row_item">
            <h4>
              <Skeleton width="100%" height="20px" />
            </h4>
            <p>
              <Skeleton width="100%" height="20px" />
            </p>
          </div>
          <h4>
            <Skeleton width="100%" height="20px" />
          </h4>
          <p>
            <Skeleton width="100%" height="20px" />
          </p>
        </div>
      </NuxtLink>
    </div>
    <Empty v-else />
    <Pagination 
      v-if="!globalStore.loading"
      :endPoint="
        route.query.type == 'owned' ? 
        `research-opportunities/${activeStatus}` :
        `participated-researches/${activeStatus}`
      "
      :data="getResult?.data?.pagination"
    />
  </section>
</template>

<script setup>
  // define global store
  const globalStore = useGlobalStore()

  // define active status
  const activeStatus = ref('new')

  // define route 
  const route = useRoute()


  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()


  watch(()=> activeStatus?.value , (newValue)=> {
    if(newValue){
      getMethod(
        route.query.type == 'owned' ? 
        `research-opportunities/${newValue}` :
        `participated-researches/${newValue}`, 1 , true , true)
    }
  })

  onMounted(()=>{
    getMethod(
      route.query.type == 'owned' ? 
      `research-opportunities/${activeStatus.value}` :
      `participated-researches/${activeStatus.value}`, 1 , true , false)
  })
</script>

<style lang="scss" scoped>
  .page{
    ul.statuses{
      @include displayFlex($wrap : wrap);
      margin-bottom: clamp(10px , 2.5vw , 30px);
      li{
        width: 220px;
        padding-block: 10px;
        border-radius: 10px;
        box-shadow: 0px 2.8px 5.59px 0px #0000001A;
        @include displayFlex();
        background: #ECECEC4D;
        font-size: 18px;
        font-weight: 700;
        transition: 0.6s;
        cursor: pointer;
        user-select: none;
        &.active ,
        &:hover{
          background: #6F6F6F;
          color: #fff;
          box-shadow: unset;
        }
        @media (max-width : 767px){
          width: 150px;
          flex-grow: 1;
        }
      }
    }
    .content{
      @include displayFlex($wrap : wrap , $gap : 15px);
      .project_item{
        @include displayFlex($justify : flex-start , $wrap : wrap  ,$gap : 15px);
        border-radius: 12px;
        border: 1.66px solid $secColor;
        padding: 20px;
        width: 30%;
        // min-width: 30%;
        flex-grow: 1;
        .image{
          width: 40px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .item_text{
          flex-grow: 1;
          @include displayFlex($direction : column ,$align : flex-start ,  $gap : 10px);
          .row_item{
            @include displayFlex($justify : space-between);
            width: 100%;
          }
          h4 , p{
            font-size: 16px;
            font-weight: 400;
            text-wrap: nowrap;
            color: $mainColor;
            width: 100%;
          }
          p{
            color: $secColor !important;
            &.research_num{
              text-align: end;
            }
          }
        }
      }
    }
  }
</style>