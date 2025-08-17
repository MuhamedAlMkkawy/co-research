<template>
  <div>
    <section class="auth_page page">
      <div class="image">
        <img src="/assets/images/staticPage_image.png" alt="image" loading="lazy">
      </div>
      <p>{{$t('user_type.welcome')}}</p>
      <h3 class="title centered">
        {{ $t('user_type.title') + 
          (globalStore?.authProcess != 'signUp' 
            ? $t('user_type.sub_title_login') 
            : $t('user_type.sub_title_register')
          )
        }}
      </h3>
      <form action="" @submit.prevent="handleSubmit">
        <label for="user_type">{{$t('user_type.user.label')}}</label>
        <div class="input dropdown" @click="toggleDropdown">
          <div class="image">
            <img :src="userType?.image" alt="image" loading="lazy">
          </div>
          {{ userType?.label }}
          <i class="pi pi-angle-down"></i>
          <ul v-if="showDropdown">
            <li 
              v-for="type in userTypes.filter((item)=> item.id > -1)"
              :key="type.id"
              @click="selectUserType(type)">
              <div class="image">
                <img :src="userTypes.find((item)=> item.id == type.id)?.image" alt="image" loading="lazy">
              </div>  
              {{ type.label }}
            </li>
          </ul>
        </div>
        <button class="main-btn">
          {{$t('user_type.button')}}
        </button>
      </form>
      <h5>
        {{
          globalStore?.authProcess == 'signUp' ? 
          $t('user_type.login_text') : 
          $t('user_type.register_text')
        }} 
        <NuxtLink 
          style="cursor: pointer;"
          @click="
            globalStore?.defineAuthProcess(globalStore?.authProcess == 'signUp' ?
            'signIn' : 
            'signUp')">
            {{ 
              globalStore?.authProcess == 'signUp' ? 
              $t('user_type.login_link') : 
              $t('user_type.register_link')
            }}
        </NuxtLink>
      </h5>
    </section>
    <LanguageSwitch />
  </div>
</template>

<script setup>
  import usertypeImage from '~/assets/images/user_type.png' 
  import userImage from '~/assets/images/user.svg' 
  import userIdImage from '~/assets/images/user_id.png' 
  import organizationImage from '~/assets/images/users.png'
  
  

  const { t } = useI18n()

  // define locale route
  const localeRoute = useLocalePath()

  // define global store
  const globalStore = useGlobalStore()

  // define router
  const router = useRouter()

  // for not viweing the layout here 
  definePageMeta({
    layout: false,
  });

  // to control dropdown of user types
  const showDropdown = ref(false);

  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
  };

  const userTypes = ref([
    {
      id : -1,
      image : usertypeImage,
      label : t('user_type.user.label')
    },
    {
      id : 0,
      image : userImage,
      label : t('user_type.user.types.user')
    },
    {
      id : 1,
      image : userIdImage,
      label : t('user_type.user.types.related_user')
    },
    {
      id : 2,
      image : organizationImage,
      label : t('user_type.user.types.organization')
    },
  ])

  // default user type
  const userType = ref(userTypes.value[0]);

  // handle select user type
  const selectUserType = (type) => {
    userType.value = type;
    globalStore.defineUserType(type.id)
    showDropdown.value = true
  }

  // define toast message
  const {
    showErrorToast
  } = useToastMsg()


  // handle submit form
  const handleSubmit = () => {
    if(userType.value.id > -1){
      if(globalStore.authProcess == 'signUp'){
        if(userType.value.id == 0){
          router.push(localeRoute('/auth/identity'))
        }else{
          router.push(localeRoute('/auth/register'))
        }
      }else{
        router.push(localeRoute('/auth/login'))
      }
    }else{
      showErrorToast(t('validations.user_type.required'))
    }
  }
</script>

<style lang="scss" scoped>
  .input.dropdown{
    cursor: pointer;
    user-select: none;
    ul{
      position: absolute;
      top: 100%;
      background: #fff;
      z-index: 9;
      width: 100%;
      inset-inline-start: 0;
      // padding: 10px 0;
      border-radius: 10px;
      border: 1px solid $secColor;
      overflow: hidden;
      li{
        @include displayFlex($justify : flex-start , $gap : 5px);
        padding-block: 12px;
        cursor: pointer;
        padding-inline-start: 10px;
        &:not(:last-of-type){
          border-bottom: 1px solid $secColor;
        }
        &:hover{
          background: $thirdColor;
        }
      }
    }
  }
</style>