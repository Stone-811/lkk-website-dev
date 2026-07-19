<script setup lang="ts">
const route = useRoute()

const menuItems = [
  { name: '儀表板', path: '/admin', icon: 'dashboard' },
  { name: '門店管理', path: '/admin/stores', icon: 'store' },
  { name: '教練管理', path: '/admin/coaches', icon: 'people' },
  { name: '講師管理', path: '/admin/lecturers', icon: 'school' },
  { name: 'LKK4 成績', path: '/admin/lkk4-records', icon: 'trophy' },
  { name: '表單名單', path: '/admin/leads', icon: 'mail' },
  { name: 'FAQ 管理', path: '/admin/faqs', icon: 'help' },
  { name: '系統設定', path: '/admin/settings', icon: 'settings' },
]

const isSidebarOpen = ref(true)

const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top Bar -->
    <header class="fixed top-0 left-0 right-0 h-16 bg-navy text-white z-50 flex items-center px-4 shadow-lg">
      <button
        @click="isSidebarOpen = !isSidebarOpen"
        class="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div class="flex items-center gap-3 ml-4 lg:ml-0">
        <img src="/lkklogo.png" alt="練健康" class="h-8" />
        <span class="font-serif font-bold text-lg">練健康後台</span>
      </div>

      <div class="ml-auto flex items-center gap-4">
        <span class="text-sm text-white/70 hidden sm:inline">管理員</span>
        <NuxtLink
          to="/"
          class="text-sm text-white/70 hover:text-white transition-colors"
        >
          返回前台 →
        </NuxtLink>
      </div>
    </header>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transition-transform',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <nav class="p-4 space-y-1">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActive(item.path)
              ? 'bg-orange text-white'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <!-- Dashboard Icon -->
          <svg v-if="item.icon === 'dashboard'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <!-- Store Icon -->
          <svg v-else-if="item.icon === 'store'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <!-- People Icon -->
          <svg v-else-if="item.icon === 'people'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- School Icon -->
          <svg v-else-if="item.icon === 'school'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <!-- Trophy Icon -->
          <svg v-else-if="item.icon === 'trophy'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <!-- Mail Icon -->
          <svg v-else-if="item.icon === 'mail'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <!-- Help Icon -->
          <svg v-else-if="item.icon === 'help'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <!-- Settings Icon -->
          <svg v-else-if="item.icon === 'settings'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

          <span class="font-medium">{{ item.name }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="isSidebarOpen = false"
    />

    <!-- Main Content -->
    <main class="pt-16 lg:pl-64">
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
