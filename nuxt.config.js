require('dotenv').config();

export default {
  mode: 'spa',
  srcDir: 'src/',
  components: true,
  head: {
    titleTemplate: titleChunk => {
      return titleChunk ? `${titleChunk} | Kreasi Room` : 'Kreasi Room';
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Aplikasi Kreasi Room'
      },
      {
        name: 'author',
        content: 'KreasiX'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,600,600i&display=swap'
      }
    ]
  },
  loading: { color: '#00a8ff' },
  pageTransition: {
    name: 'page-fade',
    mode: 'out-in'
  },
  layoutTransition: {
    name: 'layout-fade',
    mode: 'out-in'
  },
  css: ['@/assets/scss/app.scss'],
  plugins: [
    {
      src: '@/plugins/persistedState.js',
      mode: 'client'
    },
    '@/plugins/vuelidate.js'
  ],
  buildModules: [],
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/pwa',
    [
      '@nuxtjs/dotenv',
      {
        path: './',
        filename:
          process.env.NODE_ENV === 'development' ? '.env.development' : '.env'
      }
    ],
    'nuxt-fontawesome',
    '@nuxtjs/style-resources',
    '@nuxtjs/firebase'
  ],
  firebase: {
    config: {
        apiKey: "AIzaSyDvopCrKhyoRj3ymrN1W4a1AdSZMLrEsbk",
        authDomain: "kreasiroom-dev.firebaseapp.com",
        databaseURL: "https://kreasiroom-dev.firebaseio.com",
        projectId: "kreasiroom-dev",
        storageBucket: "kreasiroom-dev.appspot.com",
        messagingSenderId: "711795192476",
        appId: "1:711795192476:web:1d71d53e9526cbcb4df359",
        measurementId: "G-S4G333VTX2"
      //apiKey: process.env.NUXT_ENV_FB_API_KEY || '',
      //authDomain: process.env.NUXT_ENV_FB_AUTH_DOMAIN || '',
      //databaseURL: process.env.NUXT_ENV_FB_DATABASE_URL || '',
      //projectId: process.env.NUXT_ENV_FB_PROJECT_ID || '',
      //storageBucket: process.env.NUXT_ENV_FB_STORAGE_BUCKET || '',
      //messagingSenderId: process.env.NUXT_ENV_FB_MESSAGING_SENDER_ID || '',
      //appId: process.env.NUXT_ENV_FB_APP_ID || '',
      //measurementId: process.env.NUXT_ENV_FB_MEASUREMENT_ID || ''
    },
    onFirebaseHosting: true,
    services: {
      auth: {
        persistence: 'local',
        initialize: {
          onAuthStateChangedAction: 'onAuthStateChangedAction'
        }
      },
      firestore: true,
      storage: true,
      // performance: process.env.NODE_ENV !== 'development',
      // analytics: process.env.NODE_ENV !== 'development',
      messaging: {
        createServiceWorker: true,
        fcmPublicVapidKey: process.env.NUXT_ENV_FB_MESSAGING_KEY
      }
    }
  },
  styleResources: {
    scss: ['@/assets/scss/_variables.scss']
  },
  bootstrapVue: {
    componentPlugins: [
      'LayoutPlugin',
      'ButtonPlugin',
      'ToastPlugin',
      'ModalPlugin',
      'FormGroupPlugin'
    ],
    components: ['BImg'],
    bootstrapCSS: false,
    bootstrapVueCSS: false
  },
  fontawesome: {
    component: 'fa-icon'
  },
  generate: {
    dir: 'public',
    fallback: true
  },
  build: {
    transpile: ['bootstrap-vue'],
    babel: {
      compact: true
    }
  },
  pwa: {
    workbox: {
      runtimeCaching: [
        {
          urlPattern: 'https://fonts.googleapis.com/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        },
        {
          urlPattern: 'https://fonts.gstatic.com/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        }
      ],
      publicPath: 'public',
      offlineStrategy: 'NetworkFirst',
      offlineAnalytics: true
    },
    icon: {
      sizes: [72, 96, 128, 144, 152, 192, 384, 512]
    },
    manifest: {
      name: 'Kreasi Room',
      lang: 'id-ID',
      display: 'fullscreen',
      theme_color: '#0070e1'
    }
  }
};
