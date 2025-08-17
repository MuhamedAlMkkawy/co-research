<template>
  <div class="input-wrap">
    <label for="city">{{ $t('register.city') }}</label>
    <div class="input">
      <i class="pi pi-map-marker"></i>
      <select 
        name="city" 
        id="city"
        :value="city_id"
        @change="emit('handleCity', $event.target.value)"
      >
        <option value="">{{ $t('register.city') }}</option>
        <option v-for="city in getResult" :key="city.id" :value="city.id">{{city.name}}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
  // define api methods
  const {
    getMethod,
    getResult
  } = useApiMethods();

  // define emits
  const emit = defineEmits(['handleCity']);

  const city_id = ref()

  // define props
  const props = defineProps({
    city_id : Number
  })


  watchEffect(()=>{
    city_id.value = props.city_id
  })

  onMounted(()=>{
    getMethod('cities' , '' , false , false)
  })
</script>

<style lang="scss" scoped>

</style>