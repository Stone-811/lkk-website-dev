<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

useHead({
  title: '系統設定｜練健康後台',
})

const settings = ref({
  siteName: '練健康',
  siteUrl: 'https://l-kk.tw',
  contactEmail: 'info@l-kk.tw',
  contactPhone: '02-8914-6610',
  notificationEmails: 'admin@l-kk.tw, manager@l-kk.tw',
})

const isSaving = ref(false)

const handleSave = () => {
  isSaving.value = true
  setTimeout(() => {
    isSaving.value = false
    alert('設定已儲存（模擬）')
  }, 1000)
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">系統設定</h1>
      <p class="text-gray-500 mt-1">管理網站基本設定與通知設定</p>
    </div>

    <div class="max-w-2xl space-y-8">
      <!-- Basic Settings -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">基本設定</h2>

        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">網站名稱</label>
            <input
              v-model="settings.siteName"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange focus:border-orange transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">網站網址</label>
            <input
              v-model="settings.siteUrl"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange focus:border-orange transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">聯絡信箱</label>
            <input
              v-model="settings.contactEmail"
              type="email"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange focus:border-orange transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">聯絡電話</label>
            <input
              v-model="settings.contactPhone"
              type="tel"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange focus:border-orange transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">通知設定</h2>

        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              管理者通知信箱
              <span class="text-gray-400 font-normal">（多個信箱用逗號分隔）</span>
            </label>
            <textarea
              v-model="settings.notificationEmails"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange focus:border-orange transition-colors"
              placeholder="admin@l-kk.tw, manager@l-kk.tw"
            />
            <p class="text-sm text-gray-500 mt-2">
              表單提交時會寄送通知信到這些信箱
            </p>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button
          @click="handleSave"
          :disabled="isSaving"
          class="inline-flex items-center gap-2 bg-orange text-white font-medium px-6 py-2.5 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <svg v-if="isSaving" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? '儲存中...' : '儲存設定' }}
        </button>
      </div>
    </div>
  </div>
</template>
