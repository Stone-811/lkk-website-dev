<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: '門店管理｜練健康後台',
})

interface Store {
  id: string
  name: string
  slug: string
  city?: string
  district?: string
  address?: string
  phone?: string
  isActive: boolean
  coachCount?: number
}

const stores = ref<Store[]>([])
const isLoading = ref(true)
const error = ref('')
const showAddModal = ref(false)

// Fetch stores from API
async function fetchStores() {
  isLoading.value = true
  error.value = ''
  try {
    const response = await $fetch<{ success: boolean; data: Store[] }>('/api/admin/stores')
    if (response.success) {
      stores.value = response.data
    }
  } catch (e: any) {
    error.value = e.data?.message || '載入失敗'
    console.error('Error fetching stores:', e)
  } finally {
    isLoading.value = false
  }
}

// Toggle store active status
async function toggleActive(store: Store) {
  try {
    await $fetch(`/api/admin/stores/${store.id}`, {
      method: 'PATCH',
      body: { isActive: !store.isActive },
    })
    store.isActive = !store.isActive
  } catch (e: any) {
    alert(e.data?.message || '更新失敗')
  }
}

// Delete store
async function deleteStore(store: Store) {
  if (!confirm(`確定要刪除「${store.name}」嗎？`)) return
  try {
    await $fetch(`/api/admin/stores/${store.id}`, {
      method: 'DELETE',
    })
    stores.value = stores.value.filter(s => s.id !== store.id)
  } catch (e: any) {
    alert(e.data?.message || '刪除失敗')
  }
}

onMounted(fetchStores)
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

    <!-- Error -->
    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
    </div>

    <!-- Stores Grid -->
    <div v-else class="grid gap-6">
      <!-- Empty State -->
      <div v-if="stores.length === 0" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-500">
        尚無門店資料
      </div>
      <div
        v-for="store in stores"
        :key="store.id"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-bold text-gray-900">{{ store.name }}</h3>
              <button
                @click="toggleActive(store)"
                :class="[
                  'text-xs font-medium px-2 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity',
                  store.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ store.isActive ? '營業中' : '已停用' }}
              </button>
            </div>
            <p class="text-gray-500 text-sm mb-1">{{ store.city }}{{ store.district }}{{ store.address }}</p>
            <p class="text-gray-500 text-sm">{{ store.phone || '-' }}</p>
            <p v-if="store.coachCount !== undefined" class="text-gray-400 text-xs mt-1">{{ store.coachCount }} 位教練</p>
          </div>

          <div class="flex items-center gap-2">
            <NuxtLink
              :to="`/admin/stores/${store.id}`"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="編輯"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </NuxtLink>
            <button
              @click="deleteStore(store)"
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="刪除"
            >
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
