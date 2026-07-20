<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: '表單名單｜練健康後台',
})

interface Lead {
  id: string
  name: string
  type: 'booking' | 'franchise' | 'cooperation'
  phone: string
  email?: string
  storeId?: string
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
  internalNote?: string
  createdAt: string
  updatedAt?: string
}

const leads = ref<Lead[]>([])
const isLoading = ref(true)
const error = ref('')

const selectedType = ref('all')
const selectedStatus = ref('all')

// Fetch leads from API
async function fetchLeads() {
  isLoading.value = true
  error.value = ''
  try {
    const response = await $fetch<{ success: boolean; data: Lead[] }>('/api/admin/leads')
    if (response.success) {
      leads.value = response.data
    }
  } catch (e: any) {
    error.value = e.data?.message || '載入失敗'
    console.error('Error fetching leads:', e)
  } finally {
    isLoading.value = false
  }
}

// Update lead status
async function updateStatus(lead: Lead, newStatus: string) {
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
  cooperation: '合作洽詢',
}

const typeColors: Record<string, string> = {
  booking: 'bg-blue-100 text-blue-700',
  franchise: 'bg-purple-100 text-purple-700',
  cooperation: 'bg-green-100 text-green-700',
}

const statusLabels: Record<string, string> = {
  new: '新名單',
  contacted: '已聯繫',
  scheduled: '已預約',
  completed: '已完成',
  cancelled: '已取消',
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  scheduled: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-600',
}

const filteredLeads = computed(() => {
  return leads.value.filter(lead => {
    if (selectedType.value !== 'all' && lead.type !== selectedType.value) return false
    if (selectedStatus.value !== 'all' && lead.status !== selectedStatus.value) return false
    return true
  })
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">表單名單</h1>
        <p class="text-gray-500 mt-1">管理預約體驗、加盟洽詢與合作洽詢名單</p>
      </div>
      <button
        class="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        匯出 CSV
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-6">
      <select
        v-model="selectedType"
        class="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white"
      >
        <option value="all">所有類型</option>
        <option value="booking">預約體驗</option>
        <option value="franchise">加盟洽詢</option>
        <option value="cooperation">合作洽詢</option>
      </select>
      <select
        v-model="selectedStatus"
        class="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white"
      >
        <option value="all">所有狀態</option>
        <option value="new">新名單</option>
        <option value="contacted">已聯繫</option>
        <option value="scheduled">已預約</option>
        <option value="completed">已完成</option>
        <option value="cancelled">已取消</option>
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

    <!-- Leads Table -->
    <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">姓名</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">類型</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">電話</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">狀態</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">時間</th>
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
                @change="updateStatus(lead, ($event.target).value)"
                :class="[statusColors[lead.status], 'text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer']"
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
              <button class="text-orange hover:text-orange-600 font-medium text-sm">
                查看詳情
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
