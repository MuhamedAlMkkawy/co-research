<template>
  <div class="popup">
    <div class="content">
      <button class="close_btn" @click="emit('handleShowFilterJoinRequestsPopup')">
        <i class="pi pi-times"></i>
      </button>
      <h3 class="title">
        {{
          route.path.startsWith('/researches')
            ? $t('filterJoinReqPopup.participationType')
            : $t('filterJoinReqPopup.title')
        }}
      </h3>
      <form action="" v-if="props.available_contribution_types?.length > 0">
        <h4 v-if="!route.path.startsWith('/researches')">
          {{ $t('filterJoinReqPopup.participationType') }}
        </h4>
        <div 
          class="input-wrap" 
          v-for="item in contributionTypes" 
          :key="item?.id" 
          v-if="!useGlobalStore().loading"
        >
          <input 
            type="radio"
            name="share_type"
            :id="item?.id"
            :value="item?.id"
            v-model="body.contribution_type"
          >
          <label :for="item?.id">{{item?.name}}</label>
        </div>
        <div 
          class="input-wrap" 
          v-for="i in 7" 
          :key="i" 
          v-else
        >
          <Skeleton width="100%" height="30px"  />
        </div>
      </form>
      <button class="main-btn"  @click="emit('handleJoinType' , body.contribution_type)">
        {{ $t('filterJoinReqPopup.submit') }}
      </button>
    </div>
  </div>
</template>

<script setup>
  // define route 
  const route = useRoute()


  // define emits 
  const emit = defineEmits(['handleShowFilterJoinRequestsPopup' , 'handleJoinType'])

  // Define api methods
  const {
    getMethod,
    getResult,
  } = useApiMethods()

  // define props
  const props = defineProps({
    joinType : Number,
    available_contribution_types : Object
  })


  const contributionTypes = computed(()=>{
    if(props.joinType){
      return props.available_contribution_types?.filter((item) => item?.id === props.joinType)
    }else{
      return props.available_contribution_types
    }
  })

  // define body
  const body = ref({
    contribution_type: props.joinType
  })

  // onMounted(()=>{
  //   getMethod('contribution-types' , null , true , false)
  // })
</script>

<style lang="scss" scoped>
  .popup{
    .content{
      justify-content: flex-start;
      gap: 10px;
      padding-block: 20px;
      form{
        max-height: 300px;
        overflow-y: scroll;
        .input-wrap{
          width: 100%;
        }
      }
    }
  }
</style>
