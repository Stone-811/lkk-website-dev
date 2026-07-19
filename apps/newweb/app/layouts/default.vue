<template>
  <div>
    <!-- Header -->
    <header class="bg-navy-700 text-white py-4">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/lkklogo.png" alt="練健康" class="h-10" />
        </NuxtLink>
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink to="/services" class="hover:text-orange transition-colors">服務介紹</NuxtLink>
          <NuxtLink to="/locations" class="hover:text-orange transition-colors">門店資訊</NuxtLink>
          <NuxtLink to="/booking" class="btn btn-primary">預約體驗</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-navy-800 text-white py-12">
      <div class="container mx-auto px-4 text-center">
        <p class="text-cream-200">&copy; 2024 練健康 L-KK. All rights reserved.</p>
        <p class="text-cream-300 text-sm mt-2">此為 Vue/Nuxt 測試版本</p>
      </div>
    </footer>
  </div>
</template>
