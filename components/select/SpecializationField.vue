<template>
  <select 
    name="specialization_field" 
    id="specialization_field"
    v-model="specializationField"
    @change="emit('handleChangeSpecializationField', specializationField)"
  >
    <option value=0>{{ $t('create_research.inputs.research_specialty.label') }}</option>
    <option 
      v-for="field in getResult" 
      :key="field.id" 
      :value="field"
    >
      {{field.name}}
    </option>
  </select>
</template>

<script setup>
  // define api methods
  const {
    getMethod,
    getResult,
  } = useApiMethods()

  const handleFetchSpecializations = (id) => {
    getMethod(`research-fields/specializations?research_field_ids[]=${id}`, '', false, false);
  };
  
  // define props
  const props = defineProps({
    research_field_id : Number 
  })
  

  const field = ref(props.research_field_id ? props.research_field_id : 0)

  const specializationField = ref(0)
  
  // define emits
  const emit = defineEmits(['handleChangeSpecializationField'])

  watchEffect(()=>{
    if(isNaN(props.research_field_id)){
      field.value = 0
    }
  })

  onMounted(()=>{
    props.research_field_id && handleFetchSpecializations(props.research_field_id);
  })
</script>

<style lang="scss" scoped>

</style>


<!-- HOW TO USE THE COMPONENT => THIS FOR SINGLE SPECIALIZATION -->
<!-- 
  <SpecializationField
    :research_field_id="Number(body.research_field_id)" 
    @handleChangeSpecializationField="handleChangeSpecializationField"
  />
-->