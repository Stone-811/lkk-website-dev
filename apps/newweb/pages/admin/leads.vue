<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: '客戶預約｜練健康後台',
})

interface Lead {
  id: string
  name: string
  type: 'booking' | 'franchise'
  phone: string
  email?: string
  storeId?: string
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
  internalNote?: string
  message?: string
  payload?: Record<string, any>
  createdAt: string
  updatedAt?: string
}

const leads = ref<Lead[]>([])
const isLoading = ref(true)
const error = ref('')

const selectedType = ref('all')
const selectedStatus = ref('all')
const searchQuery = ref('')
const sortBy = ref<'createdAt' | 'name' | 'type' | 'status'>('createdAt')
const sortDir = ref<'asc' | 'desc'>('desc')

function toggleSort(column: 'createdAt' | 'name' | 'type' | 'status') {
  if (sortBy.value === column) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDir.value = column === 'createdAt' ? 'desc' : 'asc'
  }
}

// Detail modal
const selectedLead = ref<Lead | null>(null)
const noteText = ref('')
const saving = ref(false)

// Fetch leads from API (only booking and franchise types)
async function fetchLeads() {
  isLoading.value = true
  error.value = ''
  try {
    const response = await $fetch<{ success: boolean; data: Lead[] }>('/api/admin/leads')
    if (response.success) {
      // Filter out cooperation type - only show booking and franchise
      leads.value = response.data.filter(lead => lead.type !== 'cooperation')
    }
  } catch (e: any) {
    error.value = e.data?.message || '載入失敗'
    console.error('Error fetching leads:', e)
  } finally {
    isLoading.value = false
  }
}

// Update lead status
async function updateStatus(lead: Lead, event: Event) {
  const target = event.target as HTMLSelectElement
  const newStatus = target.value
  try {
    await $fetch(`/api/admin/leads/${lead.id}`, {
      method: 'PATCH',
      body: { status: newStatus },
    })
    lead.status = newStatus as Lead['status']
  } catch (e: any) {
    alert(e.data?.message || '更新失敗')
  }
}

onMounted(fetchLeads)

const typeLabels: Record<string, string> = {
  booking: '預約體驗',
  franchise: '加盟洽詢',
}

const typeColors: Record<string, string> = {
  booking: 'bg-blue-100 text-blue-700',
  franchise: 'bg-purple-100 text-purple-700',
}

const statusLabels: Record<string, { label: string; class: string }> = {
  new: { label: '新名單', class: 'bg-blue-100 text-blue-700' },
  contacted: { label: '已聯繫', class: 'bg-yellow-100 text-yellow-700' },
  scheduled: { label: '已預約', class: 'bg-purple-100 text-purple-700' },
  completed: { label: '已完成', class: 'bg-green-100 text-green-700' },
  cancelled: { label: '已取消', class: 'bg-gray-100 text-gray-600' },
}

const filteredLeads = computed(() => {
  let result = leads.value.filter(lead => {
    if (selectedType.value !== 'all' && lead.type !== selectedType.value) return false
    if (selectedStatus.value !== 'all' && lead.status !== selectedStatus.value) return false
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return (
        lead.name.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        (lead.email && lead.email.toLowerCase().includes(query))
      )
    }
    return true
  })

  // Sort
  result.sort((a, b) => {
    let comparison = 0
    if (sortBy.value === 'name') {
      comparison = a.name.localeCompare(b.name)
    } else if (sortBy.value === 'type') {
      comparison = a.type.localeCompare(b.type)
    } else if (sortBy.value === 'status') {
      comparison = a.status.localeCompare(b.status)
    } else {
      // createdAt
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      comparison = dateA - dateB
    }
    return sortDir.value === 'desc' ? -comparison : comparison
  })

  return result
})

function openDetail(lead: Lead) {
  selectedLead.value = lead
  noteText.value = lead.internalNote || ''
}

function closeDetail() {
  selectedLead.value = null
}

async function handleSaveNote() {
  if (!selectedLead.value) return
  saving.value = true
  try {
    await $fetch(`/api/admin/leads/${selectedLead.value.id}`, {
      method: 'PATCH',
      body: { internalNote: noteText.value },
    })
    const lead = leads.value.find(l => l.id === selectedLead.value?.id)
    if (lead) lead.internalNote = noteText.value
    selectedLead.value.internalNote = noteText.value
    alert('備註已儲存')
  } catch (e: any) {
    alert(e.data?.message || '儲存失敗')
  } finally {
    saving.value = false
  }
}

function handleExport() {
  const headers = ['姓名', '電話', 'Email', '類型', '狀態', '門店', '備註', '建立時間']
  const rows = filteredLeads.value.map(lead => [
    lead.name,
    lead.phone,
    lead.email || '',
    typeLabels[lead.type] || lead.type,
    statusLabels[lead.status]?.label || lead.status,
    lead.storeId || '',
    lead.internalNote || '',
    lead.createdAt ? new Date(lead.createdAt).toLocaleString('zh-TW') : '',
  ])

  const csvContent =
    '\uFEFF' +
    [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">客戶預約</h1>
        <p class="text-gray-500 mt-1">管理預約體驗與加盟洽詢名單</p>
      </div>
      <button
        @click="handleExport"
        class="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        匯出 CSV
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜尋姓名、電話、Email..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
            />
          </div>
        </div>

        <!-- Filter by type -->
        <select
          v-model="selectedType"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
        >
          <option value="all">所有類型</option>
          <option value="booking">預約體驗</option>
          <option value="franchise">加盟洽詢</option>
        </select>

        <!-- Filter by status -->
        <select
          v-model="selectedStatus"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
        >
          <option value="all">所有狀態</option>
          <option value="new">新名單</option>
          <option value="contacted">已聯繫</option>
          <option value="scheduled">已預約</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>

        <!-- Results count -->
        <div class="text-sm text-gray-500">
          共 {{ filteredLeads.length }} 筆
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
    </div>

    <!-- Leads Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              @click="toggleSort('name')"
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center gap-1">
                姓名
                <svg v-if="sortBy === 'name'" class="w-3 h-3" :class="sortDir === 'desc' ? 'rotate-180' : ''" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </th>
            <th
              @click="toggleSort('type')"
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center gap-1">
                類型
                <svg v-if="sortBy === 'type'" class="w-3 h-3" :class="sortDir === 'desc' ? 'rotate-180' : ''" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">電話</th>
            <th
              @click="toggleSort('status')"
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center gap-1">
                狀態
                <svg v-if="sortBy === 'status'" class="w-3 h-3" :class="sortDir === 'desc' ? 'rotate-180' : ''" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </th>
            <th
              @click="toggleSort('createdAt')"
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center gap-1">
                時間
                <svg v-if="sortBy === 'createdAt'" class="w-3 h-3" :class="sortDir === 'desc' ? 'rotate-180' : ''" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </th>
            <th class="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="filteredLeads.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500">尚無名單資料</td>
          </tr>
          <tr v-for="lead in filteredLeads" :key="lead.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">{{ lead.name }}</div>
              <div v-if="lead.email" class="text-sm text-gray-500">{{ lead.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[typeColors[lead.type], 'text-xs font-medium px-2.5 py-1 rounded-full']">
                {{ typeLabels[lead.type] }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ lead.phone }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select
                :value="lead.status"
                @change="updateStatus(lead, $event)"
                :class="[statusLabels[lead.status]?.class || 'bg-gray-100 text-gray-600', 'text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer']"
              >
                <option value="new">新名單</option>
                <option value="contacted">已聯繫</option>
                <option value="scheduled">已預約</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
              {{ lead.createdAt ? new Date(lead.createdAt).toLocaleString('zh-TW') : '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button
                @click="openDetail(lead)"
                class="text-orange hover:text-orange-600 font-medium text-sm"
              >
                查看詳情
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="selectedLead"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeDetail"
    >
      <div class="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900">
            {{ selectedLead.type === 'booking' ? '預約體驗詳情' : '加盟洽詢詳情' }}
          </h2>
          <button @click="closeDetail" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <p class="text-sm text-gray-500">類型</p>
              <span :class="[typeColors[selectedLead.type], 'text-sm font-medium px-2.5 py-1 rounded-full']">
                {{ typeLabels[selectedLead.type] }}
              </span>
            </div>
            <div>
              <p class="text-sm text-gray-500">姓名</p>
              <p class="font-medium">{{ selectedLead.name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">電話</p>
              <p class="font-medium">{{ selectedLead.phone }}</p>
            </div>
            <div v-if="selectedLead.email">
              <p class="text-sm text-gray-500">Email</p>
              <p class="font-medium">{{ selectedLead.email }}</p>
            </div>
            <div v-if="selectedLead.storeId">
              <p class="text-sm text-gray-500">門店</p>
              <p class="font-medium">{{ selectedLead.storeId }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">狀態</p>
              <span :class="[statusLabels[selectedLead.status]?.class || 'bg-gray-100 text-gray-600', 'text-sm font-medium px-2.5 py-1 rounded-full']">
                {{ statusLabels[selectedLead.status]?.label || selectedLead.status }}
              </span>
            </div>
            <div>
              <p class="text-sm text-gray-500">建立時間</p>
              <p class="font-medium">{{ selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleString('zh-TW') : '-' }}</p>
            </div>

            <!-- Booking specific fields -->
            <template v-if="selectedLead.type === 'booking' && selectedLead.payload">
              <div v-if="selectedLead.payload.gender">
                <p class="text-sm text-gray-500">性別</p>
                <p class="font-medium">{{ selectedLead.payload.gender }}</p>
              </div>
              <div v-if="selectedLead.payload.age">
                <p class="text-sm text-gray-500">年齡</p>
                <p class="font-medium">{{ selectedLead.payload.age }}</p>
              </div>
              <div v-if="selectedLead.payload.goal" class="col-span-2">
                <p class="text-sm text-gray-500">運動目標</p>
                <p class="font-medium">{{ selectedLead.payload.goal }}</p>
              </div>
              <div v-if="selectedLead.payload.preferredTime" class="col-span-2">
                <p class="text-sm text-gray-500">偏好時段</p>
                <p class="font-medium">{{ selectedLead.payload.preferredTime }}</p>
              </div>
              <div v-if="selectedLead.payload.source" class="col-span-2">
                <p class="text-sm text-gray-500">來源</p>
                <p class="font-medium">{{ selectedLead.payload.source }}</p>
              </div>
            </template>

            <!-- Franchise specific fields -->
            <template v-if="selectedLead.type === 'franchise' && selectedLead.payload">
              <div v-if="selectedLead.payload.organization" class="col-span-2">
                <p class="text-sm text-gray-500">公司/單位</p>
                <p class="font-medium">{{ selectedLead.payload.organization }}</p>
              </div>
              <div v-if="selectedLead.payload.region">
                <p class="text-sm text-gray-500">目標區域</p>
                <p class="font-medium">{{ selectedLead.payload.region }}</p>
              </div>
              <div v-if="selectedLead.payload.cooperationType">
                <p class="text-sm text-gray-500">合作類型</p>
                <p class="font-medium">{{ selectedLead.payload.cooperationType }}</p>
              </div>
            </template>
          </div>

          <div v-if="selectedLead.message" class="col-span-2">
            <p class="text-sm text-gray-500">留言/備註</p>
            <p class="mt-1 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">{{ selectedLead.message }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-500 mb-2">內部備註</p>
            <textarea
              v-model="noteText"
              rows="3"
              placeholder="新增內部備註..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
            />
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button @click="closeDetail" class="bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            關閉
          </button>
          <button
            @click="handleSaveNote"
            :disabled="saving"
            class="bg-orange text-white font-medium px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {{ saving ? '儲存中...' : '儲存備註' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
