<template>
  <div class="popup">
    <div class="content">
      <button class="pi pi-times close_btn" @click="emit('handleShowFilterResearchesPopup')"></button>
      <h3 class="title">
        {{ $t('filterResearchesPopup.filter_research_opportunities') }}
      </h3>
      <h5>
        {{ $t('filterResearchesPopup.research_specialization') }}
      </h5>
      <MulitSelectFields 
        :endPoint="'research-fields/specializations'"
        @handleSpecializations="body.specializations = $event"
      />
      <form action="" v-if="getResult?.length > 0">
        <h5>
          {{ $t('filterResearchesPopup.participation_types') }}
        </h5>
        <div class="input-wrap" v-for="item in getResult" :key="item?.id">
          <input 
            type="radio"
            name="share_type"
            :id="item?.id"
            :value="item?.id"
            @click="body.contribution_types.push(item?.id)"
          >
          <label :for="item?.id">{{item?.name}}</label>
        </div>
      </form>
      <button class="main-btn" @click="emit('handleFilterResearches' , body)">
        {{ $t('filterResearchesPopup.apply') }}
      </button>
    </div>
  </div>
</template>

<script setup>
  // define emits 
  const emit = defineEmits(['handleShowFilterResearchesPopup' , 'handleFilterResearches'])

  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()

  // define body
  const body = ref({
    specializations: [],
    contribution_types : []
  })


  onMounted(()=>{
    getMethod('contribution-types' , null , true , false)
  })
</script>

<style lang="scss" scoped>
  .popup{
    .content{
      justify-content: flex-start;
      gap: 0;
      h3.title{
        margin-bottom: 15px;
        font-size: 22px;
        max-width: 460px;
      }
      form{
        border-top: 0.5px solid $secColor;
        padding-block-start: 5px;
        margin-block-start: 10px;
        max-height: 300px;
        overflow-y: scroll;
        h5{
          margin-bottom: 10px !important;
          font-size: 16px;
        }
        label{
          margin-bottom: 0;
        }
        .input{
          margin-bottom: 20px;
        }
      }
    }
  }
</style>