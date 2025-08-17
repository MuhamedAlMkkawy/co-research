import { defineNuxtRouteMiddleware } from 'nuxt/app'
import { useGlobalStore } from '@/stores/globalStore'
import { useAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToastMsg } from '@/composables/useToastMsg'

export default defineNuxtRouteMiddleware((to, from) => {
  // define global store
  const globalStore = useGlobalStore()


  // define show error toast
  const {
    showErrorToast
  } = useToastMsg()


  // define router
  const router = useRouter()

  // console.log(from.path)
  // console.log(authStore?.profile)

  // Check for the protected routes and if the user is not logged in, redirect to the login page
  if (
    ( !to.path.startsWith('/auth') &&
      !to.path.startsWith('/en/auth') &&   
      !to.path.endsWith('/about') &&
      !to.path.endsWith('/terms') &&
      !to.path.endsWith('/privacy') &&
      !to.path.endsWith('/contact') &&
      to.path != '/' &&
      to.path != '/en'
    ) &&
    !useCookie('token').value
  ) {
    showErrorToast(globalStore.lang == 'ar' ? 'يرجى تسجيل الدخول أولا' : 'Please Login in First');
    router.push(globalStore.lang == 'ar' ? '/' : '/en')
  }
  else if(
    useCookie('token').value &&
    to.path.startsWith('/auth')
  ){
    globalStore.setLang('ar')
    router.push('/')
  }
})