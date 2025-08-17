// nuxt.config.ts
import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  components: [
    // Automatically import components from the default components directory
    { path: '~/components/', pathPrefix: false },

    // Automatically import components from the 'popup , select' directory with .vue extension
    { path: '~/components/popup/', pathPrefix: false, extensions: ['vue'] },
    { path: '~/components/select/', pathPrefix: false, extensions: ['vue'] },
  ],

  ssr : false,

  
  runtimeConfig: {
    public: {
      apiBase: "https://backend.co-research.sa/api/",
    },
  },


  app: {
    pageTransition: {
      name: "page",
      mode: "out-in"
    },
    head: {
      title: "co-research",
      htmlAttrs: { 
        lang: "ar" 
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { hid: "description", name: "description", content: "co-research" },
        { name: "google", content: "notranslate" }
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/logo.png" }
      ]
    }
  },

  // i18n module setup
  modules: [ 
    '@nuxtjs/i18n', 
    '@primevue/nuxt-module' , 
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],

  imports: {
    dirs: ['stores' , 'composables'], // Automatically import from these directories
  },

  
  // pinia: {
  //   autoImports: [
  //     // Automatically import Pinia functions like `defineStore`
  //     'defineStore',
  //   ],
  // },


  primevue: {
    autoImport : true ,
    options: {
      // unstyled: true,
      zIndex: {
        modal: 3000
      },
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark',
          cssLayer: false
        }
      }
    }
  },


  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // recommended
    },

    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
        name: 'English',
        dir: 'ltr',
      },
      {
        code: 'ar',
        iso: 'ar-SA',
        file: 'ar.json',
        name: 'العربية',
        dir: 'rtl',
      },
    ],
    langDir: '../locales/',
    lazy: true,
    strategy: 'prefix_except_default',
    defaultLocale: 'ar',
    vueI18n: './i18n.config.ts',
  },

  css: [
    "/assets/css/style.css",
    "primeicons/primeicons.css",
    'primevue/resources/primevue.min.css',
    'primevue/resources/themes/aura-light-green/theme.css'
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/scss/_variables.scss" as *;
            @use "~/assets/scss/_mixins.scss" as *;
          `,
        },
      },
    }
  },
});