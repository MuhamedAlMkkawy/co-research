<template>
  <div 
    class="input card flex justify-center w-full"
    :style="{ marginBottom: selectedSpecializations.length > 0 ? '50px' : '0px' }"
  >
    <!-- :style="{ marginBottom: props.departmentError ? '15px' : '4px' }" -->
    <MultiSelect 
      v-model="selectedSpecializations" 
      :options="getResult ?? getResult?.data" 
      optionLabel="name" 
      :placeholder="
        props?.endPoint?.endsWith('specializations') ? 
        $t('register.specializations') : 
        $t('register.research_fields')"
      class="w-full" 
      @change="emit('handleSpecializations' , selectedSpecializations)"
      v-if="!useGlobalStore().loading"
    />
    <Skeleton v-else width="100%" height="37px" />
    <div class="selected-sections" v-if="selectedSpecializations?.length > 0">
      <span v-for="specialization in selectedSpecializations" :key="specialization?.id">
        {{ specialization?.name }}
        <button 
          class="pi pi-times" 
          @click="removeSpecialization(specialization?.id)">
        </button>
      </span>
    </div>  
  </div>
</template>

<script setup>
  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()
  
  const handleFetchSpecializations = (id) => {
    if (Array.isArray(id)) {
      getMethod(`research-fields/specializations?${id.map(item => `research_field_ids[]=${item?.id}`).join('&')}`, '', false, false);
    } else {
      getMethod(`research-fields/specializations?research_field_ids[]=${id}`, '', false, false);
    }
  };

  // define props
  const props = defineProps({
    research_field_id : Number,
    specializations : Array,
    research_field_ids : Array ,
    endPoint : String
  })


  const selectedSpecializations = ref([]);

  const removeSpecialization = (id) => {
    const removedSpecialization = selectedSpecializations?.value?.find(specialization => specialization.id === id);
    selectedSpecializations.value = selectedSpecializations?.value?.filter(specialization => specialization.id !== id);
    emit('handleSpecializations', selectedSpecializations.value, removedSpecialization);
  };

  // define emits 
  const emit = defineEmits(['handleSpecializations'])

  onMounted(()=>{
    if(props.research_field_id){
      handleFetchSpecializations(props.research_field_id)
    }
    else if(props.research_field_ids){
      handleFetchSpecializations(props.research_field_ids)
    }
    else{
      getMethod(props.endPoint, '', false, false);
    }
  })
  
  watchEffect(()=>{
    // if(selectedSpecializations.value.length > 0){
    //   emit('handleSpecializations' , selectedSpecializations?.value)
    // }else if (selectedSpecializations.value.length == 0){
    //   emit('handleSpecializations' , [])
    // }
    if(props.specializations){
      selectedSpecializations.value = props.specializations
    }
  })

  watch(() => props.endPoint, (newId, oldId) => {
    if (newId != oldId) {
      getMethod(props.endPoint, '', false, false);
    }
  });

  
  watch(() => props.research_field_id, (newId, oldId) => {
    if (newId != oldId) {
      handleFetchSpecializations(newId);
    }
  });
</script>


<style lang="scss" scoped>
  .input{
    display: flex;
    justify-content: flex-start;
    height: 50px !important; 
    position: relative; 
    // margin-bottom: 0 !important;
  }

  .multiSelect_placeholder{
    position: absolute;
    bottom: 0px;
    color: #6c757da6;
    z-index: 999;
  }
  .selected-sections {
    // margin-block:0 5px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    position: absolute;
    inset-inline-start: 0;
    // bottom: 6px;
    // width: 90%;
    bottom: -45px;
    width: 100%;
    height: 37px;
    overflow-y: scroll;
    padding-inline-start: 5px;
    // background: #fff;
    // padding-bottom: 8px;
    span{
      background: $thirdColor;
      border: 0.5px solid $secColor;
      border-radius: 5px;
      color: $mainColor;
      padding: 5px 10px;
      padding-inline-end: 25px;
      position: relative;
      .pi-times{
        position: absolute;
        inset-inline-end: 5px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 8px;
        @include circle(15px);
        background: $dangerColor;
        color: #fff;
      }
    }
  }

  .input{
    // border-radius: 0;
    width: 100%;
    // margin-block-start: 10px;
    // margin-bottom: 18px;
  }

  input{
    border: none;
  }

  .p-multiselect{
    width: 100%;
    padding-inline: 5px;
    height: 35px;
    border: none;

  }


  .selected-item {
    display: flex;
    align-items: center;
    background-color: #E0BDB0;
    color: $mainColor;
    border-radius: 25px;
    padding: 5px 10px 0;
    position: relative;
    // padding-inline-end: 20px;
  }

  .remove-btn {
    border: none;
    cursor: pointer;
    font-size: 8px;
    font-weight: bold;
    position: absolute;
    left: -5px;
    top: 0px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: red;
    color: #fff;
    padding: 2px;
    @include displayFlex();
    .pi{
      font-size: 9px;
      color: #fff;
      margin-bottom: 0;
    }
  }
</style>

<!-- HOW TO USE THE COMPONENT => WE USED IT FOR THE MULTISELECT FOR ANY INPUT -->
<!-- 
  <MulitSelectFields 
    :endPoint="'research-fields/specializations'"
    @handleSpecializations="body.specializations = $event"
  />
-->