<template>
  <div class="popup">
    <div class="content">
      <h5 class="title centered">
        {{ $t('add_complaint_popup.title') }}
      </h5>
      <div class="form" @keydown.enter.prevent="handleSubmit">
        <label for="classification">{{ $t('add_complaint_popup.classification') }}</label>
        <div class="input">
          <ComplaintClassificationSelect 
            :classification="body.complaint_classification_id"
            @handleSelectClassification="handleSelectClassification"
          />
        </div>
        <label for="title">{{ $t('add_complaint_popup.title_label') }}</label>
        <div class="input">
          <input 
            id="title"
            type="text"
            :placeholder="$t('add_complaint_popup.title_label')"
            v-model="body.subject"
          >
        </div>
        <label for="description">{{ $t('add_complaint_popup.description_label') }}</label>
        <div class="input">
          <textarea 
            name="description" 
            id="description"
            v-model="body.complaint"
          ></textarea>
          <div class="input_placeholder" v-if="!body.complaint">
            <i class="pi pi-clipboard"></i>
            {{ $t('add_complaint_popup.description_label') }}
          </div>
        </div>
        <label for="images">{{ $t('add_complaint_popup.images_label') }}</label>
        <UploadImages
          :inputType = "'multiple'"
          :UploadedLocalFile="UploadedLocalFile"
          @handleUploadImages="handleUploadImages"
          @handleRemoveImage="handleRemoveImage"
        />
        <div class="flex_buttons">
          <button 
            class="main-btn" 
            @click="handleSubmit">
            {{ $t('add_complaint_popup.send') }}
          </button>
          <button 
            class="main-btn reversed" 
            @click="emit('handleShowAddComplaintPopup')">
            {{ $t('add_complaint_popup.back') }}
          </button>
        </div>
      </div>
    </div>
    <Loading 
      v-if="globalStore.loading"
    />
  </div>
</template>

<script setup>
  // define i18n
  const { t } = useI18n()

  // define global store
  const globalStore = useGlobalStore()


  // define body
  const body = ref({
    complaint_classification_id : '',
    subject : '',
    complaint : '',
    attachments : []
  })

  // define toast msg
  const {
    showErrorToast
  } = useToastMsg()

  // define api methods
  const {
    submitMethod,
    submitResult
  } = useApiMethods()

  // handle select classification
  const handleSelectClassification = (newClassification) => {
    body.value.complaint_classification_id = newClassification
  }


  // research images after upload research information
  const UploadedLocalFile = ref([])

  // handle upload researches images
  const handleUploadImages = (uploadedFiles, index) => {
    if (uploadedFiles.length > 0) {
      const newFiles = Array.from(uploadedFiles).map((file) => {
        const imageUrl = URL.createObjectURL(file);
        return {
          url: imageUrl,
          file: file,
          type: file.type
        }
      });
      UploadedLocalFile.value = [...UploadedLocalFile.value, ...newFiles];
      // to upload the file to the server
      body.value.attachments = [...body.value.attachments, ...newFiles.map(file => file.file)];
    } else {
      UploadedLocalFile.value = []
      body.value.attachments = []
    }
  }

  // handle remove image
  const handleRemoveImage = (index) => {
    console.log(index)
    UploadedLocalFile.value.splice(index, 1)
    body.value.attachments.splice(index, 1)
  }

  // define emits
  const emit = defineEmits(['handleShowAddComplaintPopup' , 'handleSuccessPopup'])


  // define handleSubmit 
  const handleSubmit = () =>{
    if(!body.value.complaint_classification_id){
      showErrorToast(t('validations.complaints.classification'))
      return
    }
    else if(!body.value.subject){
      showErrorToast(t('validations.complaints.subject_required'))
      return
    }
    else if(body.value.subject.length < 2){
      showErrorToast(t('validations.complaints.subject_length'))
      return
    }
    else if(!body.value.complaint){
      showErrorToast(t('validations.complaints.complaint_required'))
      return
    }
    else if(body.value.complaint.length < 10){
      showErrorToast(t('validations.complaints.complaint_length'))
      return
    }
    else if(!body.value.attachments){
      showErrorToast(t('validations.complaints.attachments_required'))
      return
    }
    else{
      const formData = new FormData()
      formData.append('complaint_classification_id' , body.value.complaint_classification_id)
      formData.append('subject' , body.value.subject)
      formData.append('complaint' , body.value.complaint)
      body.value.attachments.forEach((attachment, index) => {
        formData.append(`attachments[${index}]`, attachment);
      })

      submitMethod('new-complaint' , true , formData , "POST" , '')
    }
  }


  watchEffect(()=>{
    if(submitResult?.value?.data?.key == 'success'){
      emit('handleSuccessPopup')
    }
  })
</script>

<style lang="scss" scoped>
  .popup{
    .content{
      justify-content: unset;
      max-height: 720px;
      overflow-y: scroll;
      padding-block-start: 50px;
      h5{
        margin-bottom: clamp(20px , 100% , 40px);
        text-align: center;
        font-size: clamp(18px , 100% , 50px);
      }
      form,
      .form{
        .local_images{
          .image{
            width: fit-content !important; 
          }
        }
        .input{
          margin-bottom: 20px;
          &:nth-of-type(3){
            margin-bottom: 30px;
          }
        }
        .flex_buttons{
          margin-block-start: 50px;
        }
      }
    }
  }
</style>