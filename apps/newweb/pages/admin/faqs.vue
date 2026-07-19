<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'FAQ 管理｜練健康後台',
})

const faqs = ref([
  { id: '1', question: '第一次來要做什麼嗎？', category: '預約體驗', isActive: true },
  { id: '2', question: '課程內容是什麼？', category: '課程相關', isActive: true },
  { id: '3', question: '教練有什麼專業背景？', category: '教練相關', isActive: true },
  { id: '4', question: '一堂課多久？費用怎麼算？', category: '費用相關', isActive: true },
  { id: '5', question: '有年齡限制嗎？', category: '預約體驗', isActive: true },
])

const showAddModal = ref(false)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">FAQ 管理</h1>
        <p class="text-gray-500 mt-1">管理網站常見問題與解答</p>
      </div>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center gap-2 bg-orange text-white font-medium px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        新增 FAQ
      </button>
    </div>

    <!-- FAQs List -->
    <div class="space-y-4">
      <div
        v-for="faq in faqs"
        :key="faq.id"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                {{ faq.category }}
              </span>
              <span
                :class="[
                  'text-xs font-medium px-2.5 py-1 rounded-full',
                  faq.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ faq.isActive ? '顯示中' : '已隱藏' }}
              </span>
            </div>
            <h3 class="text-lg font-medium text-gray-900">{{ faq.question }}</h3>
          </div>

          <div class="flex items-center gap-2 ml-4">
            <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
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
        <h2 class="text-xl font-bold text-gray-900 mb-4">新增 FAQ</h2>
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
