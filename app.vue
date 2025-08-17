<template>
  <div :style="{ 'direction': availableLocales[0]?.dir, 'background-color': route?.path?.endsWith('/register') ? '#ECECEC80' : '' }">
    <NuxtLayout>
      <div class="container mx-auto" :style="{ 'padding-bottom': route?.path?.endsWith('/register') ? '60px' : '' }">
        <NuxtPage />
        <Toast :style="'direction: ' + availableLocales[0]?.dir"/>
        <!-- <Loading v-if="globalStore?.loading"/> -->
        <Notification 
          v-if="showNotification"
          :notification="notification"
        />
      </div>
      <audio ref="notificationAudio" preload="auto" controls class="hidden">
        <source src="/assets/media/notification.mp3" type="audio/ogg" />
        <source src="/assets/media/notification.mp3" type="audio/mpeg" />
      </audio>
    </NuxtLayout>
    <ImagePopup 
      v-if="globalStore.showImagePopup"
      :image="globalStore.imagePopupSrc"
      @handleShowImagePopup="globalStore.handleShowImagePopup"
    />
    <Loading v-if="globalStore?.loading && route?.path?.startsWith('/auth')" />
  </div>
</template>

<script setup>
  import Toast  from 'primevue/toast';
  import { initializeApp } from "firebase/app";
  import { getMessaging, getToken , onMessage } from "firebase/messaging";



  const { locale, locales } = useI18n()

  // define global store
  const globalStore = useGlobalStore()

  // define locale route 
  const localeRoute = useLocaleRoute()

  // define api methods
  const{
    getMethod,
    getResult
  } = useApiMethods()


  const availableLocales = computed(() => {
    return locales.value.filter(i => i.code == locale.value)
  })

    // #################################### Notification Handler ###################################
  // define notification data 
  const showNotification = ref(false)
  const notificationAudio = ref(null)
  const notification = ref('')
  // const notificationBody = ref('')


  // Function to play notification ringtone
  const playNotificationAudio = () => {
    if(notificationAudio?.value){
      notificationAudio.value?.play();
    }
  };


  // handle show notification
  const handleShowNotification = () => {
    showNotification.value = !showNotification.value
    if(showNotification.value){
      setTimeout(() => {
        showNotification.value = false
      }, 1500)
    }
  }

  // define route
  const route = useRoute()
  
  
  // define router
  const router = useRouter()

  // to watch changes in path to go to the top of the page
  watchEffect(()=>{
    if (typeof window !== 'undefined' && route.path) {
      window.scrollTo({top: 0, behavior: 'smooth'})
    }

    if(route.path.endsWith('notifications' && notification.value?.data?.type != 'new_message')){
      globalStore.isNotified = false
    }

    if(route.path.endsWith('chats') && notification.value?.data?.type == 'new_message'){
      globalStore.isNotified = false
    }

    if(getResult?.value){
      globalStore.totalNotifications = getResult?.value?.notifications?.pagination?.total_items
    }
  })


  
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCp5iXiyKRBndQwRjz_HYgHlxsUttAXh78",
    authDomain: "co-research-7ace4.firebaseapp.com",
    projectId: "co-research-7ace4",
    storageBucket: "co-research-7ace4.firebasestorage.app",
    messagingSenderId: "791640618127",
    appId: "1:791640618127:web:87afae694a502ae3ad2cfa",
    measurementId: "G-F295D7CZ88"
  };

  onMounted(() => {
    // Initialize Firebase
    initializeApp(firebaseConfig);
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      globalStore.isNotified = true
      getMethod('notifications' , 1 , true , false)
      notification.value = payload;
      // notificationBody.value = payload.notification.body;
      handleShowNotification()
      playNotificationAudio();
      if(payload.data.type == 'block'){
        useCookie('auth').value = ''
        useCookie('globalStore').value = ''
        useCookie('token').value = ''
        setTimeout(() => {
          router.push(localeRoute('/auth'))
        }, 1000)
        showErrorToast(payload.notification.body)
      }
    });

    getToken(messaging, { vapidKey: 'BAiN8Y3TBOgGD55_goGVrmIznkc2tYkKeIW_JP-YU0i50QscdbFjuqnNM-r24u07SBw7voRw4FsE93Z7bUdazcI' }).then((currentToken) => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // console.log(currentToken)
        globalStore.handleDeviceID(currentToken)
        // ...
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
  })
</script>

<style>
/* Flat fade-slide transition */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(-20px);
  
}

.page-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>