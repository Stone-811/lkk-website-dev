<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: '教練管理｜練健康後台',
})

interface Coach {
  id: string
  name: string
  slug?: string
  photo?: string
  roleTitle?: string
  storeId?: string
  store?: { id: string; name: string; slug: string }
  specialties?: string[]
  certifications?: string[]
  experiences?: string[]
  education?: string | string[]
  description?: string
  sortOrder?: number
  isActive: boolean
}

interface StoreOption {
  value: string
  label: string
}

const coaches = ref<Coach[]>([])
const storeOptions = ref<StoreOption[]>([])
const isLoading = ref(true)
const error = ref('')

// Edit modal
const showEditModal = ref(false)
const editingCoach = ref<Coach | null>(null)
const saving = ref(false)

const formData = ref({
  name: '',
  slug: '',
  roleTitle: '',
  storeId: '',
  education: '',
  description: '',
  sortOrder: 0,
  isActive: true,
  specialties: [] as string[],
  certifications: [] as string[],
})

const newSpecialty = ref('')
const newCertification = ref('')

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

// Fetch stores for dropdown
async function fetchStores() {
  try {
    const response = await $fetch<{ success: boolean; data: any[] }>('/api/public/stores')
    if (response.success) {
      storeOptions.value = response.data.map(s => ({ value: s.id, label: s.name }))
    }
  } catch (e) {
    console.error('Error fetching stores:', e)
  }
}

function openEditModal(coach?: Coach) {
  if (coach) {
    editingCoach.value = coach
    const edu = coach.education
    formData.value = {
      name: coach.name || '',
      slug: coach.slug || '',
      roleTitle: coach.roleTitle || '',
      storeId: coach.storeId || '',
      education: Array.isArray(edu) ? edu.join(', ') : (edu || ''),
      description: coach.description || '',
      sortOrder: coach.sortOrder || 0,
      isActive: coach.isActive ?? true,
      specialties: [...(coach.specialties || [])],
      certifications: [...(coach.certifications || [])],
    }
  } else {
    editingCoach.value = null
    formData.value = {
      name: '',
      slug: '',
      roleTitle: '',
      storeId: '',
      education: '',
      description: '',
      sortOrder: 0,
      isActive: true,
      specialties: [],
      certifications: [],
    }
  }
  newSpecialty.value = ''
  newCertification.value = ''
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingCoach.value = null
}

function generateSlug(name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return slug.length < 2 ? `coach-${Date.now().toString(36)}` : slug
}

function addToArray(field: 'specialties' | 'certifications', value: string) {
  if (value.trim()) {
    formData.value[field].push(value.trim())
  }
}

function removeFromArray(field: 'specialties' | 'certifications', index: number) {
  formData.value[field].splice(index, 1)
}

async function saveCoach() {
  if (!formData.value.name || !formData.value.storeId) {
    alert('請填寫必填欄位')
    return
  }

  saving.value = true
  try {
    const isNew = !editingCoach.value
    const url = isNew ? '/api/admin/coaches' : `/api/admin/coaches/${editingCoach.value!.id}`
    const method = isNew ? 'POST' : 'PATCH'

    const slug = formData.value.slug || generateSlug(formData.value.name)
    const payload = {
      ...formData.value,
      slug,
      education: formData.value.education ? formData.value.education.split(',').map(s => s.trim()).filter(Boolean) : [],
    }

    const response = await $fetch<{ success: boolean; error?: string }>(url, {
      method,
      body: payload,
    })

    if (response.success) {
      await fetchCoaches()
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

onMounted(() => {
  fetchCoaches()
  fetchStores()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">教練管理</h1>
        <p class="text-gray-500 mt-1">管理所有教練資訊與專長</p>
      </div>
      <button
        @click="openEditModal()"
        class="inline-flex items-center gap-2 bg-orange text-white font-medium px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增教練
      </button>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">{{ error }}</div>

    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
    </div>

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
                <img v-if="coach.photo" :src="coach.photo" :alt="coach.name" class="w-10 h-10 rounded-full object-cover" />
                <div v-else class="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-bold">{{ coach.name?.charAt(0) }}</div>
                <span class="font-medium text-gray-900">{{ coach.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ coach.store?.name || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ coach.roleTitle || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="toggleActive(coach)" :class="['text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer hover:opacity-80', coach.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">
                {{ coach.isActive ? '啟用中' : '已停用' }}
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="openEditModal(coach)" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg" title="編輯">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button @click="deleteCoach(coach)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="刪除">
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

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="closeEditModal">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 class="text-xl font-bold text-gray-900">{{ editingCoach ? '編輯教練' : '新增教練' }}</h2>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">姓名 <span class="text-red-500">*</span></label>
              <input type="text" v-model="formData.name" class="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">職稱</label>
              <input type="text" v-model="formData.roleTitle" class="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="例如：資深教練" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">所屬門店 <span class="text-red-500">*</span></label>
              <select v-model="formData.storeId" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">請選擇</option>
                <option v-for="opt in storeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">排序</label>
              <input type="number" v-model.number="formData.sortOrder" class="w-full border border-gray-300 rounded-lg px-3 py-2" min="0" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">學歷</label>
            <input type="text" v-model="formData.education" class="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="多筆請用逗號分隔" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">簡介</label>
            <textarea v-model="formData.description" class="w-full border border-gray-300 rounded-lg px-3 py-2" rows="2"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">專長</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-for="(s, i) in formData.specialties" :key="i" class="inline-flex items-center gap-1 bg-navy/10 text-navy px-2 py-1 rounded-full text-sm">
                {{ s }}<button type="button" @click="removeFromArray('specialties', i)" class="hover:text-red-500">×</button>
              </span>
            </div>
            <div class="flex gap-2">
              <input type="text" v-model="newSpecialty" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="輸入專長" @keydown.enter.prevent="addToArray('specialties', newSpecialty); newSpecialty = ''" />
              <button type="button" @click="addToArray('specialties', newSpecialty); newSpecialty = ''" class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200">新增</button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">證照</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-for="(c, i) in formData.certifications" :key="i" class="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                {{ c }}<button type="button" @click="removeFromArray('certifications', i)" class="hover:text-red-500">×</button>
              </span>
            </div>
            <div class="flex gap-2">
              <input type="text" v-model="newCertification" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="輸入證照" @keydown.enter.prevent="addToArray('certifications', newCertification); newCertification = ''" />
              <button type="button" @click="addToArray('certifications', newCertification); newCertification = ''" class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200">新增</button>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="coachIsActive" v-model="formData.isActive" class="w-4 h-4 text-orange rounded" />
            <label for="coachIsActive" class="text-sm">上架顯示</label>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button @click="closeEditModal" class="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-200">取消</button>
          <button @click="saveCoach" :disabled="saving" class="bg-orange text-white font-medium px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50">
            {{ saving ? '儲存中...' : '儲存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
