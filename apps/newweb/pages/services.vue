<script setup lang="ts">
useHead({
  title: '服務介紹 | 練健康',
  meta: [
    { name: 'description', content: '練健康提供一對一訓練、團體課程、線上課程等多元服務。50 歲以上首次體驗完全免費，一般首次體驗 $500。' }
  ]
})

// 一對一訓練的四種課表方向
const courseDirections = [
  {
    id: 'elderly',
    title: '中高齡肌力訓練',
    description: '專為 50 歲以上設計，預防肌少症、提升平衡感與日常功能。',
    icon: 'heart',
  },
  {
    id: 'special',
    title: '特殊族群訓練',
    description: '針對慢性病、代謝症候群等特殊需求，安全有效地改善健康。',
    icon: 'shield',
  },
  {
    id: 'rehab',
    title: '運動復健',
    description: '結合物理治療與運動訓練，協助傷後復健與慢性疼痛改善。',
    icon: 'refresh',
  },
  {
    id: 'fitness',
    title: '一般肌力與體態',
    description: '增肌減脂、體態雕塑，適合想要提升整體體能的族群。',
    icon: 'bolt',
  },
]

// 團體課程
const groupCourses = [
  {
    id: 'basic',
    title: '基礎重量訓練班',
    target: '初學者',
    description: '從零開始學習正確的重量訓練動作，建立肌力基礎。',
    people: '4-8 人',
    duration: '50 分鐘',
  },
  {
    id: 'strength',
    title: '肌力團練班',
    target: '有基礎者',
    description: '進階肌力訓練，挑戰更高強度，與夥伴互相激勵成長。',
    people: '4-8 人',
    duration: '50 分鐘',
  },
  {
    id: 'senior',
    title: '樂齡體適能訓練班',
    target: '50 歲以上',
    description: '專為熟齡族群設計的團體課，安全有趣地提升體能。',
    people: '4-8 人',
    duration: '50 分鐘',
  },
]

// 線上課程優勢
const onlineAdvantages = [
  {
    title: '隨選播放',
    description: '24 小時隨時觀看，依照自己的時間安排學習。',
    icon: 'play',
  },
  {
    title: '不受地點限制',
    description: '在家、出差、旅行，只要有網路就能運動。',
    icon: 'globe',
  },
  {
    title: '專業課程設計',
    description: '由練健康專業教練錄製，動作示範清楚易懂。',
    icon: 'bulb',
  },
]

// 比較表資料
const comparisonData = [
  { item: '個人化程度', personal: '最高', group: '中等', online: '基礎' },
  { item: '教練即時指導', personal: '✓', group: '✓', online: '—' },
  { item: '人數配置', personal: '1 對 1', group: '4-8 人', online: '無限制' },
  { item: '特殊族群適配', personal: '最適合', group: '部分適合', online: '需自行評估' },
  { item: '時間彈性', personal: '彈性排課', group: '固定時段', online: '隨時觀看' },
  { item: '地點需求', personal: '需到店', group: '需到店', online: '不限' },
  { item: '開始方式', personal: '預約體驗', group: '查詢課表', online: '直接購買' },
]

const tabs = [
  { id: 'personal', label: '一對一訓練' },
  { id: 'group', label: '團體課程' },
  { id: 'online', label: '線上課程' },
]

const activeTab = ref('personal')
const isSticky = ref(false)

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 120
    const top = element.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

onMounted(() => {
  const handleScroll = () => {
    const heroHeight = document.getElementById('hero')?.offsetHeight || 0
    isSticky.value = window.scrollY > heroHeight - 60

    const sections = ['personal', 'group', 'online']
    for (const section of sections) {
      const element = document.getElementById(section)
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top <= 150 && rect.bottom >= 150) {
          activeTab.value = section
          break
        }
      }
    }
  }

  window.addEventListener('scroll', handleScroll)
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})

const personalFeatures = [
  '醫療背景教練一對一指導',
  '完整身體評估與個人化課表',
  '50 分鐘課程含動作指導與糾正',
  '定期進度追蹤與課表調整',
  '營養與生活習慣建議',
  '彈性排課，配合您的時間',
]

const onlineFeatures = [
  '由練健康專業教練親自錄製',
  '自主安排學習進度',
  '居家器材即可訓練',
  '多元課程內容持續更新',
]
</script>

<template>
  <div class="min-h-screen bg-cream-100">
    <!-- Hero -->
    <section id="hero" class="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-16 md:py-24">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-5xl font-bold mb-4 font-serif">
          找到最適合你的上課方式
        </h1>
        <p class="text-cream-200 text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          一對一訓練｜團體課程｜線上課程
        </p>
        <p class="text-orange text-lg md:text-xl font-semibold mb-10">
          50 歲以上完全免費・一般首次體驗 $500
        </p>

        <!-- 快速導航按鈕 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-3xl mx-auto">
          <button
            class="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-2xl p-6 transition-all group"
            @click="scrollToSection('personal')"
          >
            <div class="text-orange mb-2">
              <svg class="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="font-bold text-lg mb-1">一對一訓練</h3>
            <p class="text-cream-300 text-sm">專屬教練・客製課表</p>
          </button>

          <button
            class="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-2xl p-6 transition-all group"
            @click="scrollToSection('group')"
          >
            <div class="text-orange mb-2">
              <svg class="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="font-bold text-lg mb-1">團體課程</h3>
            <p class="text-cream-300 text-sm">小班教學・互相激勵</p>
          </button>

          <button
            class="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-2xl p-6 transition-all group"
            @click="scrollToSection('online')"
          >
            <div class="text-orange mb-2">
              <svg class="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="font-bold text-lg mb-1">線上課程</h3>
            <p class="text-cream-300 text-sm">隨時隨地・自主學習</p>
          </button>
        </div>
      </div>
    </section>

    <!-- 粘性頁籤 -->
    <nav
      :class="[
        'bg-white border-b border-navy-700/[0.14] z-40 transition-shadow',
        isSticky ? 'sticky top-0 shadow-sm' : ''
      ]"
    >
      <div class="container mx-auto px-4">
        <div class="flex justify-center h-[52px]">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'px-4 h-full font-medium transition-all border-b-[3px]',
              activeTab === tab.id
                ? 'text-[#1a3545] border-orange font-bold'
                : 'text-[#7a7a7a] border-transparent hover:text-navy-700'
            ]"
            @click="scrollToSection(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </nav>

    <!-- 一對一訓練區 -->
    <section id="personal" class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-start">
          <!-- 左側圖片 -->
          <div class="lg:w-2/5">
            <div class="sticky top-32 rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&h=675&fit=crop&q=80"
                alt="練健康一對一訓練：專業教練指導學員進行肌力訓練"
                class="w-full h-auto"
              />
            </div>
          </div>

          <!-- 右側內容 -->
          <div class="lg:w-3/5">
            <span class="text-orange font-semibold mb-2 block">最熱門</span>
            <h2 class="text-3xl md:text-4xl font-bold text-navy-700 font-serif mb-6">
              一對一訓練
            </h2>

            <!-- 特色列表 -->
            <ul class="space-y-3 mb-10">
              <li v-for="feature in personalFeatures" :key="feature" class="flex items-start gap-3">
                <svg class="w-6 h-6 text-orange flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-ink-700">{{ feature }}</span>
              </li>
            </ul>

            <!-- 四種課表方向 -->
            <h3 class="text-xl font-bold text-navy-700 mb-4">四種課表方向</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div
                v-for="course in courseDirections"
                :key="course.id"
                class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-cream-200"
              >
                <div class="text-orange mb-3">
                  <!-- Heart icon -->
                  <svg v-if="course.icon === 'heart'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <!-- Shield icon -->
                  <svg v-else-if="course.icon === 'shield'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <!-- Refresh icon -->
                  <svg v-else-if="course.icon === 'refresh'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <!-- Bolt icon -->
                  <svg v-else-if="course.icon === 'bolt'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 class="font-bold text-navy-700 mb-2">{{ course.title }}</h4>
                <p class="text-sm text-ink-600">{{ course.description }}</p>
              </div>
            </div>

            <NuxtLink
              to="/booking"
              class="inline-flex items-center gap-2 bg-orange hover:bg-orange-light text-white font-bold px-8 py-4 rounded-full transition-colors"
            >
              預約首次體驗
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 團體課程區 -->
    <section id="group" class="py-16 md:py-24 bg-cream-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-orange font-semibold mb-2 block">小班制教學</span>
          <h2 class="text-3xl md:text-4xl font-bold text-navy-700 font-serif mb-4">
            團體課程
          </h2>
          <p class="text-ink-600 max-w-2xl mx-auto">
            與志同道合的夥伴一起運動，互相激勵成長，享受團體訓練的樂趣。
          </p>
        </div>

        <!-- 課程卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            v-for="course in groupCourses"
            :key="course.id"
            class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
          >
            <span class="inline-block bg-orange/10 text-orange text-sm font-medium px-3 py-1 rounded-full mb-4">
              {{ course.target }}
            </span>
            <h3 class="text-xl font-bold text-navy-700 mb-3">{{ course.title }}</h3>
            <p class="text-ink-600 mb-6">{{ course.description }}</p>
            <div class="flex items-center gap-4 text-sm text-ink-500 pt-4 border-t border-cream-200">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ course.people }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ course.duration }}
              </span>
            </div>
          </div>
        </div>

        <!-- 說明框 -->
        <div class="bg-navy-700/5 border border-navy-700/10 rounded-2xl p-6 mb-10 max-w-2xl mx-auto">
          <h4 class="font-bold text-navy-700 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            購課與請假規定
          </h4>
          <ul class="text-sm text-ink-600 space-y-2">
            <li>• 團體課以四堂為一期購買，可彈性選擇開始日期</li>
            <li>• 每堂課 50 分鐘，4-8 人小班制</li>
            <li>• 請假需提前一週通知，可安排補課</li>
            <li>• 歡迎先預約單堂體驗試上</li>
          </ul>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/404"
            class="inline-flex items-center gap-2 bg-navy-700 hover:bg-navy-800 text-white font-bold px-8 py-4 rounded-full transition-colors"
          >
            查詢團體課時間
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 線上課程區 -->
    <section id="online" class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center">
          <!-- 左側影片/圖片 -->
          <div class="lg:w-1/2">
            <div class="relative rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=900&h=506&fit=crop&q=80"
                alt="練健康線上課程"
                class="w-full h-auto"
              />
              <a
                href="https://sat.cool/course/97"
                target="_blank"
                rel="noopener noreferrer"
                class="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
              >
                <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg class="w-8 h-8 text-orange ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          <!-- 右側內容 -->
          <div class="lg:w-1/2">
            <span class="text-orange font-semibold mb-2 block">sat.cool 線上平台</span>
            <h2 class="text-3xl md:text-4xl font-bold text-navy-700 font-serif mb-6">
              線上課程
            </h2>

            <!-- 三大優勢 -->
            <div class="grid gap-6 mb-8">
              <div v-for="advantage in onlineAdvantages" :key="advantage.title" class="flex items-start gap-4">
                <div class="text-orange flex-shrink-0">
                  <!-- Play icon -->
                  <svg v-if="advantage.icon === 'play'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <!-- Globe icon -->
                  <svg v-else-if="advantage.icon === 'globe'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <!-- Bulb icon -->
                  <svg v-else-if="advantage.icon === 'bulb'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-navy-700 mb-1">{{ advantage.title }}</h3>
                  <p class="text-ink-600">{{ advantage.description }}</p>
                </div>
              </div>
            </div>

            <!-- 課程特色 -->
            <ul class="space-y-2 mb-8">
              <li v-for="feature in onlineFeatures" :key="feature" class="flex items-center gap-2 text-ink-700">
                <svg class="w-5 h-5 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ feature }}
              </li>
            </ul>

            <div class="flex flex-col sm:flex-row gap-4">
              <a
                href="https://sat.cool/course/97"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange-light text-white font-bold px-8 py-4 rounded-full transition-colors"
              >
                前往線上課程平台
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <NuxtLink
                to="/booking"
                class="inline-flex items-center justify-center gap-2 border-2 border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white font-bold px-8 py-4 rounded-full transition-colors"
              >
                想嘗試一對一
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 比較表 -->
    <section id="compare" class="py-16 md:py-24 bg-[#1a3545] text-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center font-serif mb-12">
          三種上課形式快速比較
        </h2>

        <div class="overflow-x-auto">
          <div class="bg-white/5 rounded-[14px] max-w-4xl mx-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-white/[0.08]">
                  <th class="py-4 px-4 text-left text-[0.78rem] font-semibold text-white/60 tracking-wide border-b border-white/[0.08]"></th>
                  <th class="py-4 px-4 text-center text-[0.78rem] font-semibold text-white/60 tracking-wide border-b border-white/[0.08]">一對一訓練</th>
                  <th class="py-4 px-4 text-center text-[0.78rem] font-semibold text-white/60 tracking-wide border-b border-white/[0.08]">團體課程</th>
                  <th class="py-4 px-4 text-center text-[0.78rem] font-semibold text-white/60 tracking-wide border-b border-white/[0.08]">線上課程</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in comparisonData"
                  :key="row.item"
                  :class="index !== comparisonData.length - 1 ? 'border-b border-white/[0.06]' : ''"
                >
                  <td class="py-4 px-4 text-white/70 text-left">{{ row.item }}</td>
                  <td class="py-4 px-4 text-center bg-orange/[0.08]">
                    <span :class="row.personal === '✓' ? 'text-orange font-bold' : row.personal === '—' ? 'text-white/20' : 'text-white/70'">
                      {{ row.personal }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-center">
                    <span :class="row.group === '✓' ? 'text-orange font-bold' : row.group === '—' ? 'text-white/20' : 'text-white/70'">
                      {{ row.group }}
                    </span>
                  </td>
                  <td class="py-4 px-4 text-center">
                    <span :class="row.online === '✓' ? 'text-orange font-bold' : row.online === '—' ? 'text-white/20' : 'text-white/70'">
                      {{ row.online }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- 橘色 CTA Banner -->
    <section class="py-16 md:py-20 bg-orange">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white font-serif mb-4">
          不確定適合哪一種？
        </h2>
        <p class="text-white/90 text-lg mb-8 max-w-xl mx-auto">
          別擔心！先預約一堂體驗課，讓教練為您評估並提供最適合的建議。
        </p>
        <NuxtLink
          to="/booking"
          class="inline-flex items-center gap-2 bg-white hover:bg-cream-100 text-orange font-bold px-10 py-4 rounded-full transition-colors text-lg"
        >
          立即預約體驗課
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>
        <p class="text-white/80 text-sm mt-6">
          50 歲以上完全免費・一般首次體驗 $500
        </p>
      </div>
    </section>

    <!-- 手機版粘性 CTA -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 p-4 md:hidden z-50">
      <NuxtLink
        to="/booking"
        class="block w-full bg-orange hover:bg-orange-light text-white font-bold py-4 rounded-full text-center transition-colors"
      >
        立即預約體驗
      </NuxtLink>
    </div>

    <!-- 為手機版粘性 CTA 預留空間 -->
    <div class="h-20 md:hidden" />
  </div>
</template>
