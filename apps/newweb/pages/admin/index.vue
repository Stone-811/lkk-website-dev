<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: '儀表板｜練健康後台',
})

// Stats cards matching Next.js version
const stats = [
  { label: '本月新名單', value: '48', href: '/admin/leads' },
  { label: '待處理名單', value: '12', href: '/admin/leads?status=new' },
  { label: '本月預約', value: '35', href: '/admin/leads?type=booking' },
  { label: '門店數', value: '4', href: '/admin/stores' },
]

const recentLeads = [
  { name: '王小明', phone: '0912-XXX-345', type: '預約體驗', store: '新店七張店', time: '2024/07/20 14:30', status: 'new' },
  { name: '林美玲', phone: '0923-XXX-678', type: '加盟洽詢', store: '-', time: '2024/07/20 10:15', status: 'contacted' },
  { name: '張先生', phone: '0934-XXX-901', type: '合作洽詢', store: '-', time: '2024/07/19 16:45', status: 'new' },
  { name: '陳小姐', phone: '0945-XXX-234', type: '預約體驗', store: '南京店', time: '2024/07/19 09:20', status: 'scheduled' },
  { name: '李大華', phone: '0956-XXX-567', type: '預約體驗', store: '松江店', time: '2024/07/18 11:00', status: 'completed' },
]

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  scheduled: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
  new: '新名單',
  contacted: '已聯繫',
  scheduled: '已預約',
  completed: '已完成',
  cancelled: '已取消',
}

// Quick actions
const quickActions = [
  {
    name: '新增門店',
    desc: '建立新的門店資料',
    href: '/admin/stores',
    iconBg: 'bg-navy-700/10',
    iconColor: 'text-navy-700',
    icon: 'plus',
  },
  {
    name: '新增教練',
    desc: '建立新的教練資料',
    href: '/admin/coaches',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    icon: 'user-plus',
  },
  {
    name: '匯出名單',
    desc: '下載 CSV 報表',
    href: '/admin/leads',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: 'download',
  },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">儀表板</h1>
      <p class="text-gray-500 mt-1">歡迎回來，以下是今日摘要</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.href"
        class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <p class="text-sm text-gray-500">{{ stat.label }}</p>
        <div class="flex items-end justify-between mt-2">
          <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Recent Leads -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="font-semibold text-gray-900">最新名單</h2>
        <NuxtLink
          to="/admin/leads"
          class="text-sm text-navy-700 hover:text-navy-800 font-medium"
        >
          查看全部 →
        </NuxtLink>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">姓名</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">電話</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">類型</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">門店</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">狀態</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">建立時間</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="lead in recentLeads" :key="lead.name" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-medium text-gray-900">{{ lead.name }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ lead.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ lead.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ lead.store }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[statusColors[lead.status], 'text-xs font-medium px-2.5 py-1 rounded-full']">
                  {{ statusLabels[lead.status] }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">{{ lead.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.name"
        :to="action.href"
        class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow flex items-center gap-4"
      >
        <div :class="[action.iconBg, 'w-12 h-12 rounded-lg flex items-center justify-center']">
          <!-- Plus Icon -->
          <svg v-if="action.icon === 'plus'" :class="[action.iconColor, 'w-6 h-6']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <!-- User Plus Icon -->
          <svg v-else-if="action.icon === 'user-plus'" :class="[action.iconColor, 'w-6 h-6']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <!-- Download Icon -->
          <svg v-else-if="action.icon === 'download'" :class="[action.iconColor, 'w-6 h-6']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p class="font-medium text-gray-900">{{ action.name }}</p>
          <p class="text-sm text-gray-500">{{ action.desc }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
