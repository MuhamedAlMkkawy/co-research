<template>
  <select 
    name="scientific_field" 
    id="scientific_field"
    v-model="field"
    @change="emit('handleChangeScientificField', typeof(field) == object ? getResult?.filter(element => element?.id == field) : field)"
  >
    <option value=0>{{ $t('register.field') }}</option>
    <option 
      v-for="item in getResult" 
      :key="item.id" 
      :value="$route.path.endsWith('register') || $route.path.endsWith('update-profile') ? item : item?.id"
    >
      {{item?.name}}
    </option>
  </select>
</template>

<script setup>
  // define api methods
  const {
    getMethod,
    getResult,
  } = useApiMethods()

  
  // define props
  const props = defineProps({
    research_field_id : [Number , Object] 
  })
  

  const field = ref(0)
  
  // define emits
  const emit = defineEmits(['handleChangeScientificField'])

  watchEffect(()=>{
    if(!isNaN(props.research_field_id)){
      field.value = props.research_field_id
    }
    // console.log(props.research_field_id)
  })

  onMounted(()=>{
    getMethod('research-fields' , '' , false , false)
  })
</script>

<style lang="scss" scoped>

</style>


<!-- HOW TO USE AND IMPORT -->

<!-- 
  <ScientificField 
    :research_field_id="body.research_field_id"
    @handleChangeScientificField="handleChangeScientificField"
  />

  //------|> WE CREATED THIS FUNCTION TO RESET THE SELECTED SPECIALIZATIONS AT FIRST
  // handle select scientific field  (المجال البحثي)
  const handleChangeScientificField = (scientificField) => {
    body.value.research_specialization_ids = []
    body.value.research_field_id = scientificField.id
  }
-->