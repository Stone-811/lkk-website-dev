<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'LKK4 成績管理｜練健康後台',
})

const csvData = ref('')
const isImporting = ref(false)
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null)

function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    const text = event.target?.result as string
    // Remove BOM if present
    const cleanText = text.replace(/^\uFEFF/, '')
    csvData.value = cleanText
    message.value = { type: 'success', text: `已載入：${file.name}` }
  }
  reader.onerror = () => {
    message.value = { type: 'error', text: '檔案讀取失敗' }
  }
  reader.readAsText(file, 'UTF-8')
}

async function handleImport() {
  if (!csvData.value.trim()) {
    message.value = { type: 'error', text: '請先上傳 CSV 檔案' }
    return
  }

  isImporting.value = true
  message.value = null

  try {
    const res = await $fetch<{ success: boolean; message: string }>('/api/admin/lkk4-records/import', {
      method: 'POST',
      body: { csvData: csvData.value },
    })

    message.value = { type: 'success', text: res.message }
    csvData.value = ''
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  } catch (error: any) {
    message.value = {
      type: 'error',
      text: error.data?.message || '匯入失敗',
    }
  } finally {
    isImporting.value = false
  }
}

function clearData() {
  csvData.value = ''
  message.value = null
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

// Preview first few rows
const previewRows = computed(() => {
  return csvData.value ? csvData.value.split('\n').slice(0, 4) : []
})
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Page Header -->
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-gray-900">LKK4 成績管理</h1>
      <p class="text-gray-500 text-sm">上傳 CSV 檔案匯入成績，匯入時會自動覆蓋舊資料</p>
    </div>

    <!-- Main Content -->
    <div class="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
      <div class="flex-1 flex flex-col gap-4">
        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            選擇 CSV 檔案
          </label>
          <input
            type="file"
            accept=".csv"
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-navy file:text-white
              hover:file:bg-navy-600
              file:cursor-pointer"
          />
        </div>

        <!-- Message -->
        <div
          v-if="message"
          :class="[
            'p-3 rounded-lg text-sm',
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          ]"
        >
          {{ message.text }}
        </div>

        <!-- Preview -->
        <div v-if="previewRows.length > 0" class="flex-1 min-h-0">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            資料預覽
          </label>
          <div class="bg-gray-50 rounded-lg p-3 h-32 overflow-auto">
            <pre class="text-xs text-gray-600 whitespace-pre-wrap">{{ previewRows.join('\n') }}</pre>
          </div>
        </div>
      </div>

      <!-- Import Button -->
      <div class="mt-4 flex gap-3">
        <button
          @click="handleImport"
          :disabled="isImporting || !csvData.trim()"
          class="inline-flex items-center gap-2 bg-orange text-white font-medium px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <template v-if="isImporting">
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            匯入中...
          </template>
          <template v-else>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            匯入並覆蓋
          </template>
        </button>

        <button
          v-if="csvData.trim()"
          @click="clearData"
          class="bg-gray-100 text-gray-700 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
        >
          清除
        </button>
      </div>
    </div>
  </div>
</template>
