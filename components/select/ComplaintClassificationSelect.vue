<template>
  <select 
    name="classification" 
    :value="props.classification"
    id="classification" 
    @change="emit('handleSelectClassification', $event.target.value)"
  >
    <option value="">{{$t('add_complaint_popup.classification')}}</option>
    <option 
      v-for="classification in getResult" 
      :key="classification.id" 
      :value="classification.id">
        {{classification.name}}
    </option>
  </select>
</template>

<script setup>
  // define props
  const props = defineProps({
    classification: String
  })

  // define emits
  const emit = defineEmits(['handleSelectClassification'])

  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()


  onMounted(()=>{
    getMethod('complaint-classifications' , '' , false , false)
  })
</script>

<style lang="scss" scoped>

</style>