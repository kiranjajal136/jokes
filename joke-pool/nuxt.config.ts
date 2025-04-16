export default defineNuxtConfig({
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '@/assets/styles.scss',
  ],
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:5000/api/jokes', //TODO: Store it in .env file
    },
  },

  build: {
    transpile: ['vuetify'],
  },
  modules: ['@pinia/nuxt'],
  compatibilityDate: '2025-04-07',
  srcDir: 'src/'
})