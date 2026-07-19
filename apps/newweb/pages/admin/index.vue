<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: '儀表板｜練健康後台',
})

const stats = [
  { label: '總門店數', value: '4', change: '+0%', icon: 'store' },
  { label: '總教練數', value: '12', change: '+2', icon: 'people' },
  { label: '本月名單', value: '48', change: '+15%', icon: 'mail' },
  { label: 'LKK4 選手', value: '156', change: '+23', icon: 'trophy' },
]

const recentLeads = [
  { name: '王小明', type: '預約體驗', store: '新店七張店', time: '2 小時前', status: 'new' },
  { name: '林美玲', type: '加盟洽詢', store: '-', time: '5 小時前', status: 'contacted' },
  { name: '張先生', type: '合作洽詢', store: '-', time: '昨天', status: 'new' },
  { name: '陳小姐', type: '預約體驗', store: '南京復興店', time: '昨天', status: 'scheduled' },
  { name: '李大華', type: '預約體驗', store: '松江南京店', time: '2 天前', status: 'completed' },
]

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  scheduled: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
}

const statusLabels: Record<string, string> = {
  new: '新名單',
  contacted: '已聯繫',
  scheduled: '已預約',
  completed: '已完成',
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">儀表板</h1>
      <p class="text-gray-500 mt-1">歡迎回來，這是您的經營概況。</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-500 text-sm">{{ stat.label }}</span>
          <span
            :class="[
              'text-xs font-medium px-2 py-1 rounded',
              stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            ]"
          >
            {{ stat.change }}
          </span>
        </div>
        <div class="text-3xl font-bold text-gray-900">{{ stat.value }}</div>
      </div>
    </div>

    <!-- Recent Leads -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900">最新名單</h2>
          <NuxtLink
            to="/admin/leads"
            class="text-sm text-orange hover:text-orange-600 font-medium"
          >
            查看全部 →
          </NuxtLink>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">姓名</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">類型</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">門店</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">時間</th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">狀態</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="lead in recentLeads" :key="lead.name" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-medium text-gray-900">{{ lead.name }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ lead.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ lead.store }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">{{ lead.time }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[statusColors[lead.status], 'text-xs font-medium px-2.5 py-1 rounded-full']">
                  {{ statusLabels[lead.status] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
