<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: '教練管理｜練健康後台',
})

interface Coach {
  id: string
  name: string
  photo?: string
  roleTitle?: string
  storeId?: string
  store?: { id: string; name: string; slug: string }
  specialties?: string[]
  isActive: boolean
}

const coaches = ref<Coach[]>([])
const isLoading = ref(true)
const error = ref('')
const showAddModal = ref(false)

// Fetch coaches from API
async function fetchCoaches() {
  isLoading.value = true
  error.value = ''
  try {
    const response = await $fetch<{ success: boolean; data: Coach[] }>('/api/admin/coaches')
    if (response.success) {
      coaches.value = response.data
    }
  } catch (e: any) {
    error.value = e.data?.message || '載入失敗'
    console.error('Error fetching coaches:', e)
  } finally {
    isLoading.value = false
  }
}

// Toggle coach active status
async function toggleActive(coach: Coach) {
  try {
    await $fetch(`/api/admin/coaches/${coach.id}`, {
      method: 'PATCH',
      body: { isActive: !coach.isActive },
    })
    coach.isActive = !coach.isActive
  } catch (e: any) {
    alert(e.data?.message || '更新失敗')
  }
}

// Delete coach
async function deleteCoach(coach: Coach) {
  if (!confirm(`確定要刪除「${coach.name}」嗎？`)) return
  try {
    await $fetch(`/api/admin/coaches/${coach.id}`, {
      method: 'DELETE',
    })
    coaches.value = coaches.value.filter(c => c.id !== coach.id)
  } catch (e: any) {
    alert(e.data?.message || '刪除失敗')
  }
}

onMounted(fetchCoaches)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">教練管理</h1>
        <p class="text-gray-500 mt-1">管理所有教練資訊與專長</p>
      </div>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center gap-2 bg-orange text-white font-medium px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增教練
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

    <!-- Coaches Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">教練</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">門店</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">職稱</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">狀態</th>
            <th class="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="coaches.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-500">尚無教練資料</td>
          </tr>
          <tr v-for="coach in coaches" :key="coach.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <img
                  v-if="coach.photo"
                  :src="coach.photo"
                  :alt="coach.name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div v-else class="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-bold">
                  {{ coach.name?.charAt(0) }}
                </div>
                <span class="font-medium text-gray-900">{{ coach.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ coach.store?.name || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ coach.roleTitle || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="toggleActive(coach)"
                :class="[
                  'text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity',
                  coach.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ coach.isActive ? '啟用中' : '已停用' }}
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink
                  :to="`/admin/coaches/${coach.id}`"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="編輯"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </NuxtLink>
                <button
                  @click="deleteCoach(coach)"
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="刪除"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Modal Placeholder -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="showAddModal = false"
    >
      <div class="bg-white rounded-xl max-w-lg w-full p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">新增教練</h2>
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
