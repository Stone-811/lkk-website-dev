<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: '門店管理｜練健康後台',
})

const stores = ref([
  {
    id: 'xindian',
    name: '新店七張店',
    address: '新北市新店區北新路二段 262 號 2 樓',
    phone: '02-8914-6610',
    isActive: true,
  },
  {
    id: 'nanjing',
    name: '南京復興店',
    address: '台北市中山區南京東路三段 103 號 3 樓',
    phone: '02-2546-0010',
    isActive: true,
  },
  {
    id: 'songjiang',
    name: '松江南京店',
    address: '台北市中山區松江路 77 號 2 樓',
    phone: '02-2531-0010',
    isActive: true,
  },
  {
    id: 'ximending',
    name: '西門店',
    address: '台北市萬華區漢中街 51 號 3 樓',
    phone: '02-2381-0010',
    isActive: true,
  },
])

const showAddModal = ref(false)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">門店管理</h1>
        <p class="text-gray-500 mt-1">管理所有門店資訊與設定</p>
      </div>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center gap-2 bg-orange text-white font-medium px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增門店
      </button>
    </div>

    <!-- Stores Grid -->
    <div class="grid gap-6">
      <div
        v-for="store in stores"
        :key="store.id"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-bold text-gray-900">{{ store.name }}</h3>
              <span
                :class="[
                  'text-xs font-medium px-2 py-1 rounded-full',
                  store.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ store.isActive ? '營業中' : '已停用' }}
              </span>
            </div>
            <p class="text-gray-500 text-sm mb-1">{{ store.address }}</p>
            <p class="text-gray-500 text-sm">{{ store.phone }}</p>
          </div>

          <div class="flex items-center gap-2">
            <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Modal Placeholder -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="showAddModal = false"
    >
      <div class="bg-white rounded-xl max-w-lg w-full p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">新增門店</h2>
        <p class="text-gray-500 mb-6">此功能尚在開發中，請稍後再試。</p>
        <button
          @click="showAddModal = false"
          class="w-full bg-gray-100 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
        >
          關閉
        </button>
      </div>
    </div>
  </div>
</template>
