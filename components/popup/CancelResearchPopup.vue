<template>
  <div class="popup">
    <div class="content">
      <h3 class="title centered">
        {{ $t('cancelResearchPopup.title') }}
      </h3>
      <div class="form">
        <label for="cancel_reason">
          {{ $t('cancelResearchPopup.input.label') }}
        </label>
        <div class="input">
          <textarea 
            name="cancel_reason" 
            id="cancel_reason"
            v-model="cancelReason"
          />
          <div class="input_placeholder" v-if="!cancelReason">
            <i class="pi pi-clipboard"></i>
            {{ $t('cancelResearchPopup.input.placeholder') }}
          </div>
        </div>
        <div class="flex_buttons">
          <button 
            class="main-btn danger" 
            @click="emit('handleSubmitCancelResearchPopup' , cancelReason)"
          >
            {{ $t('cancelResearchPopup.buttons.cancel') }}
          </button>
          <button 
            class="main-btn reversed" 
            @click="emit('handleShowCancelResearchPopup')"
          >
            {{ $t('cancelResearchPopup.buttons.back') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  // define emits
  const emit = defineEmits(['handleShowCancelResearchPopup' , 'handleSubmitCancelResearchPopup']) 


  // define cancel reason
  const cancelReason = ref('')
</script>

<style lang="scss" scoped>

</style>