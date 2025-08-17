<template>
  <section class="page create_research">
    <div class="header_page">
      <h3 class="title">
        {{ $t('create_research.title') }}
      </h3>
    </div>
    <div class="control_user_visible">
      <h4>{{ $t('create_research.control_user_visible.title') }}</h4>
      <div class="user_visibility">
        <div class="text">
          <h5>{{ $t('create_research.control_user_visible.text.title') }}</h5>
          <h6>{{ $t('create_research.control_user_visible.text.subtitle') }}</h6>
        </div>
        <InputSwitch v-model="body.show_researcher" />
      </div>
    </div>
    <div class="form">
      <div class="inputs">
        <div class="input-wrap">
          <!-- إسم البحث -->
          <label for="research_name">
            {{ $t('create_research.inputs.research_name.label') }}
            {{ $t('create_research.inputs.optional') }}
          </label>
          <div class="input">
            <i class="pi pi-user"></i>
            <input 
              type="text" 
              name="research_name" 
              id="research_name"
              :placeholder="$t('create_research.inputs.research_name.label')"
              v-model="body.title"
            >
          </div>
        </div>
        <!-- المجال البحثي -->
        <div class="input-wrap">
          <label for="research_field">
            {{ $t('create_research.inputs.research_field.label') }}
          </label>
          <div class="input">
            <div class="image">
              <img src="/assets/images/book.svg" alt="image" loading="lazy">
            </div>
            <!-- :research_field_id="Number(body.research_field_id)" -->
            <ScientificField 
              @handleChangeScientificField="handleChangeScientificField"
            />
          </div>
        </div>
      </div>
      <div class="inputs">
        <!-- التخصصات البحثية -->
        <div class="input-wrap" v-if="body.research_field_id">
          <label for="research_specialty">{{ $t('create_research.inputs.research_specialty.label') }}</label>
          <div class="input">
            <i class="pi pi-book"></i>
            <SpecializationField
              :research_field_id="Number(body.research_field_id)" 
              @handleChangeSpecializationField="handleChangeSpecializationField"
            />
          </div>
        </div>
        <!-- المدة المتوقعه -->
        <div class="input-wrap" :style="body.research_field_id ? '' : 'flex-grow: 1'">
          <label for="research_duration">{{ $t('create_research.inputs.research_duration.label') }}</label>
          <div class="input">
            <i class="pi pi-stopwatch"></i>
            <input 
              type="number"
              id="research_duration"
              name="research_duration"
              :placeholder="$t('create_research.inputs.research_duration.label')"
              v-model="body.research_expectation_period"
            >
          </div>
        </div>
      </div>
      <!-- ملخص عام -->
      <div class="input-wrap">
        <label for="summary">{{ $t('create_research.inputs.summary.label') }}</label>
        <div class="input textarea">
          <i class="pi pi-clipboard"></i>
          <textarea 
            name="summary" 
            id="summary"
            :placeholder="$t('create_research.inputs.summary.label')"
            v-model="body.description"
          />
        </div>
      </div>
      <!-- تحديد أنواع المشاركات -->
      <div class="detect_share" v-if="getResult">
        <h6>{{ $t('create_research.detect_share.title') }}</h6>
        <div class="form">
          <div 
            v-for="item in getResult" 
            :key="item.id" 
            class="participation-item"
          >
            <div class="input-wrap checkbox_wrap">
              <input 
                type="checkbox" 
                :id="'check-' + item.id" 
                :checked="isSelected(item.id)"
                @change="toggleContribution(item)"
              >
              <label :for="'check-' + item.id">{{ item.name }}</label>
            </div>

            <div v-if="isSelected(item.id)" class="inputs">
              <div class="input-wrap">
                <label :for="'price-' + item.id">{{ $t('create_research.detect_share.label') }}</label>
                <div class="input">
                  <i class="pi pi-tag"></i>
                  <input 
                    :id="'price-' + item.id"
                    type="text"
                    v-model="getContribution(item.id).reward"
                    :placeholder="$t('create_research.detect_share.placeholder')"
                  >
                </div>
                <small>{{ $t('create_research.detect_share.subtitle') }}</small>
              </div>

              <div class="input-wrap">
                <label :for="'group_numbers-' + item.id">{{ $t('create_research.detect_share.group_numbers.label') }}</label>
                <div class="input">
                  <i class="pi pi-users"></i>
                  <input 
                    :id="'group_numbers-' + item.id"
                    type="number"
                    v-model="getContribution(item.id).members_count"
                    :placeholder="$t('create_research.detect_share.group_numbers.placeholder')"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- إتاحة الفرص البحثية ؟؟ -->
      <div 
        class="show_research_control detect_share" 
        v-if="globalStore?.userType == 2"
      >
        <h6>{{ $t('create_research.show_research_control.title') }}</h6>
        <div class="input-wrap">
          <input 
            type="radio" 
            name="show_research_control" 
            id="all" 
            value="1"
            v-model="is_public"
          >
          <label for="all">
            {{ $t('create_research.show_research_control.all') }}
          </label>
        </div>
        <div class="input-wrap">
          <input 
            type="radio" 
            name="show_research_control" 
            id="specified" 
            value="0"
            v-model="is_public"
          >
          <label for="specified">
            {{ $t('create_research.show_research_control.specified') }}
          </label>
        </div>
      </div>
      <button class="main-btn" @click="handleSubmit">
        {{ $t('create_research.submit') }}
      </button>
    </div>
    <WaitingApprovePopup 
      v-if="showWaitingApprovePopup"
      :text="$t('create_research.waiting_approve_popup.text')"
      @handleShowWaitingApprovePopup="handleShowWaitingApprovePopup"
    />
  </section>
</template>

<script setup>
  import InputSwitch from 'primevue/inputswitch';

  // define global store
  const globalStore = useGlobalStore()

  // define i18n 
  const { t } = useI18n()

  // handle waiting approve popup
  const showWaitingApprovePopup = ref(false)
  const handleShowWaitingApprovePopup = () => {
    showWaitingApprovePopup.value = !showWaitingApprovePopup.value
  }


  // define api methods
  const {
    getMethod,
    getResult,
    submitMethod,
    showErrorToast
  } = useApiMethods()

  // define is research public
  const is_public = ref()

  // define body
  const body = ref({
    title:'',
    description:'',
    research_field_id:'',
    research_specialization_id:'',
    research_expectation_period:'',
    show_researcher:0,
    contributions:[]
  })


const isSelected = (id) => {
  return body.value.contributions.some(c => c.contribution_type_id === id)
}

const getContribution = (id) => {
  return body.value.contributions.find(c => c.contribution_type_id === id)
}

const toggleContribution = (item) => {
  if (isSelected(item.id)) {
    // Remove if already exists
    body.value.contributions = body.value.contributions.filter(
      c => c.contribution_type_id !== item.id
    )
  } else {
    // Add new contribution with empty values
    body.value.contributions.push({
      contribution_type_id: item.id,
      members_count: '',
      reward: ''
    })
  }
}


  // handle select scientific field  (المجال البحثي)
  const handleChangeScientificField = (scientificField) => {
    body.value.research_specialization_id = ''
    body.value.research_field_id = scientificField
  }


  // handle upload specialization fields (التخصص البحثي)
  const handleChangeSpecializationField = (newSpecialization) => {
    body.value.research_specialization_id = newSpecialization.id
  }


  // handle submit for create research
  const handleSubmit = () => {
    // if(!body.value.title){
    //   showErrorToast(t('create_research.validations.title.required'))
    // }
    if(!body.value.research_field_id){
      showErrorToast(t('create_research.validations.research_field_id.required'))
    }
    else if(!body.value.research_specialization_id){
      showErrorToast(t('create_research.validations.research_specialization_id.required'))
    }
    else if(!body.value.research_expectation_period){
      showErrorToast(t('create_research.validations.research_expectation_period.required'))
    }
    else if(!body.value.description){
      showErrorToast(t('create_research.validations.description.required'))
    }
    else if(globalStore?.userType == 2 && !is_public?.value){
      showErrorToast(t('create_research.validations.is_public.required'))
    }
    else{
      const researchFormData = new FormData();
      researchFormData.append('title', body.value.title);
      researchFormData.append('description', body.value.description);
      researchFormData.append('research_field_id', body.value.research_field_id);
      researchFormData.append('research_specialization_id', body.value.research_specialization_id);
      researchFormData.append('research_expectation_period', body.value.research_expectation_period);
      researchFormData.append('show_researcher', Number(body.value.show_researcher));
      researchFormData.append('contributions', JSON.stringify(body.value.contributions));
      if(globalStore.userType == 2) {
        researchFormData.append('is_public', Number(is_public.value));
      }
      submitMethod(
        'research-opportunities' , 
        true ,
        researchFormData ,
        'POST' , 
        '/researches'
      )
    }
  }

  onMounted(()=>{
    getMethod('contribution-types' , null , true , false)
  })
</script>

<style lang="scss" scoped>
  .control_user_visible{
    @include displayFlex($justify : space-between);
    margin-bottom: 20px;
    h4{
      font-size: 18px;
      font-weight: 600;
    }
    .user_visibility{
      @include displayFlex($justify : space-between);
      border-radius: 8px;
      background: $thirdColor;
      max-width: 45%;
      width: 100%;
      padding: 20px 15px;
      // flex-grow: 1;
      .text{
        h5{
          font-size: 16px;
          font-weight: 500;
          color: $mainColor;
          margin-bottom: 5px;
        }
        h6{
          font-size: 14px;
          font-weight: 400;
          color: $secColor;
        }
      }
    }
  }
  .checkbox_wrap{
    @include displayFlex($justify : flex-start , $gap : 8px);
    input{
      width: 20px;
    }
  }
  .detect_share{
    margin-top: 30px;
    h6{
      font-size: clamp(14px , 2.5vw , 20px);
      font-weight: 700;
      margin-bottom: 10px;
    }
    .inputs{
      flex-direction: column;
      margin: 10px 0 !important;
      .input-wrap{
        max-width: unset;
        width: 100%;
      }
    }
    label{
      font-weight: 400 !important;
    }
  }
  .show_research_control{
    .input-wrap{
      @include displayFlex($justify : flex-start , $gap : 8px);
      input{
        width: 18px;
      }
    }
  }
  .main-btn{
    max-width: 991px;
    margin: 20px auto 0;
  }
</style>
