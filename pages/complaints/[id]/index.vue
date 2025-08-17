<template>
  <section class="page complaint_page">
  <h3 class="title">
    {{ $t('complaint_single_page.title') }}
  </h3>
  {{ console.log(getResult) }}
  <p>{{getResult?.date}}</p>
  <div class="complaint_details colored_tab">
    <div class="number">
      {{getResult?.complaint_num}}
    </div>
    <div class="images">
      <NuxtLink :to="attach?.file_type == 'pdf' ? attach?.file_name : ''" :class="['image ' , attach?.file_type == 'pdf' ? 'pdf_image' : '']" v-for="attach in getResult?.attachments" :key="attach.id">
        <Image v-if="attach.file_type == 'image'" :src="attach?.file_name" loading="lazy" alt="image" preview/>
      </NuxtLink>
      <!-- <h6>
        {{ $t('complaint_single_page.classification') }} شكوي للادارة
      </h6> -->
    </div>
    <p>
      {{ getResult?.complaint }}
    </p>
  </div>
  <h3 class="title" v-if="getResult?.reply">{{ $t('complaint_single_page.response_title') }}</h3>
  <div class="text" v-if="getResult?.reply">
    {{ getResult?.reply }}
  </div>
</section>
</template>

<script setup>
  // define route 
  const route = useRoute()

  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()


  onMounted(()=>{
    getMethod(`complaints/${route.params.id}` , '' , true , false)
  })
</script>

<style lang="scss" scoped>
  section.page{
    h3.title{
      margin-bottom: 10px;
    }
    p{
      font-size: clamp(16px , 2.5vw , 20px);
      font-weight: 400;
      color: $secColor;
      // margin-bottom: 20px;
    }
    .colored_tab{
      background: $thirdColor;
      border-radius: 12px;
      padding: 18px clamp(12px , 2.5vw , 20px);
      position: relative;
      margin-bottom: 20px;
      .number{
        flex-shrink: 0;
        width: 140px;
        height: 140px;
        border-radius: 12px;
        @include displayFlex();
        background: $mainColor;
        color: #fff;
        font-size: 60px;
        font-weight: 500;
        padding-inline: clamp(10px , 2.5vw , 35px);
        position: absolute;
        inset-inline-start: 0;
        top: 0;
      }
      .images{
        padding-inline-start: 130px;
        @include displayFlex($justify:flex-start , $wrap : wrap , $gap : clamp(10px , 2.5vw , 20px));
        margin-bottom: 30px;
        cursor: pointer;
        .image{
          width: 100px;
          height: 100px;
          border-radius: 12px;
          overflow: hidden;
          img , span.p-image.p-component.p-image-preview-container{
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          &.pdf_image{
            width: 60px;
            img{
              object-fit: contain;
            }
          }
        }
        h6{
          font-size: 18px;
          font-weight: 600;
          color: #1D1D1D;
        }
        + p{
          font-size: 18px;
          color: #1D1D1D;
          font-weight: 400;
        }
      }
      @media (max-width : 567px){
        .number{
          position: unset;
          width: 100%;
          height: 100px;
          margin: 0 auto 20px;
          flex-grow: 1;
        }
        .images{
          flex-wrap: wrap;
          justify-content: center;
          padding-inline-start: 0;
          margin-bottom: 5px;
        }
      }
      +h3.title{
        font-size: 18px;
        font-weight: 600;
      }
    }
    .text{
      border: 1px solid $mainColor;
      border-radius: 12px;
      padding: 18px 16px;
      font-size: 16px;
    }
  }
</style>