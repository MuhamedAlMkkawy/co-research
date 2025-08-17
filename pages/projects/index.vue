<template>
  <section class="page">
    <h3 class="title">{{$t('projects.myProjects')}}</h3>
    <NuxtLink :to="$localeRoute('/projects/statuses?type=owned')" class="tab">
      <div class="image">
        <img src="/assets/images/full_projects.png" alt="image" loading="lazy">
      </div>
      <h4>{{$t('projects.myResearch')}}</h4>
    </NuxtLink>
    <NuxtLink :to="$localeRoute('/projects/statuses?type=participated')" class="tab">
      <div class="image">
        <img src="/assets/images/part_projects.png" alt="image" loading="lazy">
      </div>
      <h4>{{$t('projects.participatedResearch')}}</h4>
    </NuxtLink>
  </section>
</template>

<script setup>

</script>

<style lang="scss" scoped>
  .page{
    h3.title{
      font-size: 20px;
      font-weight: 600;
    }
    .tab{
      @include displayFlex($justify:flex-start);
      border-radius: 12px;
      border: 1px solid #6F6F6F;
      background: #ECECEC80;
      max-width: 1000px;
      margin: 0 auto;
      height: 250px;
      padding-inline-start: 60px;
      .image{
        width: 100px;
        @media (max-width : 767px){
          width: 70px;
        }
        @media (max-width : 567px){
          width: 50px;
        }
      }
      h4{
        margin-inline: auto;
        font-size: 20px;
        font-weight: 500;
        color: $mainColor;
        @media (max-width : 767px){
          margin-inline: 0;
        }
      }
      &:first-of-type{
        margin-block: clamp(20px , 2.5vw , 50px);
      }
      @media (max-width : 567px){
        flex-direction: column;
        justify-content: center;
        padding-inline-start: 0;
        h4{
          margin-inline: unset !important;
        }
      }
      @media (max-width : 767px){
        justify-content: center;
        height: 150px;
      }
    }
  }
</style>