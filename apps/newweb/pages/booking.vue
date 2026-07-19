<script setup lang="ts">
useHead({
  title: '預約體驗 | 練健康',
  meta: [
    { name: 'description', content: '預約練健康首次體驗課程。50 歲以上完全免費，一般首次體驗 $500。由物理治療師背景教練帶領，安全有效。' }
  ]
})

const stores = [
  { id: 'nanjing', name: '南京店', address: '台北市中山區南京東路三段 29 號 B1', phone: '(02) 2507-4196' },
  { id: 'songjiang', name: '松江店', address: '台北市中山區松江路 122 號 B1', phone: '(02) 2537-1055' },
  { id: 'ximending', name: '西門店', address: '台北市中正區寶慶路 39 號', phone: '(02) 2370-3245' },
  { id: 'xindian', name: '新店七張店', address: '新北市新店區北新路二段 252 號 B1-2', phone: '(02) 8914-6428' },
]

const faqs = [
  { q: '我年紀這麼大，可以練嗎？', a: '練健康 70% 的學員都是中高齡族群，90 歲阿嬤都在這裡練硬舉。' },
  { q: '我從來沒運動過？', a: '沒運動習慣的人反而容易進步，教練會從最基礎教起。' },
  { q: '有慢性病可以來嗎？', a: '可以。由物理治療師督導，會先評估再設計適合的課表。' },
  { q: '一定要買課嗎？', a: '不強迫。體驗課的目的是讓雙方了解彼此，你自己決定。' },
]

const cases = [
  { name: '林阿嬤', info: '70歲・膝關節退化', quote: '以前膝蓋痛到走不了路，現在可以自己爬山、帶孫子去公園。' },
  { name: '王先生', info: '62歲・腦中風後', quote: '以為這輩子就這樣了，沒想到可以自己走路去買東西。' },
  { name: '陳小姐', info: '55歲・乳癌術後', quote: '醫生說我的恢復狀況比預期好很多。' },
]

const steps = [
  { title: '填寫預約表單', desc: '約 1~2 分鐘完成，只填必要資訊' },
  { title: '教練主動電話聯繫', desc: '1 個工作天內，我們會打電話給您安排時間' },
  { title: '到店體驗課（60–75 分鐘）', desc: '身體評估 + 基礎動作訓練 + 教練諮詢', badges: ['50歲以上 免費', '一般首次 $500'] },
  { title: '課後說明 + 你自己決定', desc: '教練說明適合的後續課程選項，沒有壓力' },
]

const whatYouGet = [
  '身體素質・活動度・肌力 全面檢測',
  '核心啟動與基礎重訓教學',
  '客製化訓練動作指導',
  '訓練目標評估與規劃建議',
]

// Form state
const formData = reactive({
  name: '',
  phone: '',
  gender: '',
  birthDate: '',
  email: '',
  storeId: '',
  paymentMethod: '',
  message: '',
})

const isSubmitting = ref(false)
const isSuccess = ref(false)
const errors = ref<Record<string, string>>({})

const validateForm = () => {
  const newErrors: Record<string, string> = {}
  if (!formData.name.trim()) newErrors.name = '請輸入姓名'
  if (!formData.phone.trim()) newErrors.phone = '請輸入手機號碼'
  if (formData.phone && !/^09\d{8}$/.test(formData.phone)) newErrors.phone = '請輸入有效的手機號碼'
  if (!formData.gender) newErrors.gender = '請選擇性別'
  if (!formData.birthDate) newErrors.birthDate = '請選擇出生年月日'
  if (!formData.email.trim()) newErrors.email = '請輸入 Email'
  if (!formData.storeId) newErrors.storeId = '請選擇門店'
  if (!formData.paymentMethod) newErrors.paymentMethod = '請選擇付款方式'
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  isSubmitting.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  isSuccess.value = true
  isSubmitting.value = false
}
</script>

<template>
  <div class="min-h-screen bg-cream-100">
    <!-- Hero -->
    <section class="relative bg-navy-700 pt-16 overflow-hidden">
      <!-- Background effects -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(251,114,10,0.10)_0%,transparent_55%),radial-gradient(circle_at_5%_75%,rgba(58,106,133,0.3)_0%,transparent_45%)]" />
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="grid xl:grid-cols-[1fr_720px] lg:grid-cols-[1fr_560px] gap-8 items-center py-16 lg:py-20">
          <!-- Left content -->
          <div>
            <!-- Free badge -->
            <div class="inline-flex items-center gap-2 bg-orange/20 border border-orange/40 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-5">
              <span class="w-2 h-2 bg-orange rounded-full" />
              50歲以上 · 首次體驗完全免費
            </div>

            <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 sm:mb-4">
              第一堂課<br />
              <span class="text-orange">我們來了解你</span>
            </h1>

            <p class="text-white/60 text-base sm:text-lg font-light leading-relaxed mb-5 sm:mb-6 max-w-lg">
              不論年齡、運動經驗、身體狀況——體驗課的目的是讓我們了解你，而不是評判你。由物理治療師背景教練帶領，安全有效。
            </p>

            <!-- What you get -->
            <div class="space-y-2 mb-6">
              <div v-for="item in whatYouGet" :key="item" class="flex items-start gap-3 text-white/70 text-sm">
                <div class="w-5 h-5 rounded-full bg-orange/20 border border-orange/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-orange text-xs">&#10003;</span>
                </div>
                {{ item }}
              </div>
            </div>

            <a href="#form" class="inline-flex items-center gap-2 bg-orange text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-orange/35 hover:bg-orange-400 transition-colors">
              立即填寫預約 &rarr;
            </a>

            <div class="flex items-start sm:items-center gap-2 mt-4 text-xs sm:text-sm text-white/40">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5 sm:mt-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span><strong class="text-orange-300">50歲以上免費</strong>・一般首次 $500・無隱藏費用・不強迫買課</span>
            </div>
          </div>

          <!-- Right - FAQ & Cases Cards -->
          <aside class="flex flex-col lg:flex-row gap-4 lg:gap-5">
            <!-- FAQ Card -->
            <div class="flex-1 bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-5">
              <div class="text-xs font-bold tracking-widest uppercase text-white/30 mb-2 lg:mb-3">你可能在想</div>
              <div class="space-y-2 lg:space-y-2.5">
                <div v-for="(faq, index) in faqs" :key="faq.q" :class="['bg-white/[0.05] rounded-lg p-2.5 lg:p-3', index > 1 ? 'hidden lg:block' : '']">
                  <div class="text-sm font-semibold text-white mb-0.5 lg:mb-1">{{ faq.q }}</div>
                  <div class="text-xs text-white/50 leading-relaxed">{{ faq.a }}</div>
                </div>
              </div>
            </div>

            <!-- Cases Card -->
            <div class="flex-1 bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-5">
              <div class="text-xs font-bold tracking-widest uppercase text-white/30 mb-2 lg:mb-3">他們也是這樣開始的</div>
              <div class="space-y-2 lg:space-y-2.5">
                <div v-for="(c, index) in cases" :key="c.name" :class="['flex gap-2.5 lg:gap-3 items-center bg-white/[0.05] rounded-lg p-2.5 lg:p-3', index > 1 ? 'hidden lg:flex' : '']">
                  <div class="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-orange/30 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {{ c.name.charAt(0) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-white">{{ c.name }}・{{ c.info }}</div>
                    <div class="text-xs text-white/50 italic line-clamp-2">「{{ c.quote }}」</div>
                  </div>
                </div>
              </div>
              <a href="https://l-kk.tw/category/%e6%a1%88%e4%be%8b%e5%88%86%e4%ba%ab/" class="block text-center text-xs text-white/50 hover:text-white mt-2.5 lg:mt-3 pt-2.5 lg:pt-3 border-t border-white/10">
                看更多學員故事 &rarr;
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Form Section -->
    <div class="py-12 lg:py-16">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
          <!-- Left - Form -->
          <div id="form">
            <!-- Success State -->
            <div v-if="isSuccess" class="max-w-lg mx-auto text-center py-16">
              <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold mb-4 text-navy-700 font-serif">預約成功！</h2>
              <p class="text-ink-600 mb-8">我們將於 1 個工作天內與您聯繫確認體驗時間。</p>
              <NuxtLink to="/" class="btn btn-primary">
                返回首頁
              </NuxtLink>
            </div>

            <!-- Form -->
            <div v-else class="max-w-2xl mx-auto">
              <div class="text-center mb-6 sm:mb-8">
                <h1 class="text-2xl sm:text-3xl font-bold mb-2 text-navy-700 font-serif">預約體驗課</h1>
                <p class="text-ink-600 text-sm sm:text-base">填寫後我們會主動聯繫您安排時間</p>
              </div>

              <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                <!-- 學員基本資料 -->
                <div class="space-y-5">
                  <h2 class="text-xl font-bold text-navy-700 flex items-center gap-2">
                    <span class="w-7 h-7 rounded-full bg-orange text-white text-sm flex items-center justify-center">1</span>
                    基本資料
                  </h2>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium mb-2 text-navy-700">
                        姓名 <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="formData.name"
                        type="text"
                        :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange', errors.name ? 'border-red-500' : 'border-cream-200']"
                        placeholder="您的姓名"
                      />
                      <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2 text-navy-700">
                        手機 <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="formData.phone"
                        type="tel"
                        :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange', errors.phone ? 'border-red-500' : 'border-cream-200']"
                        placeholder="0912345678"
                      />
                      <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium mb-2 text-navy-700">
                        性別 <span class="text-red-500">*</span>
                      </label>
                      <select
                        v-model="formData.gender"
                        :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange', errors.gender ? 'border-red-500' : 'border-cream-200']"
                      >
                        <option value="">請選擇</option>
                        <option value="男">男</option>
                        <option value="女">女</option>
                      </select>
                      <p v-if="errors.gender" class="text-red-500 text-sm mt-1">{{ errors.gender }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-2 text-navy-700">
                        出生年月日 <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="formData.birthDate"
                        type="date"
                        :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange', errors.birthDate ? 'border-red-500' : 'border-cream-200']"
                      />
                      <p v-if="errors.birthDate" class="text-red-500 text-sm mt-1">{{ errors.birthDate }}</p>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium mb-2 text-navy-700">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.email"
                      type="email"
                      :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange', errors.email ? 'border-red-500' : 'border-cream-200']"
                      placeholder="your@email.com"
                    />
                    <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                  </div>
                </div>

                <div class="my-6 border-t border-cream-200" />

                <!-- 預約資訊 -->
                <div class="space-y-5">
                  <h2 class="text-xl font-bold text-navy-700 flex items-center gap-2">
                    <span class="w-7 h-7 rounded-full bg-orange text-white text-sm flex items-center justify-center">2</span>
                    預約資訊
                  </h2>

                  <div>
                    <label class="block text-sm font-medium mb-2 text-navy-700">
                      選擇門店 <span class="text-red-500">*</span>
                    </label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        v-for="store in stores"
                        :key="store.id"
                        type="button"
                        :class="[
                          'p-3 sm:p-4 rounded-lg border text-left transition-all',
                          formData.storeId === store.id
                            ? 'border-orange bg-orange/10 ring-2 ring-orange'
                            : 'border-cream-200 hover:border-orange/50'
                        ]"
                        @click="formData.storeId = store.id"
                      >
                        <div class="font-semibold text-navy-700 text-sm sm:text-base">{{ store.name }}</div>
                        <div class="text-xs sm:text-sm text-ink/60 mt-0.5">{{ store.address }}</div>
                        <div class="text-xs sm:text-sm text-navy-700 mt-0.5">{{ store.phone }}</div>
                      </button>
                    </div>
                    <p v-if="errors.storeId" class="text-red-500 text-sm mt-2">{{ errors.storeId }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium mb-2 text-navy-700">
                      付款方式 <span class="text-red-500">*</span>
                    </label>
                    <div class="space-y-2">
                      <button
                        type="button"
                        :class="[
                          'w-full p-4 rounded-lg border text-left transition-all',
                          formData.paymentMethod === '50歲以上免費'
                            ? 'border-green-500 bg-green-50 ring-2 ring-green-500'
                            : 'border-cream-200 hover:border-green-300'
                        ]"
                        @click="formData.paymentMethod = '50歲以上免費'"
                      >
                        <div class="flex items-center gap-3">
                          <div :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center', formData.paymentMethod === '50歲以上免費' ? 'border-green-500' : 'border-ink-300']">
                            <div v-if="formData.paymentMethod === '50歲以上免費'" class="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                          <div>
                            <span class="font-semibold text-green-600">50 歲以上免費</span>
                            <span class="text-sm text-ink/60 ml-2">首次體驗完全免費</span>
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        :class="[
                          'w-full p-4 rounded-lg border text-left transition-all',
                          formData.paymentMethod === '臨櫃付款'
                            ? 'border-orange bg-orange/10 ring-2 ring-orange'
                            : 'border-cream-200 hover:border-orange/50'
                        ]"
                        @click="formData.paymentMethod = '臨櫃付款'"
                      >
                        <div class="flex items-center gap-3">
                          <div :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center', formData.paymentMethod === '臨櫃付款' ? 'border-orange' : 'border-ink-300']">
                            <div v-if="formData.paymentMethod === '臨櫃付款'" class="w-3 h-3 rounded-full bg-orange" />
                          </div>
                          <div>
                            <span class="font-semibold text-navy-700">臨櫃付款</span>
                            <span class="text-sm text-ink/60 ml-2">首次體驗 $500</span>
                          </div>
                        </div>
                      </button>
                    </div>
                    <p v-if="errors.paymentMethod" class="text-red-500 text-sm mt-2">{{ errors.paymentMethod }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium mb-2 text-navy-700">
                      備註 <span class="text-ink-500 font-normal">（選填）</span>
                    </label>
                    <textarea
                      v-model="formData.message"
                      rows="3"
                      class="w-full px-4 py-3 border border-cream-200 rounded-lg focus:ring-2 focus:ring-orange"
                      placeholder="有任何問題或特殊需求，請在此告訴我們"
                    />
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="mt-8 pt-6 border-t border-cream-200">
                  <button
                    type="button"
                    :disabled="isSubmitting"
                    class="w-full btn btn-primary py-4 text-lg disabled:opacity-50"
                    @click="handleSubmit"
                  >
                    {{ isSubmitting ? '送出中...' : '送出預約' }}
                  </button>
                  <p class="text-sm text-ink-500 text-center mt-4">
                    送出後，我們將於 1 個工作天內與您聯繫確認體驗時間。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right - Process Steps -->
          <div class="md:sticky md:top-24 md:self-start">
            <div class="flex items-center gap-2 text-xs md:text-sm font-bold text-orange tracking-widest uppercase mb-2 md:mb-3">
              <span class="w-4 md:w-5 h-0.5 bg-orange" />
              接下來會發生什麼
            </div>
            <h2 class="font-serif text-xl md:text-2xl font-black text-navy-700 mb-4 md:mb-6">
              填完表單後<span class="text-orange">四個步驟</span>
            </h2>

            <div class="relative flex flex-col">
              <div class="absolute left-4 md:left-5 top-4 md:top-5 bottom-4 md:bottom-5 w-[1.5px] bg-gradient-to-b from-orange to-orange/20" />

              <div v-for="(step, idx) in steps" :key="step.title" class="flex gap-3 md:gap-4 items-start py-3 md:py-4 relative z-10">
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange text-white font-serif text-base md:text-lg font-black flex items-center justify-center flex-shrink-0 shadow-[0_0_0_3px_rgba(251,114,10,0.12)] md:shadow-[0_0_0_4px_rgba(251,114,10,0.12)]">
                  {{ idx + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm md:text-base font-semibold text-navy-700 mb-0.5">{{ step.title }}</div>
                  <div class="text-xs md:text-sm text-ink/60 leading-relaxed">{{ step.desc }}</div>
                  <div v-if="step.badges" class="flex flex-wrap gap-1.5 md:gap-2 mt-1.5 md:mt-2">
                    <span
                      v-for="(badge, bIdx) in step.badges"
                      :key="badge"
                      :class="[
                        'text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 rounded-full',
                        bIdx === 0 ? 'bg-green-500/10 text-green-600' : 'bg-navy-700/10 text-navy-700'
                      ]"
                    >
                      {{ badge }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
