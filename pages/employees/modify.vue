<template>
  <div class="page auth_page modify_page">
    <div class="header_page">
      <h3 class="title">
        {{ 
          globalStore.memberInfo?.action == 'edit' ? 
          $t('followers_page.edit_follower') :
          $t('followers_page.add_new_follower') 
        }}
      </h3>
    </div>
    <div class="form">
      <!--################# الصورة الشخصيه ###########################-->
      <label for="image" class="image_uploader" >
        <div class="image">
          <img v-if="body.image" :src="userImageChanged ? body.image[0].url : body.image" alt="image" loading="lazy">
          <i v-else class="pi pi-user"></i>
        </div>
        <i class="pi pi-upload"></i>
      </label>
      <input 
        type="file"
        id="image"
        hidden
        accept="image/*"
        @change="handleUploadUserImage"
      >
      <label for="image" class="image_label">
        {{ $t('register.image') }} 
        <span>({{ $t('register.optional') }})</span>
      </label>
      <div class="inputs">
        <!--################# الإسم ###########################-->
        <div class="input-wrap">
          <label for="name">{{ $t('register.name') }}</label>
          <div class="input">
            <i class="pi pi-user"></i>
            <input 
              type="text"
              id="name"
              :placeholder="$t('register.name')"
              v-model="body.name"
            >
          </div>
        </div>
        <!--################ رقم الجوال ####################-->
        <div class="input-wrap">
          <label for="phone">{{ $t('register.phone') }}</label>
          <div class="input">
            <i class="pi pi-phone"></i>
            <input 
              type="text"
              id="phone"
              :placeholder="$t('register.phone')"
              v-model="body.phone"
            >
          </div>
        </div>
      </div>
      <div class="inputs">
        <!--################# رقم الموظف ###########################-->
        <div 
          class="input-wrap"
        >
          <label for="employee_number">{{ $t('register.employee_number') }}</label>
          <div class="input">
            <div class="image">
              <img src="/assets/images/card.png" alt="image" loading="lazy">
            </div>
            <input 
              type="number"
              id="employee_number"
              :placeholder="$t('register.employee_number_placeholder')"
              v-model="body.employee_number">
          </div>
        </div>

        <!--################# المجال البحثي ###########################-->
        <div class="input-wrap">
          <label for="field">{{ $t('register.field') }}</label>
          <div class="input">
            <div class="image">
              <img src="/assets/images/book.svg" alt="image" loading="lazy">
            </div>
            <ScientificField 
              :research_field_id="body.research_field_id"
              @handleChangeScientificField="handleChangeScientificField"
            />
          </div>
        </div>
      </div>

      <div class="inputs mt-5 !mb-0">
        <!--############# صورة اللبطاقة #############-->
        <div class="input-wrap flex flex-col flex-grow-1">
          <label for="organization_image">{{ $t('register.organization_image') }}</label>
          <UploadImages
            id="card_image"
            fileType="all"
            :UploadedLocalFile="body.employee_card_image"
            @handleUploadImages="handleUploadCardFile"
            @handleRemoveImage="handleRemoveCardFile"
          />
        </div>
        <!--################### صورة الهوية ##########################-->
        <div class="input-wrap  flex flex-col flex-grow-1">
          <label for="identity_image">{{ $t('identity.image') }}</label>
          <UploadImages
            id="identity_image"
            :UploadedLocalFile="body.identity_image"
            @handleUploadImages="handleUploadIdentityImage"
            @handleRemoveImage="handleRemoveIdentityFile"
          />
        </div>
      </div>

      <div class="inputs">
        <!--################# البريد الإلكتروني ###########################-->
        <div class="input-wrap">
          <label for="email">{{ $t('register.email') }}</label>
          <div class="input">
            <i class="pi pi-envelope"></i>
            <input 
              id="email"
              type="text"
              :placeholder="$t('register.email')"  
              v-model="body.email"
            >
          </div>
        </div>

        <!--################# رقم الهوية ###########################-->
        <div class="input-wrap">
          <label for="identity_number">{{ $t('identity.input.label') }}</label>
          <div class="input">
            <div class="image">
              <img src="/assets/images/card.png" alt="image" loading="lazy">
            </div>
            <input 
              type="text"
              id="identity_number"
              :placeholder="$t('identity.input.placeholder')"
              v-model="body.identity_number">
          </div>
        </div>
      </div>

      <div class="inputs">
        <!--################# المنصب / الوظيفة ###########################-->
        <div class="input-wrap">
          <label for="job">{{ $t('register.job') }}</label>
          <div class="input">
            <i class="pi pi-book"></i>
            <input 
              id="job"
              type="text"
              :placeholder="$t('register.job')"
              v-model="body.job_title"
            >
          </div>
        </div>

        <!--################# المدن ###########################-->
        <Cities 
          :city_id="Number(body.city_id)"
          @handleCity="body.city_id = $event"
        />
      </div>

      <div class="inputs">
        <!--################# الخبرات ###########################-->
        <div class="input-wrap">
          <label for="exprtises">{{ $t('register.exprtises') }}</label>
          <div class="input textarea">
            <i class="pi pi-calculator"></i>
            <textarea 
              name="exprtises" 
              id="exprtises" 
              :placeholder="$t('register.exprtises')"
              v-model="body.experiences"
            />
          </div>
        </div>
        <!--################# الدورات التدريبية ###########################-->
        <div class="input-wrap">
          <label for="courses">{{ $t('register.courses') }}</label>
          <div class="input textarea">
            <i class="pi pi-calculator"></i>
            <textarea 
              name="courses" 
              id="courses" 
              :placeholder="$t('register.courses')"
              v-model="body.courses"
            />
          </div>
        </div>
      </div>

      <div class="inputs">
        <!-- عدد الأبحاث المشارك بها -->
        <div class="input-wrap">
          <label for="shared_researches">{{ $t('register.shared_researches') }}</label>
          <div class="input">
            <i class="pi pi-book"></i>
            <input 
              type="number"
              id="shared_researches"
              :placeholder="$t('register.shared_researches')"
              v-model="body.published_researches_number"
            >
          </div>
        </div>
        <!-- المؤهل العلمي -->
        <div class="input-wrap">
          <label for="scientific_field">{{ $t('register.scientific_field') }}</label>
          <div class="input">
            <i class="pi pi-book"></i>
            <input 
              type="text"
              name="scientific_field" 
              id="scientific_field"
              :placeholder="$t('register.scientific_field')"
              v-model="body.educational_qualification"
            >
          </div>
        </div>
      </div>

      <div class="inputs">
        <!--################# التخصصات البحثيه ###########################-->
        <div 
          class="input-wrap specializations" 
          v-if="body.research_field_id"
          :style="{
            marginBottom: body.research_specialization_ids.length > 0 ? '50px' : '0'
          }"
        >
          <label for="specializations">{{ $t('register.specializations') }}</label>
          <div class="input multiselect_input">
            <div class="image">
              <img src="/assets/images/book.svg" alt="image" loading="lazy">
            </div>
            <MulitSelectFields
              v-if="body.research_field_id"
              endPoint="research-fields/specializations"
              :research_field_id = "body.research_field_id"
              :specializations="body.research_specialization_ids"
              @handleSpecializations="handleSpecializationFields"
            />
          </div>
        </div>
        <!-- عدد الابحاث المشارك بها مسبقا -->
        <div class="input-wrap">
          <label for="part_researches">{{ $t('register.part_researches') }} <span>({{ $t('register.optional') }})</span></label>
          <div class="input">
            <i class="pi pi-clipboard"></i>
            <input 
              type="number"
              id="part_researches"
              :placeholder="$t('register.part_researches')"
              v-model="body.participated_researches_number"
            >
          </div>
        </div>
      </div>
      <button class="main-btn" @click="handleSubmit" :style="body.research_specialization_ids.length > 0 ? 'margin-top: 80px;' : 'margin-top: 20px;'">
        {{ $t('register.next') }}
      </button>
    </div>
    <SuccessPopup 
      v-if="showSuccessPopup"
      :successText="globalStore.lang == 'ar' ? 'تم إضافة العضو بـنجاح' : 'Member added successfully'"
      @handleShowSuccessPopup = "handleShowSuccessPopup"
    />
  </div>
</template>

<script setup>
  // define global store
  const globalStore = useGlobalStore()

  // define i18n
  const {t} = useI18n()

  // define body
  const body = ref({
    image : null,
    name: '',
    phone:'',
    employee_number:'',
    identity_number:'',
    city_id:'',
    email:'',
    educational_qualification:'',
    job_title:'',
    experiences:'',
    courses:'',
    research_specialization_ids:[],
    published_researches_number:'',
    participated_researches_number:'',
    identity_image: null,
    employee_card_image:null,
  })

  // define api methods
  const {
    getMethod,
    getResult,
    submitMethod,
    submitResult,
    showErrorToast
  } = useApiMethods()


  // define success popup
  const showSuccessPopup = ref(false)
  const handleShowSuccessPopup = () => {
    showSuccessPopup.value = !showSuccessPopup.value
  }

  // handle upload user image (رفع الصورة الشخصيه)
  const userImageChanged = ref(false)
  const handleUploadUserImage = (event) => {
    userImageChanged.value = true
    const file = event.target.files[0];
    if (file && file?.type?.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      body.value.image = [{
        url: imageUrl,
        file: file,
        type: file.type
      }];
    } else {
      showErrorToast(globalStore.lang == 'ar' ? 'يجب ان يكون الملف من نوع صورة' : 'The file must be an image type');
    }
  }


  // handle upload identity image (رفع بطاقة المنظمه)
  const employee_card_image_changed = ref(false)
  const handleUploadCardFile = (event) => {
    employee_card_image_changed.value = true
    const file = event[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      body.value.employee_card_image = [{
        url: imageUrl,
        file: file,
        type: file.type
      }];
    } 
    // else {
    //   showErrorToast(globalStore.lang == 'ar' ? 'يجب ان يكون الملف من نوع pdf' : 'The file must be a PDF type');
    // }
  }

  const handleRemoveCardFile = () => {
    body.value.employee_card_image = null;
  }

  // handle upload identity image (رفع صورة الهوية)
  const identity_image_changed = ref(false)
  const handleUploadIdentityImage = (event) => {
    identity_image_changed.value = true
    const file = event[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      body.value.identity_image = [{
        url: imageUrl,
        file: file,
        type: file.type
      }];
    } else {
      showErrorToast(globalStore.lang == 'ar' ? 'يجب ان يكون الملف من نوع صورة' : 'The file must be an image type');
    }
  }

  const handleRemoveIdentityFile = () => {
    body.value.identity_image = null;
  }


  
  // handle select scientific field  (المجال البحثي)
  const handleChangeScientificField = (scientificField) => {
    body.value.research_specialization_ids = []
    body.value.research_field_id = scientificField
  }

  // handle upload specialization fields (التخصصات البحثيه لـ المجال البحثي)
  const handleSpecializationFields = (newSpecializations) => {
    body.value.research_specialization_ids = newSpecializations
  }


  // handle submit 
  const handleSubmit = () => {
    // Validation checks
    // if (!body.value.image) {
    //   showErrorToast(t('validations.register.user_image'));
    //   return;
    // }
    if (!body.value.name) {
      showErrorToast(t('validations.register.name'));
      return;
    }
    else if (body.value.name.length < 2) {
      showErrorToast(t('validations.register.name_length'));
      return;
    }
    else if (!body.value.phone) {
      showErrorToast(t('validations.register.phone'));
      return;
    }
    else if (body.value.phone.length < 9 ) {
      showErrorToast(t('validations.register.phone_length'));
      return;
    }
    else if (!body.value.employee_number) {
      showErrorToast(t('validations.register.employee_number'));
      return;
    }
    else if (!body.value.employee_card_image) {
      showErrorToast(t('validations.register.employee_card_image'));
      return;
    }
    else if (!body.value.identity_image) {
      showErrorToast(t('validations.register.user_image'));
      return;
    }
    else if (!body.value.identity_number) {
      showErrorToast(t('validations.register.identity_number'));
      return;
    }
    else if (!body.value.city_id) {
      showErrorToast(t('validations.register.city'));
      return;
    }
    else if (!body.value.email) {
      showErrorToast(t('validations.register.email'));
      return;
    }
    else if (!body.value.educational_qualification) {
      showErrorToast(t('validations.register.scientific_field'));
      return;
    }
    else if (!body.value.job_title) {
      showErrorToast(t('validations.register.job'));
      return;
    }
    else if (!body.value.experiences) {
      showErrorToast(t('validations.register.exprtises'));
      return;
    }
    else if (!body.value.courses) {
      showErrorToast(t('validations.register.courses'));
      return;
    }
    else if (!body.value.research_field_id) {
      showErrorToast(t('validations.register.field'));
      return;
    }
    else if (body.value.research_specialization_ids.length == 0) {
      showErrorToast(t('validations.register.specializations'));
      return;
    }
    else if (!body.value.published_researches_number) {
      showErrorToast(t('validations.register.shared_researches'));
      return;
    }
    else {
      const employeeData = new FormData();
      employeeData.append('lang', globalStore.lang);
      if (userImageChanged?.value) {
        employeeData.append('image', body.value.image[0].file);
      }
      if(employee_card_image_changed?.value){
        employeeData.append('employee_card_image', body.value.employee_card_image[0].file);
      }
      if(identity_image_changed?.value){
        employeeData.append('identity_image', body.value.identity_image[0].file);
      }
      employeeData.append('name', body.value.name);
      employeeData.append('email', body.value.email);
      employeeData.append('employee_number', body.value.employee_number);
      employeeData.append('city_id', body.value.city_id);
      employeeData.append('phone', body.value.phone);
      employeeData.append('educational_qualification', body.value.educational_qualification);
      employeeData.append('identity_number', body.value.identity_number ?? globalStore.identity_number);
      employeeData.append('job_title', body.value.job_title);
      employeeData.append('published_researches_number', body.value.published_researches_number);
      employeeData.append('participated_researches_number', body.value.participated_researches_number);
      employeeData.append('experiences', body.value.experiences);
      employeeData.append('courses', body.value.courses);
      employeeData.append('research_field_id', body.value.research_field_id);
      body.value.research_specialization_ids.forEach((specialization, index) => {
        employeeData.append(`research_specialization_ids[${index}]`, specialization.id);
      });
    
      submitMethod(
        `${globalStore.memberInfo.action == 'edit' ? 'update' : 'add'}-employee${globalStore.memberInfo.action == 'edit' ? `/${globalStore.memberInfo.id}?_method=patch` : ''}`, true , employeeData, 'POST', '');
    }
  }

  watchEffect(()=>{
    if(getResult?.value){
      if (getResult?.value?.image) {
        body.value.image=  getResult?.value?.image
      }
      body.value.name = getResult?.value?.name
      body.value.email = getResult?.value?.email
      body.value.phone = getResult?.value?.phone
      body.value.employee_number = getResult?.value?.employee_number
      body.value.identity_number = getResult?.value?.identity_number
      body.value.city_id = getResult?.value?.city?.id
      body.value.educational_qualification = getResult?.value?.educational_qualification
      body.value.job_title = getResult?.value?.job_title
      body.value.published_researches_number = getResult?.value?.published_researches_number
      body.value.participated_researches_number = getResult?.value?.participated_researches_number
      body.value.experiences = getResult?.value?.experiences
      body.value.courses = getResult?.value?.courses
      body.value.research_field_id = getResult?.value?.research_field_id
      body.value.research_specialization_ids = getResult?.value?.research_specializations
      body.value.image = getResult?.value?.image
      body.value.identity_image = getResult?.value?.identity_image
      body.value.employee_card_image = getResult?.value?.employee_card_image
    }
    if(globalStore.memberInfo.action == 'add' && submitResult?.value?.data?.key == 'success'){
      handleShowSuccessPopup()
    }
  })

  onMounted(()=>{
    if(globalStore.memberInfo.id){
      getMethod(`employee-details?employee_id=${globalStore.memberInfo.id}` , null , true , false)
    }
  })
</script>

<style lang="scss" scoped>
  .auth_page{
    margin: 0;
    padding-block:60px 30px;
    background-color: transparent;
    max-width: unset;
    height: unset;
    .image_uploader{
      border-color: rgba($color: $secColor, $alpha: 0.4);
      .image{
        img{
          width: 60px;
          height:60px;
          border-radius: 50%;
          overflow: hidden;
          object-fit: contain !important;
        }
      }
    }

  }

  .row_input{
    @include displayFlex($justify : flex-start , $gap : 8px);
    input{
      width: 20px;
    }
  }
  .m-b-20{
    margin-bottom: 20px;
  }
  .multiselect_input{
    background:transparent !important;
  }
  h6{
    background: $secColor  !important;
  }

  .input.card.flex.justify-center.w-full{
    border: none;
    padding: 0 !important;
    height: 30px !important;
    margin-bottom: 0 !important;
  }



  .local_images{
    margin: 0 0 20px !important;
  }
</style>