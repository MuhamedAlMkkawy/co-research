<template>
  <div class="input">
    <i class="pi pi-users"></i>
    <select 
      name="organization" 
      id="organization"
      @change="emit('handleOrganization', $event.target.value)"
    >
      <option value="">{{ $t('register.organization') }}</option>
      <option v-for="city in getResult" :key="city.id" :value="city.id">{{city.name}}</option>
    </select>
  </div>
</template>

<script setup>
  // define emits 
  const emit = defineEmits(['handleOrganization'])

  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods()

  // define props
  const props = defineProps({
    research_field_id: Number
  })

  watchEffect(()=>{
    if(props.research_field_id){
      getMethod(`all-organizations?research_field_id=${props.research_field_id}` , '' , false , false)
    }
  })

  onMounted(()=>{
    getMethod(`all-organizations?research_field_id=${props.research_field_id}` , '' , false , false)
  })
</script>

<style lang="scss" scoped>

</style>