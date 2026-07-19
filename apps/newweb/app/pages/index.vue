<script setup lang="ts">
useHead({
  title: '練健康 | Vue/Nuxt 版本',
  meta: [
    { name: 'description', content: '練健康官網 - Vue/Nuxt 架構測試版本' }
  ]
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-24">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold font-serif mb-6">
          練健康
        </h1>
        <p class="text-xl md:text-2xl text-cream-200 mb-4">
          Vue / Nuxt 架構測試版本
        </p>
        <p class="text-orange text-lg font-semibold mb-10">
          此頁面使用 Nuxt 3 + Vue 3 + Tailwind CSS 建置
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/booking" class="btn btn-primary text-lg px-8 py-4">
            預約體驗
          </NuxtLink>
          <NuxtLink to="/services" class="btn btn-outline border-white text-white hover:bg-white hover:text-navy-700 text-lg px-8 py-4">
            服務介紹
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Info Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-navy-700 font-serif mb-6">
            架構說明
          </h2>
          <div class="grid md:grid-cols-3 gap-6 text-left">
            <div class="bg-white rounded-2xl p-6 shadow-sm">
              <div class="text-orange text-3xl mb-4">🚀</div>
              <h3 class="font-bold text-navy-700 mb-2">Nuxt 3</h3>
              <p class="text-ink-600 text-sm">Server-side rendering, 自動路由, API routes</p>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-sm">
              <div class="text-orange text-3xl mb-4">💚</div>
              <h3 class="font-bold text-navy-700 mb-2">Vue 3</h3>
              <p class="text-ink-600 text-sm">Composition API, ref/reactive 狀態管理</p>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-sm">
              <div class="text-orange text-3xl mb-4">🎨</div>
              <h3 class="font-bold text-navy-700 mb-2">Tailwind CSS</h3>
              <p class="text-ink-600 text-sm">共用色彩系統, 響應式設計</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
