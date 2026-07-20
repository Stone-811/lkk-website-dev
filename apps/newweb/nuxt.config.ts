// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
  ],

  // CSS
  css: ['~/assets/css/main.css'],

  // App config
  app: {
    head: {
      title: '練健康',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '練健康 - 專業健身訓練' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/lkklogo.png' },
      ],
    },
  },

  // Runtime config
  runtimeConfig: {
    // Server-side only
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    // Public (client-side)
    public: {
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://l-kk.tw',
    },
  },

  // Nitro server config for Firebase App Hosting
  // Let Firebase App Hosting auto-detect the correct preset
  nitro: {
    preset: 'firebase-app-hosting',
    // Externalize Node.js modules that shouldn't be bundled
    externals: {
      inline: ['firebase-admin'],
    },
  },

  // Build configuration
  build: {
    transpile: ['jose'],
  },
});
