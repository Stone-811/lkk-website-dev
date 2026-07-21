<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
  googleMapUrl?: string
  businessHours?: any
  sortOrder?: number
  isActive: boolean
  coachCount?: number
}

const stores = ref<Store[]>([])
const isLoading = ref(true)
const error = ref('')

// Edit modal
const showEditModal = ref(false)
const editingStore = ref<Store | null>(null)
const saving = ref(false)

const cityOptions = ['台北市', '新北市', '桃園市', '新竹市', '新竹縣', '台中市', '台南市', '高雄市']

const formData = ref({
  name: '',
  slug: '',
  city: '',
  district: '',
  address: '',
  phone: '',
  googleMapUrl: '',
  sortOrder: 0,
  isActive: true,
})

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

function openEditModal(store?: Store) {
  if (store) {
    editingStore.value = store
    formData.value = {
      name: store.name || '',
      slug: store.slug || '',
      city: store.city || '',
      district: store.district || '',
      address: store.address || '',
      phone: store.phone || '',
      googleMapUrl: store.googleMapUrl || '',
      sortOrder: store.sortOrder || 0,
      isActive: store.isActive ?? true,
    }
  } else {
    editingStore.value = null
    const maxSortOrder = stores.value.length > 0 ? Math.max(...stores.value.map(s => s.sortOrder || 0)) : 0
    formData.value = {
      name: '',
      slug: '',
      city: '',
      district: '',
      address: '',
      phone: '',
      googleMapUrl: '',
      sortOrder: maxSortOrder + 1,
      isActive: true,
    }
  }
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingStore.value = null
}

async function saveStore() {
  if (!formData.value.name || !formData.value.slug) {
    alert('請填寫必填欄位')
    return
  }

  saving.value = true
  try {
    const isNew = !editingStore.value
    const url = isNew ? '/api/admin/stores' : `/api/admin/stores/${editingStore.value!.id}`
    const method = isNew ? 'POST' : 'PATCH'

    const response = await $fetch<{ success: boolean; data?: Store; error?: string }>(url, {
      method,
      body: formData.value,
    })

    if (response.success) {
      await fetchStores()
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

function generateSlug(name: string): string {
  const mapping: Record<string, string> = {
    '台北': 'taipei', '新北': 'newtaipei', '新竹': 'hsinchu',
    '台中': 'taichung', '台南': 'tainan', '高雄': 'kaohsiung',
    '南京': 'nanjing', '松江': 'songjiang', '西門': 'ximending',
    '新店': 'xindian', '七張': 'qizhang', '民生': 'minsheng', '店': '',
  }
  let slug = name.toLowerCase()
  Object.entries(mapping).forEach(([zh, en]) => {
    slug = slug.replace(zh, en)
  })
  return slug.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function handleNameChange() {
  if (!editingStore.value) {
    formData.value.slug = generateSlug(formData.value.name)
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
        @click="openEditModal()"
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
            <button
              @click="openEditModal(store)"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="編輯"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
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

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="closeEditModal"
    >
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 class="text-xl font-bold text-gray-900">
            {{ editingStore ? '編輯門店' : '新增門店' }}
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
              <label class="block text-sm font-medium mb-1">門店名稱 <span class="text-red-500">*</span></label>
              <input
                type="text"
                v-model="formData.name"
                @input="handleNameChange"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="例如：台北南京店"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">網址代稱 <span class="text-red-500">*</span></label>
              <input
                type="text"
                v-model="formData.slug"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="taipei-nanjing"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">縣市</label>
              <select v-model="formData.city" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">請選擇</option>
                <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">區域</label>
              <input
                type="text"
                v-model="formData.district"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="例如：松山區"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">詳細地址</label>
            <input
              type="text"
              v-model="formData.address"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="例如：南京東路四段 123 號 2 樓"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">電話</label>
              <input
                type="tel"
                v-model="formData.phone"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="(02) 2712-3456"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">排序</label>
              <input
                type="number"
                v-model.number="formData.sortOrder"
                class="w-full border border-gray-300 rounded-lg px-3 py-2"
                min="0"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Google Maps 連結</label>
            <input
              type="url"
              v-model="formData.googleMapUrl"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" id="isActive" v-model="formData.isActive" class="w-4 h-4 text-orange rounded" />
            <label for="isActive" class="text-sm">上架顯示</label>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button @click="closeEditModal" class="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            取消
          </button>
          <button
            @click="saveStore"
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
