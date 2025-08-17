import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('globalStore', () => {
  // define loading 
  const loading = ref(false);
  const switchLoading = (newValue) => {
    loading.value = newValue;
  };

  // define language
  const lang = ref(useCookie('i18n_redirected')?.value || 'ar');
  const setLang = (newLang) => {
    lang.value = newLang;
    useCookie('i18n_redirected').value = newLang
  }

  // define user data
  const user = ref({
    id : '',
    name: '',
    image: ''
  });

  // store user phone 
  const country_code = ref('966')
  const userPhone = ref('')
  const setUserPhone = (newPhone) => {
    userPhone.value = newPhone
  }

  // define auth process
  const authProcess = ref('signIn')
  const defineAuthProcess = (newProcess) =>{
    authProcess.value = newProcess
  }

  // define identity
  const identity_number = ref()
  const handleIdentityNumber = (identity) =>{
    identity_number.value = identity
  }

  // define user type 
  const userType = ref(window.localStorage.getItem('user_type'))
  const defineUserType = (newType) => {
    window.localStorage.setItem('user_type', newType)
    userType.value = newType
  }
  
  // handle device id 
  const device_id = ref(null);
  const handleDeviceID = (newDeviceID) => {
    device_id.value = newDeviceID;
  };
  
  // handle image popup
  const imageSrc = ref('');
  const showImagePopup = ref(false);
  const handleShowImagePopup = (image) =>{
    showImagePopup.value = !showImagePopup.value
    console.log(image)
    if(image){
      imageSrc.value = image
    }else{
      imageSrc.value = ''
    }
  }

  // define room id 
  const roomId = ref('')

  // define memberInfo 
  const memberInfo = ref({
    action : '',
    id : ''
  })


  // define totalNotifications
  const totalNotifications = ref();

  // define page before activation code page (change_phone , new_phone)
  const pageBeforeActivationCode = ref('auth')

  // define submitted local researches 
  const submittedLocalResearches = ref([])

  const handleStoreSubmittedLocalResearches = (newSubmittedLocalResearches) => {
    submittedLocalResearches.value = [...submittedLocalResearches.value, newSubmittedLocalResearches]
  }

  // Expose state and actions
  return {
    loading,
    switchLoading,
    lang,
    setLang,
    user,
    country_code,
    authProcess,
    defineAuthProcess,
    identity_number,
    handleIdentityNumber,
    userPhone,
    setUserPhone,
    userType,
    defineUserType,
    device_id,
    handleDeviceID,
    imageSrc,
    showImagePopup,
    handleShowImagePopup,
    roomId,
    memberInfo,
    totalNotifications,
    pageBeforeActivationCode,
    submittedLocalResearches,
    handleStoreSubmittedLocalResearches,
  };
}, {
  persist: true,
});
