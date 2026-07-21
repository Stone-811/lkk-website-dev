<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: '講師管理｜練健康後台',
})

interface Lecturer {
  id: string
  name: string
  slug?: string
  title?: string
  organization?: string
  region?: string
  countries?: string[]
  type: 'lkk' | 'partner' | 'overseas'
  photo?: string
  description?: string
  specialties?: string[]
  courses?: string[]
  certifications?: string[]
  sortOrder?: number
  isActive: boolean
}

const lecturers = ref<Lecturer[]>([])
const isLoading = ref(true)
const error = ref('')

// Edit modal
const showEditModal = ref(false)
const editingLecturer = ref<Lecturer | null>(null)
const saving = ref(false)

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

const formData = ref({
  name: '',
  slug: '',
  title: '',
  organization: '',
  region: '',
  countriesText: '',
  type: 'lkk' as 'lkk' | 'partner' | 'overseas',
  photo: '',
  description: '',
  specialtiesText: '',
  coursesText: '',
  certificationsText: '',
  sortOrder: 0,
  isActive: true,
})

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

function openEditModal(lecturer?: Lecturer) {
  if (lecturer) {
    editingLecturer.value = lecturer
    formData.value = {
      name: lecturer.name || '',
      slug: lecturer.slug || '',
      title: lecturer.title || '',
      organization: lecturer.organization || '',
      region: lecturer.region || '',
      countriesText: (lecturer.countries || []).join('\n'),
      type: lecturer.type || 'lkk',
      photo: lecturer.photo || '',
      description: lecturer.description || '',
      specialtiesText: (lecturer.specialties || []).join('\n'),
      coursesText: (lecturer.courses || []).join('\n'),
      certificationsText: (lecturer.certifications || []).join('\n'),
      sortOrder: lecturer.sortOrder || 0,
      isActive: lecturer.isActive ?? true,
    }
  } else {
    editingLecturer.value = null
    const maxSortOrder = lecturers.value.length > 0 ? Math.max(...lecturers.value.map(l => l.sortOrder || 0)) : 0
    formData.value = {
      name: '',
      slug: '',
      title: '',
      organization: '',
      region: '',
      countriesText: '',
      type: 'lkk',
      photo: '',
      description: '',
      specialtiesText: '',
      coursesText: '',
      certificationsText: '',
      sortOrder: maxSortOrder + 1,
      isActive: true,
    }
  }
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingLecturer.value = null
}

async function saveLecturer() {
  if (!formData.value.name || !formData.value.slug) {
    alert('請填寫必填欄位')
    return
  }

  saving.value = true
  try {
    const isNew = !editingLecturer.value
    const url = isNew ? '/api/admin/lecturers' : `/api/admin/lecturers/${editingLecturer.value!.id}`
    const method = isNew ? 'POST' : 'PATCH'

    const payload = {
      name: formData.value.name,
      slug: formData.value.slug,
      title: formData.value.title,
      organization: formData.value.organization,
      region: formData.value.region,
      countries: formData.value.countriesText.split('\n').map(s => s.trim()).filter(Boolean),
      type: formData.value.type,
      photo: formData.value.photo,
      description: formData.value.description,
      specialties: formData.value.specialtiesText.split('\n').map(s => s.trim()).filter(Boolean),
      courses: formData.value.coursesText.split('\n').map(s => s.trim()).filter(Boolean),
      certifications: formData.value.certificationsText.split('\n').map(s => s.trim()).filter(Boolean),
      sortOrder: formData.value.sortOrder,
      isActive: formData.value.isActive,
    }

    const response = await $fetch<{ success: boolean; data?: Lecturer; error?: string }>(url, {
      method,
      body: payload,
    })

    if (response.success) {
      await fetchLecturers()
      closeEditModal()
    } else {
      alert(response.error || '儲存失敗')
    }
  } catch (e: any) {
    alert(e.data?.message || '儲存失敗')
  } finally {
    saving.value = false
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

// Move lecturer up/down in sort order
async function moveLecturer(lecturer: Lecturer, direction: 'up' | 'down') {
  // Use filteredLecturers for current view, but update main array
  const currentList = filteredLecturers.value
  const currentIndex = currentList.findIndex(l => l.id === lecturer.id)
  if (currentIndex === -1) return

  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  if (newIndex < 0 || newIndex >= currentList.length) return

  // Get the IDs we need to swap
  const currentId = currentList[currentIndex].id
  const swapId = currentList[newIndex].id

  // Find these in the main array and swap their sortOrder
  const mainIndex1 = lecturers.value.findIndex(l => l.id === currentId)
  const mainIndex2 = lecturers.value.findIndex(l => l.id === swapId)

  if (mainIndex1 === -1 || mainIndex2 === -1) return

  // Swap in main array
  const items = [...lecturers.value]
  const temp = items[mainIndex1]
  items[mainIndex1] = items[mainIndex2]
  items[mainIndex2] = temp

  // Update local state immediately
  lecturers.value = items

  // Prepare reorder data for all items
  const reorderItems = items.map((item, index) => ({
    id: item.id,
    sortOrder: index + 1,
  }))

  try {
    await $fetch('/api/admin/lecturers/reorder', {
      method: 'PATCH',
      body: { items: reorderItems },
    })
    // Update local sortOrder values
    lecturers.value.forEach((l, idx) => {
      l.sortOrder = idx + 1
    })
  } catch (e: any) {
    // Revert on error
    await fetchLecturers()
    alert(e.data?.message || '更新排序失敗')
  }
}

function generateSlug(name: string): string {
  const mapping: Record<string, string> = {
    '陳': 'chen', '林': 'lin', '黃': 'huang', '張': 'zhang', '李': 'li',
    '王': 'wang', '吳': 'wu', '劉': 'liu', '蔡': 'tsai', '楊': 'yang',
  }
  let slug = name.toLowerCase()
  Object.entries(mapping).forEach(([zh, en]) => {
    slug = slug.replace(zh, en)
  })
  return slug.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function handleNameChange() {
  if (!editingLecturer.value) {
    formData.value.slug = generateSlug(formData.value.name)
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
        @click="openEditModal()"
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
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center gap-0.5">
              <button
                @click="moveLecturer(lecturer, 'up')"
                :disabled="filteredLecturers.indexOf(lecturer) === 0"
                class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="上移"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                @click="moveLecturer(lecturer, 'down')"
                :disabled="filteredLecturers.indexOf(lecturer) === filteredLecturers.length - 1"
                class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="下移"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="toggleActive(lecturer)"
                class="text-sm text-gray-600 hover:text-gray-900 px-3 py-1"
              >
                {{ lecturer.isActive ? '下架' : '上架' }}
              </button>
              <button
                @click="openEditModal(lecturer)"
                class="text-sm text-navy hover:text-navy-600 px-3 py-1"
              >
                編輯
              </button>
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
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="closeEditModal"
    >
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 class="text-xl font-bold text-gray-900">
            {{ editingLecturer ? '編輯講師' : '新增講師' }}
          </h2>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">姓名 <span class="text-red-500">*</span></label>
              <input
                type="text"
                v-model="formData.name"
                @input="handleNameChange"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="講師姓名"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">網址代稱 <span class="text-red-500">*</span></label>
              <input
                type="text"
                v-model="formData.slug"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="lecturer-slug"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">職稱</label>
              <input
                type="text"
                v-model="formData.title"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="例如：首席講師"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">講師類型 <span class="text-red-500">*</span></label>
              <select v-model="formData.type" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="lkk">練健康授權講師</option>
                <option value="partner">合作講師</option>
                <option value="overseas">海外授權講師</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">所屬機構</label>
              <input
                type="text"
                v-model="formData.organization"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="所屬機構名稱"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">地區（海外講師用）</label>
              <input
                type="text"
                v-model="formData.region"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="例如：東南亞"
              />
            </div>
          </div>

          <div v-if="formData.type === 'overseas'">
            <label class="block text-sm font-medium mb-1">授權國家（每行一個）</label>
            <textarea
              v-model="formData.countriesText"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="馬來西亞&#10;新加坡&#10;泰國"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">照片網址</label>
            <input
              type="url"
              v-model="formData.photo"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="https://..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">簡介</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="講師介紹..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">專長領域（每行一個）</label>
              <textarea
                v-model="formData.specialtiesText"
                rows="4"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="肌力與體能訓練&#10;運動傷害防護&#10;功能性訓練"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">授課項目（每行一個）</label>
              <textarea
                v-model="formData.coursesText"
                rows="4"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="初階肌力訓練&#10;進階體能訓練&#10;教練培訓課程"
              ></textarea>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">專業認證（每行一個）</label>
            <textarea
              v-model="formData.certificationsText"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="NSCA-CSCS&#10;ACE-CPT&#10;FMS Level 2"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">排序</label>
              <input
                type="number"
                v-model.number="formData.sortOrder"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                min="0"
              />
            </div>
            <div class="flex items-center gap-2 pt-6">
              <input type="checkbox" id="isActive" v-model="formData.isActive" class="w-4 h-4 text-orange rounded" />
              <label for="isActive" class="text-sm">上架顯示</label>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button @click="closeEditModal" class="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            取消
          </button>
          <button
            @click="saveLecturer"
            :disabled="saving"
            class="bg-orange text-white font-medium px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {{ saving ? '儲存中...' : '儲存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
