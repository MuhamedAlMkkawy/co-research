<template>
  <div>
    <section class="auth_page page" >
      <div class="header_page">
        <h3 class="title">
          {{ $t('profile_page.edit') }}
        </h3>
      </div>
      <div class="form">
        <!--################# الصورة الشخصيه ###########################-->
        <label for="image" class="image_uploader" >
          <div :class="['image' , {preview_image : localImage}]">
            <img v-if="localImage" :src="localImage" alt="image" loading="lazy">
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
        <label for="image" class="image_label" v-if="globalStore.userType != 2">
          {{ $t('register.image') }} 
        </label>
        <label for="image" class="image_label" v-else>
          {{ $t('register.logo') }} 
        </label>
        <div class="inputs">
          <!--################# الإسم ###########################-->
          <div class="input-wrap" :style="globalStore.userType == 2 ? 'flex-grow: 1;' : ''" >
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
          <!--################# المدن ###########################-->
          <Cities 
            v-if="globalStore.userType != 2"
            :city_id="Number(body.city_id)"
            @handleCity="body.city_id = $event"
          />
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
          <!--################# المدن ###########################-->
          <Cities 
            v-if="globalStore.userType == 2"
            :city_id="Number(body.city_id)"
            @handleCity="body.city_id = $event"
          />
          <!-- ########## ف حالة منظمة بحثية رقم الجوال ####################
          <div class="input-wrap" v-if="globalStore.userType == 2">
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
          </div> -->
          <!--################# المؤهل العلمي ###########################-->
          <div class="input-wrap" v-if="globalStore.userType != 2">
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
        <!-- البيانات الخاصه بالمنظمه فقط -->
        <div class="inputs" v-if="globalStore.userType == 2">
          <!--######### ماتقدمة المنظمة #########-->
          <div class="input-wrap" style="flex-grow: 1;">
            <label for="about_organization">
              {{ $t('register.about_organization') }}
            </label>
            <div class="input textarea">
              <label for="about_organization">
                <i class="pi pi-clipboard"></i>
              </label>
              <textarea 
                name="about_organization" 
                id="about_organization"
                :placeholder="$t('register.about_organization')"
                v-model="body.about_organization"
              />
            </div>
          </div>
        </div>
        <!-- رقم السجل التجاري -->
        <div class="input-wrap" style="flex-grow: 1;" v-if="globalStore.userType == 2">
          <!-- رقم السجل التجاري -->
          <label for="commercial_number">
            {{ $t('register.commercial_number') }}
          </label>
          <div class="input">
            <div class="image">
              <img src="/assets/images/card.png" alt="image" loading="lazy">
            </div>
            <input 
              id="commercial_number"
              type="text"
              :placeholder="$t('register.commercial_number')"
              v-model="body.commercial_number"
            >
          </div>
        </div>

        <!-- البيانات الخاصه بغير المنظمه -->
        <div class="inputs" v-if="globalStore.userType != 2">
          <!--################# عدد الأبحاث المنشورة ###########################-->
          <div class="input-wrap">
            <label for="shared_researches">{{ $t('register.shared_researches') }}</label>
            <div class="input">
              <i class="pi pi-book"></i>
              <input 
                type="text"
                id="shared_researches"
                :placeholder="$t('register.shared_researches')"
                v-model="body.published_researches_number"
              >
            </div>
          </div>
          <!--################# عدد الأبحاث المشارك بها مسبقا ###########################-->
          <div class="input-wrap">
            <label for="part_researches">{{ $t('register.part_researches') }} <span>({{ $t('register.optional') }})</span></label>
            <div class="input">
              <i class="pi pi-clipboard"></i>
              <input 
                type="text"
                id="part_researches"
                :placeholder="$t('register.part_researches')"
                v-model="body.participated_researches_number"
              >
            </div>
          </div>
        </div>

        <!-- صورة السجل التجاري
        <div class="input-wrap" v-if="globalStore.userType == 2">
          <label for="commercial_image">
            {{ $t('register.commercial_image') }}
          </label>
          <UploadImages
            id="commercial_image"
            :UploadedLocalFile="localCommercialImage"
            @handleUploadImages="handleUploadCommercialImage"
            @handleRemoveImage="handleRemoveCommercialFile"
          />
        </div> -->
        <div class="inputs" v-if="globalStore.userType != 2">
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
        <div class="inputs column-inputs mt-10">
          <!--################# المجال البحثي ###########################-->
          <div 
            class="input-wrap"  
            :style="body.research_field_id ? '' : 'flex-grow: 1'"
            v-if="globalStore.userType != 2"
            >
            <label for="field">{{ $t('register.field') }}</label>
            <div class="input">
              <div class="image">
                <img src="/assets/images/book.svg" alt="image" loading="lazy">
              </div>
              <ScientificField 
                :research_field_id="Number(body.research_field_id)"
                @handleChangeScientificField="handleChangeScientificField"
              />
            </div>
          </div>
          <!-- ############## المجالات البحثية ############################ -->
          <div class="input-wrap specializations" v-if="globalStore.userType == 2">
            <label for="research_fields">
              {{ $t('register.research_fields') }}
            </label>
            <div class="input multiselect_input">
              <div class="image">
                <img src="/assets/images/book.svg" alt="image" loading="lazy">
              </div>
                <MulitSelectFields 
                  :endPoint="'research-fields'"
                  :specializations="body.research_field_ids"
                  @handleSpecializations="body.research_field_ids = $event"
                />
            </div>
          </div>
          <!--################# التخصصات البحثيه ###########################-->
          <div class="input-wrap specializations" v-if="body.research_field_id">
            <label for="specializations">{{ $t('register.specializations') }}</label>
            <div class="input multiselect_input">
              <div class="image">
                <img src="/assets/images/book.svg" alt="image" loading="lazy">
              </div>
              <MulitSelectFields
                v-if="body.research_field_id"
                :research_field_ids = "body.research_field_ids"
                :specializations="body.research_specialization_ids"
                endPoint="research-fields/specializations"
                @handleSpecializations="handleSpecializationFields"
              />
            </div>
          </div>
        </div>
        <div class="inputs" v-if="globalStore.userType == 1">
          <!--################# المنظمه التابعه لها ###########################-->
          <div class="input-wrap" v-if="body.research_field_id">
            <label for="organization">{{ $t('register.organization') }}</label>
            <Organizations 
              v-if="body.research_field_id"
              :research_field_id = "body.research_field_id"
              @handleOrganization="body.organization_id = $event"
            />
          </div>
          <!--################# رقم الهوية ###########################-->
          <div class="input-wrap":style="body.research_field_id ? '' : 'flex-grow: 1'">
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
        <!--################### صورة الهوية ##########################-->
        <div class="input-wrap" v-if="globalStore.userType == 1">
          <label for="identity_image">{{ $t('identity.image') }}</label>
        </div>
        <UploadImages
          v-if="globalStore.userType == 1"
          id="identity_image"
          :UploadedLocalFile="localIdentityImage"
          @handleUploadImages="handleUploadIdentityImage"
          @handleRemoveImage="handleRemoveIdentityFile"
        />
        <!--################# رقم الموظف ###########################-->
        <div 
          class="input-wrap"  
          v-if="globalStore.userType == 1" 
          style="flex-grow: 1;margin-block: 10px;"
        >
          <label for="employee_number">{{ $t('register.employee_number') }}</label>
          <div class="input">
            <div class="image">
              <img src="/assets/images/card.png" alt="image" loading="lazy">
            </div>
            <input 
              type="text"
              id="employee_number"
              :placeholder="$t('register.employee_number_placeholder')"
              v-model="body.employee_number">
          </div>
        </div>
        <!--############# البطاقة الخاصه بـ المنظمه #############-->
        <div class="input-wrap" v-if="globalStore.userType == 1">
          <label for="organization_image">{{ $t('register.organization_image') }}</label>
        </div>
        <UploadImages
          v-if="globalStore.userType == 1"
          id="organization_image"
          :UploadedLocalFile="localOrganizationImage"
          @handleUploadImages="handleUploadOrganizationImage"
          @handleRemoveImage="handleRemoveOrganizationFile"
        />
        <div class="inputs"  v-if="globalStore.userType != 2">
          <!-- ################# رقم الجوال ###########################
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
          </div> -->
          <!--################# المنصب / الوظيفة ###########################-->
          <div class="input-wrap" style="flex-grow: 1;">
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
        </div>
        <div class="inputs" v-if="globalStore.userType == 2">
          <!-- إسم البنك -->
          <div class="input-wrap">
            <label for="bank_name">{{ $t('register.bank_name') }}</label>
            <div class="input">
              <i class="pi pi-building-columns"></i>
              <input
                id="bank_name"
                type="text"
                :placeholder="$t('register.bank_name')"
                v-model="body.bank_name"
              >
            </div>
          </div>
          <!-- اسم صاحب الحساب -->
          <div class="input-wrap">
            <label for="bank_account_name">{{ $t('register.bank_account_name') }}</label>
            <div class="input">
              <div class="image">
                <img src="/assets/images/user-square.png" alt="image" loading="lazy">
              </div>
              <input
                id="bank_account_name"
                type="text"
                :placeholder="$t('register.bank_account_name')"
                v-model="body.bank_account_name"
              >
            </div>
          </div>
        </div>
        <div class="inputs" v-if="globalStore.userType == 2">
          <!-- رقم الحساب -->
          <div class="input-wrap">
            <label for="bank_account_number">{{ $t('register.bank_account_number') }}</label>
            <div class="input">
              <i class="pi pi-credit-card"></i>
              <input
                id="bank_account_number"
                type="text"
                :placeholder="$t('register.bank_account_number')"
                v-model="body.bank_account_number"
              >
            </div>
          </div>
          <!-- رقم الآيبان -->
          <div class="input-wrap">
            <label for="bank_iban_number">{{ $t('register.bank_iban_number') }}</label>
            <div class="input">
              <i class="pi pi-credit-card"></i>
              <input
                id="bank_iban_number"
                type="text"
                :placeholder="$t('register.bank_iban_number')"
                v-model="body.bank_iban_number"
              >
            </div>
          </div>
        </div>
        <!--#####################################################################-->
        <!--################# إضافة أبحاث مشارك بها ###########################-->
        <!--#####################################################################-->
        <div class="header_page participated_header">
          <label class="m-b-20" v-if="globalStore.userType != 2">
            {{ globalStore.lang == 'ar' ? 'الأبحاث المشارك بها' : 'Participated Researches' }} 
          </label>
          <NuxtLink 
            class="main-btn sec_btn reversed" 
            :to="$localeRoute('add_research')"
            v-if="globalStore.userType != 2"
            >
            <i class="pi pi-plus"></i>
          </NuxtLink>
        </div>
        <!--###################### عرض ملفات البحث ##############################-->
        <ol 
          class="local_research" 
          v-for="(item, index) in (body?.deleted_participated_researches?.length > 0 ? body?.participated_researches?.filter(i => !body.deleted_participated_researches.includes(i?.id)) : body.participated_researches)"
          :key="index"
          v-if="globalStore.userType != 2"
          >
          <button class="main-btn danger" @click="handleRemoveResearch(item?.id)">
            <i class="pi pi-times"></i>
          </button>
          <li>
            {{ $t('register.research_type') }} 
            <span>
              {{ 
                item.research_field_type == 0 ? 
                $t('register.individual_research') : 
                $t('register.shared_research') 
              }}
            </span>
          </li>
          <li>
            {{ $t('register.research_title') }}
            <span>{{ item.name }}</span>
          </li>
          <li>
            {{ $t('register.research_field_title') }}
            <span>{{ item.research_field_id }}</span>
          </li>
          <li v-if="item.research_specialization_ids.length > 0">
            {{ $t('register.research_specializations_title') }}
            <span 
              v-for="specialization in item?.research_specialization_ids" 
              :key="specialization"
            >
              <small>
                {{ specialization?.name }}
              </small>
            </span>
          </li>
          <div class="local_images" v-if="item.research_file" :style="{ marginBottom: '30px' }">
            <div class="image">
              <template v-if="item.research_file?.endsWith('pdf')">
                <NuxtLink :to="image" class="image pdf_image" target="_blank">
                  <img src="/assets/images/pdf.png" alt="pdf" loading="lazy">
                </NuxtLink>
              </template>
              <template v-else>
                <div class="image">
                  <img :src="image" alt="image" loading="lazy">
                </div>
              </template>
            </div>
          </div>
        </ol>
        <!--###################### عرض ملفات البحث المضافة حديثا ##############################-->
        <ol 
          class="local_research" 
          v-for="(item, index) in globalStore.submittedLocalResearches" 
          :key="index"
          v-if="globalStore.userType != 2"
          >
          <!-- {{ console.table(submittedResearches) }} -->
          <button class="main-btn danger" @click="globalStore.submittedLocalResearches.splice(index, 1)">
            <i class="pi pi-times"></i>
          </button>
          <li>
            {{ $t('register.research_type') }} 
            <span>
              {{ 
                item.research_field_type == 0 ? 
                $t('register.individual_research') : 
                $t('register.shared_research') 
              }}
            </span>
          </li>
          <li>
            {{ $t('register.research_title') }}
            <span>{{ item.name }}</span>
          </li>
          <li>
            {{ $t('register.research_field_title') }}
            <span>{{ item.research_field_id }}</span>
          </li>
          <li v-if="item.research_specialization_ids.length > 0">
            {{ $t('register.research_specializations_title') }}
            <span 
              v-for="specialization in item?.research_specialization_ids" 
              :key="specialization"
            >
              <small>
                {{ specialization?.name }}
              </small>
            </span>
          </li>
          <div class="local_images" v-if="item.research_files.length > 0" :style="{ marginBottom: '30px' }">
            <div class="image" v-for="image in item.research_files" :key="image">
              <template v-if="image.type.endsWith('pdf')">
                <NuxtLink :to="image.url" class="image pdf_image" target="_blank">
                  <img src="/assets/images/pdf.png" alt="pdf" loading="lazy">
                </NuxtLink>
              </template>
              <template v-else>
                <div class="image">
                  <img :src="image.url" alt="image" loading="lazy">
                </div>
              </template>
            </div>
          </div>
        </ol>
      </div>
    </section>
    <button 
      class="main-btn submit_btn " 
      @click="handleSubmit"
    >
      {{ $t('profile_page.edit_btn') }}
    </button>
    <SuccessPopup 
      v-if="submitResult?.data?.key == 'success'"
      :successText="submitResult?.data?.msg"
    />
    <Loading v-if="globalStore?.loading" />
  </div>
</template>



<script setup>
 // define i18n
  const { t } = useI18n()


  
  // define api methods
  const {
    getMethod,
    getResult,
    submitMethod,
    submitResult
  } = useApiMethods()
  
  // define toast msg
  const {
    showErrorToast
  } = useToastMsg()
  
  // define global store
  const globalStore = useGlobalStore()


  // define body
  const body = ref({
    user_type : globalStore.userType,
    image : "",
    name: "",
    // phone: "",
    email: "",
    lang: globalStore.lang,
    city_id: '',
    commercial_number: "",
    commercial_number_image: "",
    about_organization: "",
    bank_name: "",
    bank_account_name: "",
    bank_account_number: "",
    bank_iban_number: "",
    organization_id: '',
    identity_number: "",
    employee_card_image : "",
    employee_number: "",
    organization_image: "",
    educational_qualification: "",
    job_title: "",
    published_researches_number: '',
    participated_researches_number : "",
    experiences: "",
    courses: "",
    research_field_id: '',
    research_field_ids: [],
    research_specialization_ids:[],
    participated_researches: [
      {
        id : '',
        research_field_id: '',
        research_specialization_ids: [],
        name: "",
        research_field_type: '',
        research_files : []
      }
    ],
    deleted_participated_researches : []
  })

  // handle upload user image
  const localImage = ref()
  const userImageChanged = ref(false)
  const handleUploadUserImage = (event) => {
    userImageChanged.value = true
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    localImage.value = URL.createObjectURL(file)
    body.value.image = file
  }

  // handle upload submitted reseaches
  const submittedResearches = ref([]);

  // handle upload identity image (رفع صورة الهوية)
  const localIdentityImage = ref()
  const handleUploadIdentityImage = (uploadedFiles, index) => {
    const file = uploadedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      localIdentityImage.value = [{
        url: imageUrl,
        file: file,
        type: file.type
      }];
      // to upload the file to the server
      body.value.employee_card_image = localIdentityImage
    }
  }

  const handleRemoveIdentityFile = () => {
    body.value.employee_card_image = [];
  }

  // handle upload commercial image (رفع صورة السجل التجاري)
  const localCommercialImage = ref()
  const userCommercialImageChanged = ref(false)
  const handleUploadCommercialImage = (uploadedFiles, index) => {
    userCommercialImageChanged.value = true
    const file = uploadedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      localCommercialImage.value = [{
        url: imageUrl,
        file: file,
        type: file.type
      }];
      // to upload the file to the server
      body.value.commercial_number_image = localCommercialImage
    }
  }

  const handleRemoveCommercialFile = () => {
    body.value.commercial_number_image = [];
  }


  // handle upload identity image (رفع بطاقة المنظمه)
  const localOrganizationImage = ref()
  const userOrganizationImageChanged = ref(false)
  const handleUploadOrganizationImage = (uploadedFiles, index) => {
    userOrganizationImageChanged.value = true
    const file = uploadedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      localOrganizationImage.value = [{
        url: imageUrl,
        file: file,
        type: file.type
      }];
      // to upload the file to the server
      body.value.organization_image = localOrganizationImage
    }
  }

  const handleRemoveOrganizationFile = () => {
    body.value.organization_image = [];
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


  // control upload and remove researches in local ( التحكم فـ الأبحاث المشارك بها محليا )
  const handleRemoveResearch = (item) => {
    if (!body.value.deleted_participated_researches) {
      body.value.deleted_participated_researches = []
    }
    body.value.deleted_participated_researches = [...body.value.deleted_participated_researches , item]
  }


  const handleSubmit = () => {
    // Validate common fields for all user types
    if (!body.value.name) {
      showErrorToast(t('validations.register.name'));
      return;
    } else if (body.value.name.length < 2) {
      showErrorToast(t('validations.register.name_length'));
      return;
    } else if (!body.value.city_id) {
      showErrorToast(t('validations.register.city'));
      return;
    } else if (!body.value.email) {
      showErrorToast(t('validations.register.email_required'));
      return;
    }

    // Validate fields for non-type-2 users
    if (globalStore.userType != 2) {
      if (!body.value.published_researches_number) {
        showErrorToast(t('validations.register.shared_researches'));
        return;
      } else if (!body.value.experiences) {
        showErrorToast(t('validations.register.exprtises'));
        return;
      } else if (!body.value.courses) {
        showErrorToast(t('validations.register.courses'));
        return;
      } else if (!body.value.research_field_id) {
        showErrorToast(t('validations.register.field'));
        return;
      } else if (body.value.research_specialization_ids.length == 0) {
        showErrorToast(t('validations.register.specializations'));
        return;
      }
      //  else if (!body.value.phone) {
      //   showErrorToast(t('validations.register.phone'));
      //   return;
      // } else if (body.value.phone.length < 9) {
      //   showErrorToast(t('validations.register.phone_length'));
      //   return;
      // } 
      else if (!body.value.job_title) {
        showErrorToast(t('validations.register.job'));
        return;
      }else if(body.value.participated_researches.length == 0 && globalStore.submittedLocalResearches.length == 0) {
        showErrorToast(t('validations.register.participated_researches'));
        return;
      }
    }

    // Validate fields for organizations
    if (globalStore.userType == 2) {
      if (!body.value.about_organization) {
        showErrorToast(t('validations.register.about_organization'));
        return;
      } else if (!body.value.commercial_number) {
        showErrorToast(t('validations.register.commercial_number'));
        return;
      } else if (body.value.commercial_number.toString().length != 10) {
        showErrorToast(t('validations.register.commercial_number_length'));
        return;
      } else if (body.value.research_field_ids.length == 0) {
        showErrorToast(t('validations.register.research_fields'));
        return;
      } else if (body.value.research_specialization_ids.length == 0) {
        showErrorToast(t('validations.register.research_specializations'));
        return;
      }
      // else if (!body.value.commercial_number_image) {
      //   showErrorToast(t('validations.register.commercial_image'));
      //   return;
      // }
    }

    // If all validations pass, proceed with form submission
    // globalStore.setUserPhone(body.value.phone);
    const registerData = new FormData();
    registerData.append('user_type', body.value.user_type);
    registerData.append('lang', body.value.lang);
    
    if (body.value.image && userImageChanged.value) {
      registerData.append('image', body.value.image);
    }
    
    registerData.append('name', body.value.name);
    registerData.append('email', body.value.email);
    registerData.append('device_id', globalStore.device_id);
    registerData.append('device_type', 'web');
    registerData.append('city_id', body.value.city_id);
    // registerData.append('phone', body.value.phone);
    registerData.append('educational_qualification', body.value.educational_qualification);
    registerData.append('identity_number', body.value.identity_number ?? globalStore.identity_number);
    
    if (globalStore.userType != 2) {
      registerData.append('job_title', body.value.job_title);
      registerData.append('published_researches_number', body.value.published_researches_number);
      registerData.append('participated_researches_number', body.value.participated_researches_number);
      registerData.append('experiences', body.value.experiences);
      registerData.append('courses', body.value.courses);
      registerData.append('research_field_ids[]', body.value.research_field_id);
      
      globalStore.submittedLocalResearches.forEach((research, index) => {
        registerData.append(`researches[${index}][research_field_id]`, research.research_field_id);
        research.research_specialization_ids.forEach((specialization, specializationIndex) => {
          registerData.append(`researches[${index}][research_specialization_ids][${specializationIndex}]`, specialization.id);
        });
        registerData.append(`researches[${index}][name]`, research.name);
        registerData.append(`researches[${index}][research_type]`, research.research_field_type);
        if (research.research_files.length > 0) {
          const file = research.research_files[0];
          registerData.append(`researches[${index}][research_file]`, file.file);
        }
      });

      if (body.value.deleted_participated_researches) {
        registerData.append('deleted_participated_researches', JSON.stringify(body.value.deleted_participated_researches));
      }
    }

    body.value.research_specialization_ids.forEach((specialization, index) => {
      registerData.append(`research_specialization_ids[${index}]`, specialization.id);
    });

    if (globalStore.userType == 1) {
      registerData.append('organization_id', body.value.organization_id);
      registerData.append('organization_image', body.value?.organization_image[0]?.file);
    }

    if (globalStore.userType == 2) {
      body.value.research_field_ids.forEach((field, index) => {
        registerData.append(`research_field_ids[${index}]`, field.id);
      });
      
      if (body.value.commercial_number_image && userCommercialImageChanged.value) {
        registerData.append('commercial_number_image', body.value.commercial_number_image[0].file);
      }
      
      registerData.append('commercial_number', body.value.commercial_number);
      registerData.append('about_organization', body.value.about_organization);
      registerData.append('bank_name', body.value.bank_name);
      registerData.append('bank_account_name', body.value.bank_account_name);
      registerData.append('bank_account_number', body.value.bank_account_number);
      registerData.append('bank_iban_number', body.value.bank_iban_number);
    }

    submitMethod('update-profile?_method=put', true, registerData, 'POST', '');
  };

  watch(()=> getResult?.value , (newValue) => {
    const result = newValue;
    localImage.value =  result.image || "",
    body.value = {
      user_type: result.user_type || globalStore.userType,
      image: result.image || "",
      name: result.name || "",
      // phone: result.phone || "",
      email: result.email || "",
      lang: result.lang || globalStore.lang,
      city_id: result.city_id, 
      commercial_number: result.commercial_number || "",
      commercial_number_image: "",
      about_organization: result.about_organization || "",
      bank_name: result.bank_name || "",
      bank_account_name: result.bank_account_name || "",
      bank_account_number: result.bank_account_number || "",
      bank_iban_number: result.bank_iban_number || "",
      organization_id: result.organization_id,
      identity_number: result.identity_number || "",
      employee_card_image: result.employee_card_image || "",
      employee_number: result.employee_number,
      organization_image: result.organization_image,
      educational_qualification: result.educational_qualification || "",
      job_title: result.job_title || "",
      published_researches_number: result.published_researches_number || "",
      participated_researches_number: result.participated_researches_number || "",
      experiences: result.experiences || "",
      courses: result.courses || "",
      research_field_id: result.research_fields[0]?.id || '',
      research_field_ids: globalStore.userType == 2 ? result.research_fields?.map(field => field) || [] : [],
      research_specialization_ids: result.research_specializations?.map(spec => spec) || [],
      participated_researches :  result.participated_researches?.map(research => ({
        id : research.id,
        research_field_id: research.research_field, // You might need to map this from research_field
        research_specialization_ids: research.specializations || [],
        name: research.name || "",
        research_field_type: research.research_type || '',
        research_files: [research.research_file] || []
      })) || [{
        id: '',
        research_field_id: '',
        research_specialization_ids: [],
        name: "",
        research_field_type: '',
        research_files: []
      }]
    };
  })

  watchEffect(() => {
    if(submitResult?.value?.data?.key == 'success'){
      globalStore.submittedLocalResearches = [];
    }
  });

  onMounted(()=>{
    getMethod('profile' , null , true , false)
  })
</script>

<style lang="scss" scoped>
  .auth_page{
    margin: 0;
    padding-block:60px 30px;
    background-color: transparent;
    max-width: unset;
    height: unset;


    .column_inputs{
      width: 45%;
      label:not(:first-of-type){
        margin-top: 20px;
      }
      .input.card.flex.justify-center.w-full{
        border: none;
        padding: 0 !important;
        height: 30px !important;
      }
      @media (max-width : 767px){
        width: 100%;
      }
    }

    .form .image_uploader {
      border: 1px solid #e4e4e4;
    }

    .participated_header{
      align-items: center;
      margin-bottom: 0px;
      label{
        margin-bottom: 0;
      }
      .main-btn{
        width:35px;
        height:25px;
        font-size: 10px;
        margin-bottom:0;
      }
    }

    .second_step_form{
      display: flex;
      flex-direction: column;
      gap: 20px;
    }


    .register_process{
      @include displayFlex($gap : 0);
      margin-bottom: 10px;
      .circle{
        @include circle(25px);
        background: rgba($color: $secColor, $alpha: 0.15);
        transition: 1s;
        &.active{
          background: $secColor;
        }
      }
      .line{
        width: 150px;
        height: 1px;
        background: $secColor;
      }
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
  }
  .local_research{
    border: 1px solid $secColor;
    border-radius: 8px;
    padding: 20px 10px;
    background: rgba($color: $secColor, $alpha: 0.25);
    position: relative;
    margin: 20px 0;
    button.danger{
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 5px;
      border-radius: 8px;
      width: 30px;
      height: 30px;
      margin: 0;
    }
    li{
      height: 30px;
      font-size: 18px;
      font-weight: 700;
      span{
        color: $secColor;
        font-weight: 500;
        position: relative;
        &:not(:last-of-type){
          small::after{
            content: ' - ';
          }
        }
      }
      &:first-of-type{
        @include displayFlex($justify : flex-start , $gap : 5px);
        
      }
    }
  }
  .uploaded_images{
    @include displayFlex();
    .image{
      width: 100px;
      height: 100px;
    }
  }
  .main-btn.sec_btn.reversed{
    margin: 0;
    width: 30px;
    height: 30px;
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
    padding-inline-start: 5px !important;
  }

  .local_research{
    .local_images{
      margin-bottom: 0 !important ;
    }
  }


  .submit_btn{
    max-width: 767px;
    margin-bottom: 50px;
  }
</style>