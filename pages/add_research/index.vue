<template>
  <section class="page auth_page">
    <h3 class="title">
      {{ $t('add_research.title') }}
    </h3>
    <div class="form">
      <!--################# اسم البحث ###########################-->
      <div class="input-wrap m-b-20">
        <label for="research_name">{{ $t('register.research_name') }}</label>
        <div class="input">
          <i class="pi pi-clipboard"></i>
          <input 
            id="research_name"
            type="text"
            :placeholder="$t('register.research_name')"
            v-model="body.participated_researches[0].name"
          >
        </div>
      </div>
      <!--################# المجال البحثي ###########################-->
      <div class="input-wrap m-b-20">
        <label for="research_field">{{ $t('register.research_field') }}</label>
        <div class="input">
          <div class="image">
            <img src="/assets/images/book.svg" alt="image" loading="lazy">
          </div>
          <ScientificField 
            :research_field_id="Number(body.participated_researches[0].research_field_id)"
            @handleChangeScientificField="body.participated_researches[0].research_field_id = $event"
          />
        </div>
      </div>
      <!--################# التخصص البحثي ###########################-->
      <div 
        class="input-wrap specializations" 
        v-if="body.participated_researches[0].research_field_id">
        <label for="specializations">{{ $t('register.specializations') }}</label>
        <div class="input multiselect_input">
          <div class="image">
            <img src="/assets/images/book.svg" alt="image" loading="lazy">
          </div>
          <MulitSelectFields 
            v-if="body.participated_researches[0].research_field_id"
            :endPoint="'research-fields/specializations'"
            :research_field_id = "Number(body.participated_researches[0].research_field_id)"
            @handleSpecializations="handleResearchSpecializations"
          />
        </div>
      </div>
      <!--################# نوع البحث ###########################-->
      <label >{{ $t('register.research_type') }}</label>
      <div class="input-wrap row_input ">
        <input 
          type="radio" 
          name="research_type" 
          id="individual" 
          value="0"
          v-model="body.participated_researches[0].research_field_type"
        >
        <label for="individual">{{ $t('register.individual_research') }}</label>
      </div>
      <div class="input-wrap row_input m-b-20">
        <input 
          type="radio" 
          name="research_type" 
          id="shared" 
          value="1"
          v-model="body.participated_researches[0].research_field_type"
        >
        <label for="shared">{{ $t('register.shared_research') }}</label>
      </div>
      <!--################# إرفاق ملفات البحث ###########################-->
      <div class="input-wrap">
        <label for="research_files">
          {{ $t('register.research_files') }}
        </label>
        <UploadImages
          id="research_files"
          :UploadedLocalFile="LocalResearchFile"
          @handleUploadImages="handleUploadResearchImages"
          @handleRemoveImage="handleRemoveResearchFile"
        />
        <button 
          class="main-btn" 
          @click="handleUploadResearches">
            {{ $t('add_research.add_btn') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
  // define i18n
  const { t } = useI18n()

  // define toast
  const {
    showErrorToast
  } = useApiMethods()

  // define global store
  const globalStore = useGlobalStore()

  // define router
  const router = useRouter()


  // define locale route 
  const localeRoute = useLocaleRoute()

  // define body
  const body = ref({
    participated_researches: [
      {
        research_field_id: '',
        research_specialization_ids: [],
        name: "",
        research_field_type: '',
        research_files : []
      }
    ]
  })


  // research images after upload research information
  const isLocalResearchUploaded = ref(false)
  const LocalResearchFile = ref()

  // handle upload researches images (رفع ملف البحث)
  const handleUploadResearchImages = (uploadedFiles, index) => {
    const file = uploadedFiles[0];
    if (file) {
      if (file.type != 'application/pdf') {
        showErrorToast(t('validations.register.research_file_type'))
        return
      }
      const imageUrl = URL.createObjectURL(file);
      LocalResearchFile.value = [{
        url: imageUrl,
        file: file,
        type: file.type
      }];
      isLocalResearchUploaded.value = false;
      // to upload the file to the server
      body.value.participated_researches[0].research_files = LocalResearchFile;
    }
  }

  const handleRemoveResearchFile = () => {
    body.value.participated_researches[0].research_files = [];
  }


  // handle upload specialization fields (التخصصات البحثيه ل كل بحث مشارك به)
  const handleResearchSpecializations = (newSpecializations) => {
    body.value.participated_researches[0].research_specialization_ids = newSpecializations
  }



  const handleUploadResearches = () => {
    const research = body.value.participated_researches[0]
    
    // Check if any field has value
    const hasValues = 
      research.name || 
      research.research_field_id || 
      research.research_specialization_ids.length > 0 || 
      research.research_field_type || 
      research.research_files.length > 0
    
    if (hasValues) {
      // Validate required fields
      if (!research.name) {
        showErrorToast(t('validations.register.research_name'))
        return
      }
      else if (!research.research_field_id) {
        showErrorToast(t('validations.register.research_field'))
        return
      }
      else if (research?.research_specialization_ids?.length == 0) {
        showErrorToast(t('validations.register.research_specializations'))
        return
      }
      else if (!research.research_field_type) {
        showErrorToast(t('validations.register.research_type'))
        return
      }
      // else if (research.research_files == []) {
      //   showErrorToast(t('validations.register.research_files'))
      //   return
      // }
      else{
        globalStore.handleStoreSubmittedLocalResearches(research)
        router.push(localeRoute('/update_profile'))
      }
    }
    
    // If we get here, either all fields are valid or all are empty
    
    // // Reset fields
    // research.name = ""
    // research.research_field_id = ""
    // research.research_field_type = ""
    // research.research_specialization_ids = []
    // research.research_files = []
    // UploadedLocalFile.value = []
    
    // Navigate to next page
  }
</script>

<style lang="scss" scoped>
  .auth_page{
    margin: 0;
    padding-block:60px 30px;
    background-color: transparent;
    max-width: unset;
    height: unset;

    h3.title{
      font-size: 25px;
    }

    .row_input{
      @include displayFlex($justify : flex-start , $gap : 8px);
      margin-bottom: 0 !important;
      input{
        width: 20px;
      }
    }

    .input-wrap{
      margin-bottom: 20px;
    }

    .specializations{
      > .input{
        border: unset;
        position: relative;
        padding: 0;
        > .image{
          position: absolute;
          top: 12px;
          right: 8px;
          z-index: 99;
        }
        .input{
          height: 40px !important;
          margin-top: 0;
          padding: 0;
          padding-inline-start: 18px;
        }
      }
    }


    .main-btn{
      max-width: 700px;
      margin: 80px auto 0;
    }
  }
</style>