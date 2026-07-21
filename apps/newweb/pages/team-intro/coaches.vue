<script setup lang="ts">
import { computed } from 'vue'

useHead({
  title: '全體教練｜練健康 LKK Wellness',
  meta: [
    {
      name: 'description',
      content: '練健康專業教練團隊，由物理治療師與運動科學專家組成，專注於中高齡健康訓練。'
    }
  ]
})

interface Coach {
  id: string
  name: string
  slug?: string
  photo?: string
  roleTitle?: string
  specialties?: string[]
  certifications?: string[]
  education?: string[]
  experiences?: string[]
  description?: string
  storeId?: string
  store?: {
    id: string
    name: string
    slug: string
  }
}

// Fetch coaches from API
const { data: coachesResponse, pending } = await useFetch<{
  success: boolean
  data: Coach[]
}>('/api/public/coaches')

// Fetch stores for filter navigation
const { data: storesResponse } = await useFetch<{
  success: boolean
  data: { id: string; name: string; slug: string }[]
}>('/api/public/stores')

const coaches = computed(() => coachesResponse.value?.data || [])
const stores = computed(() => {
  const storeList = storesResponse.value?.data || []
  return storeList.map(s => ({ name: s.name, slug: s.slug }))
})
</script>

<template>
  <div class="min-h-screen bg-cream">
    <!-- Hero Section -->
    <section class="relative bg-navy pt-16 overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(251,114,10,0.10)_0%,transparent_55%),radial-gradient(circle_at_5%_75%,rgba(58,106,133,0.3)_0%,transparent_45%)]" />
        <div
          class="absolute inset-0 opacity-[0.022]"
          :style="{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }"
        />
      </div>

      <div class="container mx-auto px-4 relative z-10 py-16 lg:py-24 text-center">
        <nav class="flex items-center justify-center gap-1.5 text-xs text-white/35 mb-6">
          <NuxtLink to="/" class="hover:text-white/70 transition-colors">練健康</NuxtLink>
          <span class="text-white/20">›</span>
          <NuxtLink to="/team-intro" class="hover:text-white/70 transition-colors">團隊介紹</NuxtLink>
          <span class="text-white/20">›</span>
          <span>全體教練</span>
        </nav>

        <div class="inline-flex items-center bg-orange/20 border border-orange/40 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-5">
          物理治療背景專業教練
        </div>

        <h1 class="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
          全體<span class="text-orange">教練</span>
        </h1>

        <p class="text-white/60 text-lg font-light leading-relaxed max-w-2xl mx-auto">
          每位教練都有物理治療師或醫療專業背景，專精於中高齡與特殊族群訓練，讓您在安全的環境下達到最佳訓練效果。
        </p>
      </div>
    </section>

    <!-- Store Filter -->
    <section class="border-b border-cream-200 sticky top-16 bg-cream z-10">
      <div class="container mx-auto px-4">
        <div class="flex gap-2 py-4 overflow-x-auto">
          <NuxtLink
            to="/team-intro/coaches"
            class="px-4 py-2 rounded-full whitespace-nowrap bg-orange text-white"
          >
            全部
          </NuxtLink>
          <NuxtLink
            v-for="store in stores"
            :key="store.slug"
            :to="`/locations/${store.slug}`"
            class="px-4 py-2 rounded-full whitespace-nowrap bg-cream-200 text-ink hover:bg-cream-300 transition-colors"
          >
            {{ store.name }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center py-24">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
    </div>

    <!-- Coaches Grid -->
    <section v-else class="py-12 lg:py-16">
      <div class="container mx-auto px-4">
        <div v-if="coaches.length === 0" class="text-center py-12 text-ink/50">
          目前沒有教練資料
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="coach in coaches"
            :key="coach.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-navy/10"
          >
            <!-- Coach Image -->
            <div class="aspect-square relative bg-cream-200">
              <img
                v-if="coach.photo"
                :src="coach.photo"
                :alt="coach.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy to-navy/80">
                <span class="font-serif text-6xl font-black text-white/20">{{ coach.name.charAt(0) }}</span>
              </div>
              <!-- Store badge -->
              <div
                v-if="coach.store?.name"
                class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-medium text-navy px-3 py-1 rounded-full"
              >
                {{ coach.store.name }}
              </div>
            </div>

            <!-- Coach Info -->
            <div class="p-6">
              <div class="mb-3">
                <h2 class="text-xl font-bold text-navy font-serif">{{ coach.name }}</h2>
                <p class="text-orange font-semibold">{{ coach.roleTitle || '' }}</p>
              </div>

              <!-- Specialties -->
              <div v-if="coach.specialties && coach.specialties.length > 0" class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="specialty in coach.specialties.slice(0, 3)"
                  :key="specialty"
                  class="px-3 py-1 bg-orange/10 text-orange text-xs rounded-full"
                >
                  {{ specialty }}
                </span>
              </div>

              <!-- Certifications -->
              <div v-if="coach.certifications && coach.certifications.length > 0" class="pt-4 border-t border-cream-200">
                <p class="text-xs text-ink/40 mb-2">專業認證</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="cert in coach.certifications.slice(0, 2)"
                    :key="cert"
                    class="text-xs text-ink/60"
                  >
                    {{ cert }}
                  </span>
                  <span v-if="coach.certifications.length > 2" class="text-xs text-ink/40">
                    +{{ coach.certifications.length - 2 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-orange py-16 lg:py-20 text-center">
      <div class="container mx-auto px-4">
        <h2 class="font-serif text-3xl lg:text-4xl font-black text-white mb-3">
          找到適合您的教練了嗎？
        </h2>
        <p class="text-white/80 mb-8 max-w-md mx-auto">
          預約免費體驗，讓專業教練為您評估並制定訓練計畫。50歲以上首次體驗完全免費。
        </p>
        <NuxtLink
          to="/booking"
          class="inline-flex items-center gap-2 bg-white text-orange font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          立即預約體驗 →
        </NuxtLink>
        <div class="mt-4 text-white/60 text-sm">
          50歲以上完全免費・不強迫買課
        </div>
      </div>
    </section>
  </div>
</template>
