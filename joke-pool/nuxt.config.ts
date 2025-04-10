export default defineNuxtConfig({
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '@/assets/styles.scss',
  ],

  build: {
    transpile: ['vuetify'],
  },

  modules: ['@pinia/nuxt'],
  compatibilityDate: '2025-04-07',
})