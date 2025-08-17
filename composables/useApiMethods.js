import { useRouter } from 'vue-router';
import { useGlobalStore } from '~/stores/globalStore';
import { useAuth } from '~/stores/auth';
import { useToastMsg } from '@/composables/useToastMsg';
import { fetchApiData , submitApiForm } from '@/composables/useApiFetch';
import { ref } from 'vue';

export function useApiMethods() {
  // define global store
  const globalStore = useGlobalStore();

  // define auth store
  const auth = useAuth();

  // define router
  const router = useRouter();

  // define local route
  const localeRoute = useLocaleRoute()

  // define useToastMsg
  const { 
    showErrorToast, 
    showSuccessToast,
    showInfoToast,
    showWarnToast 
  } = useToastMsg();


  // define handle the next route 
  const handleNextRoute = (nextRoute) => {
    setTimeout(()=>{
      if(nextRoute == 'reload_page'){
        router.go(0);
      }else{
        router.push(localeRoute(nextRoute));
      }
    } , 500)
  }


  // define handle the toast message and its type
  const handleToastMsg = (type , message) => {
    // to stop the loading while showing the message
    if(type == 'success'){
      showSuccessToast(message);
    }else if(type == 'info'){
      showInfoToast(message);
    }else if(type == 'warn'){
      showWarnToast(message);
    }else{
      showErrorToast(message);
    }
  }

  // Fetch Data 
  const getResult = ref(null);
  const getMethod = async (apiUrl , pageNumber ,authed , showToast) => {
    getResult.value = null
    globalStore.switchLoading(true);
    const { data, error } = await fetchApiData(`${apiUrl}${pageNumber ? `?page=${pageNumber}` : ''}`, authed);
    
    if (error) {
      globalStore.switchLoading(false);
      handleToastMsg('error' , error?.response?.data?.message)
    } else {
      if (data.key == 'success') {
        getResult.value = data?.data;
        if(apiUrl.startsWith('send-code?phone=')){
          router.push(localeRoute('/auth/verification_code'));
        }
        if(apiUrl.startsWith('research-opportunities/') && apiUrl.endsWith('/change-status')){
          location.reload()
        }
      }
      if(showToast){
        handleToastMsg(data?.key , data?.msg)
      }
      if (
        data.key == 'unauthenticated' || 
        data.key == 'not_approved'
      ){
        handleNextRoute('/')
        useCookie('token').value = ''
      }
      globalStore.switchLoading(false);
    }
  }


  // submit form function
  const submitResult = ref(null)
  const submitMethod = async (endPoint, authed , payload , method  , nextRoute , refetchApi) => {
    if(!endPoint.startsWith('upload-room-file')){
      globalStore.switchLoading(true)
    }
    const {data , error} = await submitApiForm(endPoint, authed ,  payload , method);
    
    if (error) {
      globalStore.switchLoading(false);
      handleToastMsg('error' , error?.response?.data?.message)
    } else {
      if (data.key == 'success') {
        handleNextRoute(nextRoute);
        if (refetchApi) {
          getMethod(refetchApi , '' ,authed , false)
        }
        if(
          endPoint == 'sign-up' ||
          endPoint == 'sign-in' || 
          endPoint == 'update-profile?_method=put'
        ){
          globalStore.submittedLocalResearches = []
          auth.handleUserData(data?.data);
          useCookie('auth').value = data?.data;
          globalStore.user.id = data?.data?.id;
          globalStore.user.name = data?.data?.name;
          globalStore.user.image = data?.data?.image;
          useCookie('token').value = data?.data?.token;
        }
      }
      else if(data.key == 'needActive'){
        globalStore.setUserPhone(data?.data?.user?.phone)
        globalStore.defineUserType(data?.data?.user?.user_type)
        handleNextRoute('/auth/verification_code')
      }
      else if (
        data.key == 'unauthenticated' || 
        data.key == 'not_approved'
      ){
        handleNextRoute('/')
        useCookie('token').value = ''
      }
      submitResult.value = {data , endPoint};
      handleToastMsg(data?.key , data?.msg)
      globalStore.switchLoading(false);
    }
  };  

  return {
    getMethod,
    getResult,
    submitMethod,
    submitResult,
    showErrorToast,
    handleNextRoute
  };
}