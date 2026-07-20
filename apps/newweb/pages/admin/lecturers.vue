<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: '講師管理｜練健康後台',
})

interface Lecturer {
  id: string
  name: string
  title?: string
  type: 'lkk' | 'partner' | 'overseas'
  photo?: string
  specialties?: string[]
  isActive: boolean
}

const lecturers = ref<Lecturer[]>([])
const isLoading = ref(true)
const error = ref('')
const showAddModal = ref(false)

const typeFilter = ref('')
const searchQuery = ref('')

const typeLabels: Record<string, string> = {
  lkk: '練健康授權講師',
  partner: '合作講師',
  overseas: '海外授權講師',
}

const typeColors: Record<string, string> = {
  lkk: 'bg-orange-100 text-orange-700',
  partner: 'bg-blue-100 text-blue-700',
  overseas: 'bg-green-100 text-green-700',
}

// Fetch lecturers from API
async function fetchLecturers() {
  isLoading.value = true
  error.value = ''
  try {
    const response = await $fetch<{ success: boolean; data: Lecturer[] }>('/api/admin/lecturers')
    if (response.success) {
      lecturers.value = response.data
    }
  } catch (e: any) {
    error.value = e.data?.message || '載入失敗'
    console.error('Error fetching lecturers:', e)
  } finally {
    isLoading.value = false
  }
}

// Toggle lecturer active status
async function toggleActive(lecturer: Lecturer) {
  try {
    await $fetch(`/api/admin/lecturers/${lecturer.id}`, {
      method: 'PATCH',
      body: { isActive: !lecturer.isActive },
    })
    lecturer.isActive = !lecturer.isActive
  } catch (e: any) {
    alert(e.data?.message || '更新失敗')
  }
}

// Delete lecturer
async function deleteLecturer(lecturer: Lecturer) {
  if (!confirm(`確定要刪除「${lecturer.name}」嗎？`)) return
  try {
    await $fetch(`/api/admin/lecturers/${lecturer.id}`, {
      method: 'DELETE',
    })
    lecturers.value = lecturers.value.filter(l => l.id !== lecturer.id)
  } catch (e: any) {
    alert(e.data?.message || '刪除失敗')
  }
}

onMounted(fetchLecturers)

const filteredLecturers = computed(() => {
  return lecturers.value.filter(lecturer => {
    if (typeFilter.value && lecturer.type !== typeFilter.value) return false
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return (
        lecturer.name.toLowerCase().includes(query) ||
        (lecturer.title && lecturer.title.toLowerCase().includes(query)) ||
        (lecturer.specialties && lecturer.specialties.some(s => s.toLowerCase().includes(query)))
      )
    }
    return true
  })
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">講師管理</h1>
        <p class="text-gray-500 mt-1">管理練健康授權講師、合作講師、海外授權講師</p>
      </div>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center gap-2 bg-orange text-white font-medium px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增講師
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋姓名、職稱、專長..."
        class="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white"
      />
      <select
        v-model="typeFilter"
        class="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white"
      >
        <option value="">全部類型</option>
        <option value="lkk">練健康授權講師</option>
        <option value="partner">合作講師</option>
        <option value="overseas">海外授權講師</option>
      </select>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
    </div>

    <!-- Lecturers Grid -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="filteredLecturers.length === 0" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-500">
        尚無講師資料
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="lecturer in filteredLecturers"
          :key="lecturer.id"
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
        >
          <div class="flex gap-4">
            <!-- Avatar -->
            <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img
                v-if="lecturer.photo"
                :src="lecturer.photo"
                :alt="lecturer.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-navy flex items-center justify-center text-white font-bold text-xl">
                {{ lecturer.name?.charAt(0) }}
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-bold text-gray-900">{{ lecturer.name }}</h3>
                  <p class="text-sm text-gray-500">{{ lecturer.title || '-' }}</p>
                </div>
                <span
                  :class="[
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    lecturer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  ]"
                >
                  {{ lecturer.isActive ? '上架' : '下架' }}
                </span>
              </div>
              <span :class="['inline-block text-xs px-2 py-0.5 rounded mt-2', typeColors[lecturer.type]]">
                {{ typeLabels[lecturer.type] }}
              </span>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="specialty in (lecturer.specialties || []).slice(0, 3)"
                  :key="specialty"
                  class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                >
                  {{ specialty }}
                </span>
                <span v-if="(lecturer.specialties || []).length > 3" class="text-xs text-gray-400">
                  +{{ (lecturer.specialties || []).length - 3 }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              @click="toggleActive(lecturer)"
              class="text-sm text-gray-600 hover:text-gray-900 px-3 py-1"
            >
              {{ lecturer.isActive ? '下架' : '上架' }}
            </button>
            <NuxtLink
              :to="`/admin/lecturers/${lecturer.id}`"
              class="text-sm text-navy hover:text-navy-600 px-3 py-1"
            >
              編輯
            </NuxtLink>
            <button
              @click="deleteLecturer(lecturer)"
              class="text-sm text-red-500 hover:text-red-600 px-3 py-1"
            >
              刪除
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
        <h2 class="text-xl font-bold text-gray-900 mb-4">新增講師</h2>
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
