<template>
  <div class="popup">
    <div class="content">
      <button class="main-btn close_btn" @click="emit('handleShowFilterResearcherPopup')">
        <i class="pi pi-times"></i>
      </button>
      <h3 class="title centered">
        {{ $t('researcher.filterResearcherPopup.title') }}
      </h3>
      <p>{{ $t('researcher.filterResearcherPopup.instruction') }}</p>
      <div class="input-wrap">
        <label for="">{{ $t('register.research_fields') }}</label>
        <MulitSelectFields 
          endPoint="research-fields"
          @handleSpecializations="body.specializations = $event"
        />
      </div>
      <button class="main-btn" @click="emit('handleResearchersFilter' , body.specializations)">
        {{ $t('researcher.filterResearcherPopup.apply') }}
      </button>
    </div>
  </div>
</template>

<script setup>
  // define emits 
  const emit = defineEmits(['handleShowFilterResearcherPopup' , 'handleResearchersFilter'])

  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()

  // define body
  const body = ref({
    specializations: []
  })


  // onMounted(()=>{
  //   getMethod('research-fields' , null , true , false)
  // })
</script>

<style lang="scss" scoped>
  .popup{
    .content{
      justify-content: flex-start;
      min-height: unset !important;
      .input-wrap{
        width: 100%;
        label{
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 5px;
          text-align: start;
        }
      }
    }
  }
</style>