<template>
  <div>
    <section class="auth_page page" v-if="registerProcess == 1">
      <div class="image">
        <img src="/assets/images/staticPage_image.png" alt="image" loading="lazy">
      </div>
      <p>{{ $t('register.welcome') }}</p>
      <h3 class="title centered">{{ $t('register.title') }}</h3>
      <div class="register_process" v-if="globalStore.userType == 2">
        <div class="circle active" @click="registerProcess = 1"></div>
        <div class="line"></div>
        <div :class="'circle' + (registerProcess == 2 ? ' active' : '')" @click="registerProcess = 2"></div>
      </div>
      <div class="form">
        <!--################# الصورة الشخصيه ###########################-->
        <label for="image" class="image_uploader" v-if="registerProcess == 1">
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
          v-if="registerProcess == 1"
        >
        <label for="image" class="image_label" v-if="globalStore.userType != 2">
          {{ $t('register.image') }} 
          <span>({{ $t('register.optional') }})</span>
        </label>
        <label for="image" class="image_label" v-else>
          {{ $t('register.logo') }} 
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
          <!--################# المدن ###########################-->
          <Cities 
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
          <!--########## ف حالة منظمة بحثية رقم الجوال ####################-->
          <div class="input-wrap" v-if="globalStore.userType == 2">
            <label for="phone">{{ $t('register.phone') }}</label>
            <div class="input">
              <i class="pi pi-phone"></i>
              <input 
                type="tel"
                id="phone"
                :placeholder="$t('register.phone')"
                v-model="body.phone"
              >
            </div>
          </div>
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
          <div class="input-wrap">
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
          <div class="column_inputs">
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
                type="number"
                :placeholder="$t('register.commercial_number')"
                v-model="body.commercial_number"
                oninput="this.value = this.value.replace(/-/g, '').replace(/(\..*)\./g, '$1');"
              >
            </div>
  
            <!--###################### المجالات البحثية ##############################-->
            <label for="research_fields">
              {{ $t('register.research_fields') }}
            </label>
            <div class="input">
              <div class="image">
                <img src="/assets/images/book.svg" alt="image" loading="lazy">
              </div>
                <MulitSelectFields 
                  :endPoint="'research-fields'"
                  @handleSpecializations="body.research_field_ids = $event"
                />
            </div>
  
            <!--###################### التخصصات البحثية ##############################-->
            <label for="research_specializations" v-if="body.research_field_ids.length > 0">
              {{ $t('register.specializations') }}
            </label>
            <div class="input"  v-if="body.research_field_ids.length > 0">
              <div class="image">
                <img src="/assets/images/book.svg" alt="image" loading="lazy">
              </div>
              <!-- `research-fields/specializations?${body.research_field_ids.map(item => `research_field_ids[]=${item?.id}`).join('&')}` -->
                <MulitSelectFields 
                  :endPoint="specializationsEndPoint"
                  @handleSpecializations="body.research_specialization_ids = $event"
                />
            </div>
          </div>
        </div>
        <!-- البيانات الخاصه بـغير المنظمة -->
        <div class="inputs" v-if="globalStore.userType != 2">
          <!--################# عدد الأبحاث المنشورة ###########################-->
          <div class="input-wrap">
            <label for="shared_researches">
              {{ $t('register.shared_researches') }}
              <span>({{ $t('register.optional') }})</span>
            </label>
            <div class="input">
              <i class="pi pi-book"></i>
              <input 
                type="number"
                id="shared_researches"
                :placeholder="$t('register.shared_researches')"
                v-model="body.published_researches_number"
                oninput="this.value = this.value.replace(/-/g, '').replace(/(\..*)\./g, '$1');"
              >
            </div>
          </div>
          <!--################# عدد الأبحاث المشارك بها مسبقا ###########################-->
          <div class="input-wrap">
            <label for="part_researches">{{ $t('register.part_researches') }} <span>({{ $t('register.optional') }})</span></label>
            <div class="input">
              <i class="pi pi-clipboard"></i>
              <input 
                type="number"
                id="part_researches"
                :placeholder="$t('register.part_researches')"
                v-model="body.participated_researches_number"
                oninput="this.value = this.value.replace(/-/g, '').replace(/(\..*)\./g, '$1');"
              >
            </div>
          </div>
        </div>

        <!-- صورة السجل التجاري -->
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
        </div>
        <div class="inputs" v-if="globalStore.userType != 2">
          <!--################# الخبرات ###########################-->
          <div class="input-wrap">
            <label for="exprtises">
              {{ $t('register.exprtises') }}
              <span>({{ $t('register.optional') }})</span>
            </label>
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
            <label for="courses">
              {{ $t('register.courses') }}
              <span>({{ $t('register.optional') }})</span>
            </label>
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
                @handleChangeScientificField="handleChangeScientificField"
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
                endPoint="research-fields/specializations"
                :research_field_id = "body.research_field_id"
                :specializations="body.research_specialization_ids"
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
                type="number"
                id="identity_number"
                :placeholder="$t('identity.input.placeholder')"
                v-model="body.identity_number"
                oninput="this.value = this.value.replace(/-/g, '').replace(/(\..*)\./g, '$1');"
              />
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
              type="number"
              id="employee_number"
              :placeholder="$t('register.employee_number_placeholder')"
              v-model="body.employee_number"
              oninput="this.value = this.value.replace(/-/g, '').replace(/(\..*)\./g, '$1');"
            />
          </div>
        </div>
        <!--############# البطاقة الخاصه بـ المنظمه #############-->
        <div class="input-wrap" v-if="globalStore.userType == 1">
          <label for="organization_image">{{ $t('register.organization_image') }}</label>
        </div>
        <UploadImages
          v-if="globalStore.userType == 1"
          id="organization_image"
          fileType="all"
          :UploadedLocalFile="localOrganizationImage"
          @handleUploadImages="handleUploadOrganizationImage"
          @handleRemoveImage="handleRemoveOrganizationFile"
        />
        <div class="inputs"  v-if="globalStore.userType != 2">
          <!--################# رقم الجوال ###########################-->
          <div class="input-wrap">
            <label for="phone">{{ $t('register.phone') }}</label>
            <div class="input">
              <i class="pi pi-phone"></i>
              <input 
                type="tel"
                id="phone"
                :placeholder="$t('register.phone')"
                v-model="body.phone"
              >
            </div>
          </div>
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
        </div>
        <!--#####################################################################-->
        <!--################# إضافة أبحاث مشارك بها ###########################-->
        <!--#####################################################################-->
        <label class="m-b-20" v-if="globalStore.userType != 2">
          {{ $t('register.add_research') }} 
          <!-- <span>({{ $t('register.optional') }})</span> -->
        </label>
        <!-- body.participated_researches[0] -->
        <!--################# اسم البحث ###########################-->
        <div class="input-wrap m-b-20" v-if="globalStore.userType != 2">
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
        <div class="input-wrap m-b-20" v-if="globalStore.userType != 2">
          <label for="research_field">{{ $t('register.research_field') }}</label>
          <div class="input">
            <div class="image">
              <img src="/assets/images/book.svg" alt="image" loading="lazy">
            </div>
            <ScientificField 
              :research_field_id="Number(body.participated_researches[0].research_field_id[0]?.id)"
              @handleChangeScientificField="handleUploadResearchedScientificField($event)"
            />
          </div>
        </div>
        <!--################# التخصص البحثي ###########################-->
        <div 
          class="input-wrap specializations" 
          v-if="body.participated_researches[0].research_field_id && globalStore.userType != 2">
          <label for="specializations">{{ $t('register.specializations') }}</label>
          <div class="input multiselect_input">
            <div class="image">
              <img src="/assets/images/book.svg" alt="image" loading="lazy">
            </div>
            <MulitSelectFields 
              v-if="body.participated_researches[0].research_field_id"
              :research_field_id = "Number(body.participated_researches[0].research_field_id?.id)"
              endPoint="research-fields/specializations"
              :specializations="body.participated_researches[0].research_specialization_ids"
              @handleSpecializations="handleResearchSpecializations"
            />
          </div>
        </div>
        <!--################# نوع البحث ###########################-->
        <label  v-if="globalStore.userType != 2">{{ $t('register.research_type') }}</label>
        <div class="input-wrap row_input " v-if="globalStore.userType != 2">
          <input 
            type="radio" 
            name="research_type" 
            id="individual" 
            value="0"
            v-model="body.participated_researches[0].research_field_type"
          >
          <label for="individual">{{ $t('register.individual_research') }}</label>
        </div>
        <div class="input-wrap row_input m-b-20" v-if="globalStore.userType != 2">
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
        <div class="input-wrap" v-if="globalStore.userType != 2">
          <label for="research_files">
            {{ $t('register.research_files') }}
            <span>({{ $t('register.optional') }})</span>
          </label>
          <UploadImages
            id="research_files"
            fileType="pdf"
            :UploadedLocalFile="LocalResearchFile"
            @handleUploadImages="handleUploadResearchImages"
            @handleRemoveImage="handleRemoveResearchFile"
          />
          <button 
            class="main-btn sec_btn reversed" 
            v-if="globalStore.userType != 2"
            @click="handleUploadResearches">
            <i class="pi pi-plus"></i>
          </button>
        </div>
        <!--################# طريقة عرض ملفات البحث المرفوعه ع اللوكال  ###########################-->
        <ol 
          class="local_research" 
          v-for="(item, index) in submittedResearches" 
          :key="index"
          v-if="isLocalResearchUploaded && globalStore.userType != 2"
          >
          <!-- {{ console.table(submittedResearches) }} -->
          <button class="main-btn danger" @click="handleRemoveResearch(item)">
            <i class="pi pi-times"></i>
          </button>
          <li>
            {{ $t('register.research_type') }} 
            <span>
              {{ 
                item.research_field_type == 0 ? 
                $t('register.individual_research') : 
                item.research_field_type == 1 ? 
                $t('register.shared_research') : ''
              }}
            </span>
          </li>
          <li>
            {{ $t('register.research_title') }}
            <span>{{ item.name }}</span>
          </li>
          <li>
            {{ $t('register.research_field_title') }}
            <span>{{ item.research_field_id?.name }}</span>
          </li>
          <li>
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
          <div class="local_images" v-if="item.research_files.length > 0 && isLocalResearchUploaded" :style="{ marginBottom: '30px' }">
            <div class="image" v-for="image in item.research_files" :key="image">
              <!-- <div class="remove_btn">
                <button class="pi pi-trash"></button>
              </div> -->
              <template v-if="image.type.endsWith('pdf')">
                <NuxtLink :to="image.url" class="image pdf_image" download>
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
    <div class="input-wrap terms_input mt-5" v-if="globalStore.userType != 2">
      <input 
        type="checkbox" 
        name="terms" 
        id="terms" 
        value="true"
        v-model="body.terms"
      />
      <label for="terms">
        {{ $t('identity.terms') }}
      </label>
    </div>
    <section class="auth_page page" v-if="registerProcess == 2">
      <div class="image">
        <img src="/assets/images/staticPage_image.png" alt="image" loading="lazy">
      </div>
      <p>{{ $t('register.welcome') }}</p>
      <h3 class="title centered">{{ $t('register.title') }}</h3>
      <div class="register_process" v-if="globalStore.userType == 2">
        <div class="circle active" @click="registerProcess = 1"></div>
        <div class="line"></div>
        <div :class="'circle' + (registerProcess == 2 ? ' active' : '')" @click="registerProcess = 2"></div>
      </div>
      <div class="form second_step_form">
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
      <div class="input-wrap terms_input">
        <input 
          type="checkbox" 
          name="terms" 
          id="terms" 
          value="true"
          v-model="body.terms"
        />
        <label for="terms">
          {{ $t('identity.terms') }}
        </label>
      </div>
    </section>
    <button 
      class="main-btn submit_btn" 
      @click="(globalStore.userType == 2 && registerProcess == 1) ? handleNextStep() : handleSubmit()"
    >
      {{ (globalStore.userType == 2 && registerProcess == 1) ? $t('register.next') : $t('register.submit') }}
    </button>
    <Loading v-if="globalStore?.loading" />
  </div>
</template>



<script setup>
  // define i18n
  const { t } = useI18n()
  // define api methods
  const {
    submitMethod,
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
    phone: "",
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
        research_field_id: '',
        research_specialization_ids: [],
        name: "",
        research_field_type: '',
        research_files : []
      }
    ],
    terms : false
  })

  // handle upload user image
  const localImage = ref()
  const handleUploadUserImage = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      localImage.value = URL.createObjectURL(file)
      body.value.image = file
    } else {
      showErrorToast(globalStore.lang == 'ar' ? 'يجب ان يكون الملف من نوع صورة مثل jpeg أو png' : 'The file must be an image type like jpeg or png');
    }
  }

  const specializationsEndPoint = computed(() => {
    return `research-fields/specializations?${body.value.research_field_ids.map(item => `research_field_ids[]=${item?.id}`).join('&')}`
  })

  // for not viweing the layout here 
  definePageMeta({
    layout: false,
  });

  // handle upload submitted reseaches
  const submittedResearches = ref([]);

  // research images after upload research information
  const isLocalResearchUploaded = ref(false)
  const LocalResearchFile = ref()

  // handle upload researches images (رفع ملف البحث)
  const handleUploadResearchImages = (uploadedFiles, index) => {
    const file = uploadedFiles[0];
    if (file && file.type == 'application/pdf') {
      const imageUrl = URL.createObjectURL(file);
      LocalResearchFile.value = [{
        url: imageUrl,
        file: file,
        type: file.type
      }];
      isLocalResearchUploaded.value = false;
      // to upload the file to the server
      body.value.participated_researches[0].research_files = LocalResearchFile;
    } else {
      showErrorToast(globalStore.lang == 'ar' ? 'يجب ان يكون الملف من نوع pdf' : 'The file must be a pdf type');
    }
  }

  const handleRemoveResearchFile = () => {
    body.value.participated_researches[0].research_files = [];
  }

  // handle upload identity image (رفع صورة الهوية)
  const localIdentityImage = ref()
  const handleUploadIdentityImage = (uploadedFiles, index) => {
    const file = uploadedFiles[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      localIdentityImage.value = [{
        url: imageUrl,
        file: file,
        type: file.type
      }];
      // to upload the file to the server
      body.value.employee_card_image = localIdentityImage
    } else {
      showErrorToast(globalStore.lang == 'ar' ? 'يجب ان يكون الملف من نوع صورة مثل jpeg أو png' : 'The file must be an image type like jpeg or png');
    }
  }

  const handleRemoveIdentityFile = () => {
    body.value.employee_card_image = [];
  }

  // handle upload commercial image (رفع صورة السجل التجاري)
  const localCommercialImage = ref()
  const handleUploadCommercialImage = (uploadedFiles, index) => {
    const file = uploadedFiles[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      localCommercialImage.value = [{
        url: imageUrl,
        file: file,
        type: file.type
      }];
      // to upload the file to the server
      body.value.commercial_number_image = localCommercialImage
    } else {
      showErrorToast(globalStore.lang == 'ar' ? 'يجب ان يكون الملف من نوع صورة مثل jpeg أو png' : 'The file must be an image type like jpeg or png');
    }
  }

  const handleRemoveCommercialFile = () => {
    body.value.commercial_number_image = [];
  }


  // handle upload identity image (رفع بطاقة المنظمه)
  const localOrganizationImage = ref()
  const handleUploadOrganizationImage = (uploadedFiles, index) => {
    const file = uploadedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      localOrganizationImage.value = [{
        url: imageUrl,
        file: file,
        type: file.type
      }];
      // to upload the file to the server
      body.value.organization_image = localOrganizationImage;
    } 
    // else {
    //   showErrorToast(globalStore.lang == 'ar' ? 'يجب ان يكون الملف من نوع pdf' : 'The file must be a pdf type');
    // }
  }

  const handleRemoveOrganizationFile = () => {
    body.value.organization_image = [];
  }

  // handle select scientific field  (المجال البحثي)
  const handleChangeScientificField = (scientificField) => {
    body.value.research_specialization_ids = []
    body.value.research_field_id = scientificField?.id
  }
  
  // handle upload specialization fields (التخصصات البحثيه لـ المجال البحثي)
  const handleSpecializationFields = (newSpecializations) => {
    body.value.research_specialization_ids = newSpecializations
  }
  
  
  
  // handle select scientific field  (المجال البحثي لكل بحث مشارك به)
  const handleUploadResearchedScientificField = (scientificField) => {
    // console.log(scientificField)
    body.value.participated_researches[0].research_specialization_ids = []
    body.value.participated_researches[0].research_field_id = scientificField
  }


  // handle upload specialization fields (التخصصات البحثيه ل كل بحث مشارك به)
  const handleResearchSpecializations = (newSpecializations) => {
    body.value.participated_researches[0].research_specialization_ids = newSpecializations
  }


  // control upload and remove researches in local ( التحكم فـ الأبحاث المشارك بها محليا )
  const handleRemoveResearch = (item) => {
    const index = submittedResearches.value.indexOf(item)
    if (index > -1) {
      submittedResearches.value.splice(index, 1)
    }
  }

  const handleUploadResearches = () => {
    const research = body.value.participated_researches[0];

    const hasValues = 
      research.name || 
      research.research_field_id || 
      research.research_specialization_ids.length > 0 || 
      research.research_field_type;

    if (hasValues) {
      // Validation checks
      if (!research.name) {
        showErrorToast(t('validations.register.research_name'));
        return;
      }
      if (!research.research_field_id) {
        showErrorToast(t('validations.register.research_field'));
        return;
      }
      if (research.research_specialization_ids.length === 0) {
        showErrorToast(t('validations.register.research_specializations'));
        return;
      }
      if(!research.research_field_type){
        showErrorToast(t('validations.register.research_type'));
        return;
      }
    }
    // if (research.research_files.length === 0) {
    //   showErrorToast(t('validations.register.research_files'));
    //   return;
    // }

    // Push a copy of the current research to submittedResearches
    submittedResearches.value.push({...research});
    isLocalResearchUploaded.value = true;

    // Reset fields for the next entry (index 0)
    body.value.participated_researches = [
      {
        research_field_id: '',
        research_specialization_ids: [],
        name: "",
        research_field_type: '',
        research_files : []
      }
    ];
    LocalResearchFile.value = [];
  };


  // handle step of register process in condition of the user is organization
  const registerProcess = ref(1)


  // handle next step of register as organization
  const handleNextStep = () => {
    if(!body.value.image) {
      showErrorToast(t('validations.register.organization_image'));
      return;
    }
    else if (!body.value.name?.trim()) {
      showErrorToast(t('validations.register.name'));
      return;
    }
    else if (body.value.name?.trim().length < 2) {
      showErrorToast(t('validations.register.name_length'));
      return;
    }
    else if (!body.value.city_id?.trim()) {
      showErrorToast(t('validations.register.city'));
      return;
    }
    else if(!body.value.email?.trim()) {
      showErrorToast(t('validations.register.email_required'));
      return;
    }
    else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(body.value.email.trim())) {
      showErrorToast(t('validations.register.email_valid'));
      return;
    }
    else if(!body.value.phone?.trim()) {
      showErrorToast(t('validations.register.phone'));
      return;
    }
    else if (body.value.phone?.trim().length < 9) {
      showErrorToast(t('validations.register.phone_length'));
      return;
    }
    else if(!body.value.about_organization?.trim()) {
      showErrorToast(t('validations.register.about_organization'));
      return;
    }
    else if(!body.value.commercial_number?.toString().trim()) {
      showErrorToast(t('validations.register.commercial_number'));
      return;
    }
    else if(body.value.commercial_number?.toString().trim().length != 10) {
      showErrorToast(t('validations.register.commercial_number_length'));
      return;
    }
    else if (body.value.research_field_ids?.length == 0) {
      showErrorToast(t('validations.register.research_fields'));
      return;
    }
    else if (body.value.research_specialization_ids?.length == 0) {
      showErrorToast(t('validations.register.research_specializations'));
      return;
    }
    else if(!body.value.commercial_number_image) {
      showErrorToast(t('validations.register.commercial_image'));
      return;
    }
    else{
      registerProcess.value++
    }
  }

const handleSubmit = () => {
  // Validation checks
  if (!body.value.name?.trim()) {
    showErrorToast(t('validations.register.name'));
    return;
  } 
  
  if (body.value.name.trim().length < 2) {
    showErrorToast(t('validations.register.name_length'));
    return;
  }
  
  if (!body.value.city_id) {
    showErrorToast(t('validations.register.city'));
    return;
  }
  
  if (!body.value.email?.trim()) {
    showErrorToast(t('validations.register.email_required'));
    return;
  }
  
  // Email format validation
  if (body.value.email && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(body.value.email.trim())) {
    showErrorToast(t('validations.register.email_valid'));
    return;
  }

  if (globalStore.userType != 2) {
    if (!body.value.educational_qualification?.trim()) {
      showErrorToast(t('validations.register.scientific_field'));
      return;
    }
    if (!body.value.published_researches_number) {
      showErrorToast(t('validations.register.shared_researches'));
      return;
    }
    if (!body.value.experiences?.trim()) {
      showErrorToast(t('validations.register.exprtises'));
      return;
    }
    if (!body.value.courses?.trim()) {
      showErrorToast(t('validations.register.courses'));
      return;
    }
    if (!body.value.research_field_id) {
      showErrorToast(t('validations.register.field'));
      return;
    }
    if (!body.value.research_specialization_ids || body.value.research_specialization_ids.length == 0) {
      showErrorToast(t('validations.register.specializations'));
      return;
    }
    if (!body.value.phone?.trim()) {
      showErrorToast(t('validations.register.phone'));
      return;
    }
    if (body.value.phone.trim().length < 9) {
      showErrorToast(t('validations.register.phone_length'));
      return;
    }
    if (!body.value.job_title?.trim()) {
      showErrorToast(t('validations.register.job'));
      return;
    }
  }
  
  if (!body.value.terms) {
    showErrorToast(t('validations.identity.terms_required'));
    return; // Added missing return
  }
  
  // If all validations pass, proceed with submission
    globalStore.setUserPhone(body.value.phone)
    const registerData = new FormData()
    registerData.append('user_type', body.value.user_type)
    registerData.append('lang', body.value.lang)
    
    if (body.value.image) {
      registerData.append('image', body.value.image)
    }
    
    registerData.append('name', body.value.name)
    registerData.append('email', body.value.email)
    registerData.append('device_id', globalStore.device_id)
    registerData.append('device_type', 'web')
    registerData.append('city_id', body.value.city_id)
    registerData.append('phone', body.value.phone)
    registerData.append('educational_qualification', body.value.educational_qualification)
    registerData.append('identity_number', globalStore.userType == 0 ? globalStore.identity_number : body.value.identity_number)
    
    if(globalStore.userType != 2){
      registerData.append('job_title', body.value.job_title)
      registerData.append('published_researches_number', body.value.published_researches_number)
      registerData.append('participated_researches_number', body.value.participated_researches_number)
      registerData.append('experiences', body.value.experiences)
      registerData.append('courses', body.value.courses)
      registerData.append('research_field_ids[]', body.value.research_field_id)
      
      if (submittedResearches.value) {
        submittedResearches.value.forEach((research, index) => {
          if (research.research_field_id?.id) {
            registerData.append(`participated_researches[${index}][research_field_id]`, research.research_field_id.id)
          }
          
          if (research.research_specialization_ids) {
            research.research_specialization_ids.forEach((specialization, specializationIndex) => {
              if (specialization?.id) {
                registerData.append(`participated_researches[${index}][research_specialization_ids][${specializationIndex}]`, specialization.id)
              }
            })
          }
          
          if (research.name) {
            registerData.append(`participated_researches[${index}][name]`, research.name)
          }
          
          if (research.research_field_type) {
            registerData.append(`participated_researches[${index}][research_type]`, research.research_field_type)
          }
          
          if (research.research_files?.length > 0) {
            const file = research.research_files[0];
            if (file?.file) {
              registerData.append(`participated_researches[${index}][research_file]`, file.file);
            }
          }
        })
      }
    }
  
    if(globalStore.userType == 1){
      if (body.value.organization_id) {
        registerData.append('organization_id', body.value.organization_id)
      }
      if (body.value.organization_image?.[0]?.file) {
        registerData.append('organization_image', body.value.organization_image[0].file)
      }
    }
    
    if (body.value.research_specialization_ids) {
      body.value.research_specialization_ids.forEach((specialization, index) => {
        if (specialization?.id) {
          registerData.append(`research_specialization_ids[${index}]`, specialization.id)
        }
      })
    }
    
    if(globalStore.userType == 2){
      if (body.value.research_field_ids) {
        body.value.research_field_ids.forEach((field, index) => {
          if (field?.id) {
            registerData.append(`research_field_ids[${index}]`, field.id)
          }
        })
      }
      
      if (body.value.commercial_number_image?.[0]?.file) {
        registerData.append('commercial_number_image', body.value.commercial_number_image[0].file)
      }
      
      if (body.value.commercial_number) {
        registerData.append('commercial_number', body.value.commercial_number)
      }
      
      // Add other optional fields with checks
      if (body.value.about_organization) {
        registerData.append('about_organization', body.value.about_organization)
      }
      if (body.value.bank_name) {
        registerData.append('bank_name', body.value.bank_name)
      }
      if (body.value.bank_account_name) {
        registerData.append('bank_account_name', body.value.bank_account_name)
      }
      if (body.value.bank_account_number) {
        registerData.append('bank_account_number', body.value.bank_account_number)
      }
      if (body.value.bank_iban_number) {
        registerData.append('bank_iban_number', body.value.bank_iban_number)
      }
    }
    
    registerData.append('terms', body.value.terms)
    
    // Submit with error handling
    submitMethod('sign-up', false, registerData, 'POST', '/auth/verification_code')
    
}
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

    // .form .image_uploader {
    //   .image{
    //     img{
    //       width: 50px;
    //       height:50px;
    //       // border-radius: 50%;
    //       overflow: hidden;
    //       // object-fit: contain !important;
    //     }
    //   }
    // }

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
        cursor: pointer;
        &.active{
          background: $secColor !important;
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
          padding-inline-start: 25px;
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
  }

  .local_research{
    .local_images{
      margin-bottom: 0 !important ;
    }
  }

  .input-wrap.terms_input{
    @include displayFlex($justify : flex-start , $gap:5px);
    max-width: 805px;
    margin: 0 auto;
    input{
      width: 15px;
    }
    label{
      font-size: 18px;
      font-weight: 400;
      margin-bottom: 0;
    }
  }


  .submit_btn{
    max-width: 805px;
    margin-block: 0;
  }
</style>