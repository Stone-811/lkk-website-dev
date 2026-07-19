<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'LKK4 成績管理｜練健康後台',
})

const records = ref([
  { id: '1', year: 2025, name: '王大明', gender: '男', group: '長青混合組', teamName: '練健康A隊', finalScore: 95, rank: 1 },
  { id: '2', year: 2025, name: '林美玲', gender: '女', group: '長青混合組', teamName: '練健康A隊', finalScore: 82, rank: 2 },
  { id: '3', year: 2025, name: '張先生', gender: '男', group: '男子第一組', teamName: null, finalScore: 120, rank: 1 },
  { id: '4', year: 2024, name: '陳小姐', gender: '女', group: '女子第一組', teamName: '銀髮健身隊', finalScore: 75, rank: 3 },
])

const selectedYear = ref(2025)
const years = [2025, 2024, 2023, 2022]

const showImportModal = ref(false)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">LKK4 成績管理</h1>
        <p class="text-gray-500 mt-1">管理中高齡四項體能挑戰賽參賽成績</p>
      </div>
      <div class="flex items-center gap-3">
        <select
          v-model="selectedYear"
          class="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-white"
        >
          <option v-for="year in years" :key="year" :value="year">{{ year }} 年</option>
        </select>
        <button
          @click="showImportModal = true"
          class="inline-flex items-center gap-2 bg-orange text-white font-medium px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          匯入 CSV
        </button>
      </div>
    </div>

    <!-- Records Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">年度</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">姓名</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">性別</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">組別</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">隊伍</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">成績</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">名次</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="record in records.filter(r => r.year === selectedYear)" :key="record.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ record.year }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ record.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ record.gender }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ record.group }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ record.teamName || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-medium text-orange">{{ record.finalScore }} kg</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'text-xs font-bold px-2.5 py-1 rounded-full',
                  record.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                  record.rank === 2 ? 'bg-gray-200 text-gray-700' :
                  record.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ record.rank ? `#${record.rank}` : '-' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Import Modal Placeholder -->
    <div
      v-if="showImportModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="showImportModal = false"
    >
      <div class="bg-white rounded-xl max-w-lg w-full p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">匯入成績 CSV</h2>
        <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-gray-500 mb-2">拖放 CSV 檔案到此處</p>
          <p class="text-gray-400 text-sm">或點擊選擇檔案</p>
        </div>
        <p class="text-sm text-gray-500 mb-6">注意：匯入會覆蓋該年度所有既有資料</p>
        <div class="flex gap-3">
          <button
            @click="showImportModal = false"
            class="flex-1 bg-gray-100 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            class="flex-1 bg-orange text-white font-medium py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
          >
            開始匯入
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
