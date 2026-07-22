<script setup lang="ts">
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

interface Store {
  id: string
  name: string
  slug: string
}

// Active store filter
const activeStore = ref<string | null>(null)

// Selected coach for modal
const selectedCoach = ref<Coach | null>(null)

// Fetch coaches and stores with useLazyAsyncData for better caching
const { data: coachesResponse, pending: coachesPending } = await useLazyAsyncData(
  'public-coaches',
  () => $fetch<{ success: boolean; data: Coach[] }>('/api/public/coaches'),
  { server: false }
)

const { data: storesResponse, pending: storesPending } = await useLazyAsyncData(
  'public-stores-coaches',
  () => $fetch<{ success: boolean; data: Store[] }>('/api/public/stores'),
  { server: false }
)

// Combined pending state
const pending = computed(() => coachesPending.value || storesPending.value)

const coaches = computed(() => coachesResponse.value?.data || [])
const stores = computed(() => storesResponse.value?.data || [])

// Open coach detail modal
function openCoachModal(coach: Coach) {
  selectedCoach.value = coach
  document.body.style.overflow = 'hidden'
}

// Close coach detail modal
function closeCoachModal() {
  selectedCoach.value = null
  document.body.style.overflow = ''
}

// Group coaches by store
const coachesByStore = computed(() => {
  const grouped: Record<string, { store: Store | null; coaches: Coach[] }> = {}

  // Initialize with store order
  for (const store of stores.value) {
    grouped[store.slug] = { store, coaches: [] }
  }

  // Add "no store" group for coaches without a store
  grouped['_no_store'] = { store: null, coaches: [] }

  // Group coaches
  for (const coach of coaches.value) {
    const storeSlug = coach.store?.slug
    if (storeSlug && grouped[storeSlug]) {
      grouped[storeSlug].coaches.push(coach)
    } else {
      grouped['_no_store'].coaches.push(coach)
    }
  }

  // Remove empty groups and _no_store if empty
  const result: { store: Store | null; coaches: Coach[] }[] = []
  for (const store of stores.value) {
    if (grouped[store.slug].coaches.length > 0) {
      result.push(grouped[store.slug])
    }
  }
  if (grouped['_no_store'].coaches.length > 0) {
    result.push(grouped['_no_store'])
  }

  return result
})

// Filtered coaches based on active store
const filteredCoachesByStore = computed(() => {
  if (!activeStore.value) {
    return coachesByStore.value
  }
  return coachesByStore.value.filter(g => g.store?.slug === activeStore.value)
})

// Total coach count
const totalCoachCount = computed(() => coaches.value.length)

// Set active store filter
function setActiveStore(storeSlug: string | null) {
  activeStore.value = storeSlug
}

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

      <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 py-16 lg:py-24 text-center">
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

        <p class="text-white/60 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-6">
          每位教練都有物理治療師或醫療專業背景，專精於中高齡與特殊族群訓練，讓您在安全的環境下達到最佳訓練效果。
        </p>

        <div class="text-white/40 text-sm">
          共 <span class="text-orange font-semibold">{{ totalCoachCount }}</span> 位專業教練
        </div>
      </div>
    </section>

    <!-- Store Filter Bar -->
    <section class="border-b border-cream-200 sticky top-16 bg-cream/95 backdrop-blur-sm z-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
          <button
            @click="setActiveStore(null)"
            :class="[
              'px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors',
              activeStore === null
                ? 'bg-navy text-white'
                : 'bg-cream-200 text-ink hover:bg-cream-300'
            ]"
          >
            全部門店
          </button>
          <button
            v-for="store in stores"
            :key="store.slug"
            @click="setActiveStore(store.slug)"
            :class="[
              'px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors',
              activeStore === store.slug
                ? 'bg-navy text-white'
                : 'bg-cream-200 text-ink hover:bg-cream-300'
            ]"
          >
            {{ store.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- Loading Skeleton -->
    <section v-if="pending" class="py-12 lg:py-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <!-- Skeleton Store Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="h-8 w-32 bg-cream-300 rounded animate-pulse" />
          <div class="h-6 w-20 bg-cream-300 rounded-full animate-pulse" />
        </div>
        <!-- Skeleton Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
          <div v-for="i in 10" :key="i" class="bg-white rounded-xl overflow-hidden border border-navy/10">
            <div class="aspect-[3/4] bg-cream-200 animate-pulse" />
            <div class="p-4 space-y-2">
              <div class="h-5 w-20 bg-cream-200 rounded animate-pulse" />
              <div class="h-4 w-16 bg-cream-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Coaches by Store -->
    <section v-else class="py-12 lg:py-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div v-if="filteredCoachesByStore.length === 0" class="text-center py-12 text-ink/50">
          目前沒有教練資料
        </div>

        <div v-else class="space-y-16">
          <!-- Store Section -->
          <div
            v-for="group in filteredCoachesByStore"
            :key="group.store?.slug || 'no-store'"
            :id="`store-${group.store?.slug || 'no-store'}`"
            class="scroll-mt-40"
          >
            <!-- Store Header -->
            <div class="flex items-center gap-4 mb-6">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-1">
                  <h2 class="font-serif text-2xl lg:text-3xl font-bold text-navy">
                    {{ group.store?.name || '其他門店' }}
                  </h2>
                  <span class="px-3 py-1 bg-orange/10 text-orange text-sm font-medium rounded-full">
                    {{ group.coaches.length }} 位教練
                  </span>
                </div>
                <NuxtLink
                  v-if="group.store"
                  :to="`/locations/${group.store.slug}`"
                  class="text-sm text-ink/50 hover:text-orange transition-colors inline-flex items-center gap-1"
                >
                  查看門店資訊
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
              </div>
            </div>

            <!-- Coaches Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
              <button
                v-for="coach in group.coaches"
                :key="coach.id"
                @click="openCoachModal(coach)"
                class="group bg-white rounded-xl overflow-hidden shadow-sm border border-navy/10 hover:shadow-lg hover:border-orange/30 transition-all duration-300 text-left cursor-pointer"
              >
                <!-- Coach Image -->
                <div class="aspect-[3/4] relative bg-cream-200 overflow-hidden">
                  <img
                    v-if="coach.photo"
                    :src="coach.photo"
                    :alt="coach.name"
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy to-navy/80">
                    <span class="font-serif text-5xl font-black text-white/20">{{ coach.name.charAt(0) }}</span>
                  </div>
                  <!-- Click hint -->
                  <div class="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors flex items-center justify-center">
                    <span class="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-navy text-sm font-medium px-3 py-1.5 rounded-full shadow">
                      查看完整資訊
                    </span>
                  </div>
                </div>

                <!-- Coach Info - Compact -->
                <div class="p-4">
                  <h3 class="text-lg font-bold text-navy font-serif group-hover:text-orange transition-colors truncate">
                    {{ coach.name }}
                  </h3>
                  <p v-if="coach.roleTitle" class="text-orange font-medium text-sm truncate">
                    {{ coach.roleTitle }}
                  </p>

                  <!-- Specialties - Compact -->
                  <div v-if="coach.specialties && coach.specialties.length > 0" class="flex flex-wrap gap-1 mt-2">
                    <span
                      v-for="specialty in coach.specialties.slice(0, 2)"
                      :key="specialty"
                      class="px-2 py-0.5 bg-cream text-ink/70 text-[11px] rounded-full truncate max-w-[90px]"
                    >
                      {{ specialty }}
                    </span>
                    <span
                      v-if="coach.specialties.length > 2"
                      class="px-2 py-0.5 text-ink/40 text-[11px]"
                    >
                      +{{ coach.specialties.length - 2 }}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-orange py-16 lg:py-20 text-center">
      <div class="max-w-4xl mx-auto px-6 lg:px-8">
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

    <!-- Coach Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedCoach"
          class="fixed inset-0 z-50 overflow-y-auto"
        >
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeCoachModal" />

          <!-- Modal Wrapper for centering -->
          <div class="min-h-full flex items-center justify-center p-4">
            <!-- Modal Content -->
            <div class="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl z-10">
            <!-- Close Button -->
            <button
              @click="closeCoachModal"
              class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <!-- Coach Header -->
              <div class="relative">
                <div class="flex flex-col md:flex-row">
                  <!-- Photo -->
                  <div class="md:w-1/3 aspect-[3/4] md:aspect-auto bg-cream-200 flex-shrink-0">
                    <img
                      v-if="selectedCoach.photo"
                      :src="selectedCoach.photo"
                      :alt="selectedCoach.name"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full min-h-[200px] flex items-center justify-center bg-gradient-to-br from-navy to-navy/80">
                      <span class="font-serif text-6xl font-black text-white/20">{{ selectedCoach.name.charAt(0) }}</span>
                    </div>
                  </div>

                  <!-- Basic Info -->
                  <div class="flex-1 p-6 md:p-8">
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <h2 class="font-serif text-2xl md:text-3xl font-bold text-navy">
                          {{ selectedCoach.name }}
                        </h2>
                        <p v-if="selectedCoach.roleTitle" class="text-orange font-medium text-lg mt-1">
                          {{ selectedCoach.roleTitle }}
                        </p>
                      </div>
                    </div>

                    <div v-if="selectedCoach.store" class="flex items-center gap-2 text-ink/60 text-sm mt-3">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{{ selectedCoach.store.name }}</span>
                    </div>

                    <!-- Description -->
                    <p v-if="selectedCoach.description" class="text-ink/70 mt-4 leading-relaxed">
                      {{ selectedCoach.description }}
                    </p>

                    <!-- Specialties -->
                    <div v-if="selectedCoach.specialties && selectedCoach.specialties.length > 0" class="mt-5">
                      <h4 class="text-sm font-semibold text-navy mb-2">專長領域</h4>
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="specialty in selectedCoach.specialties"
                          :key="specialty"
                          class="px-3 py-1 bg-orange/10 text-orange text-sm rounded-full"
                        >
                          {{ specialty }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Detailed Info -->
              <div class="px-6 md:px-8 pb-6 md:pb-8 space-y-5 border-t border-gray-100 pt-5">
                <!-- Certifications -->
                <div v-if="selectedCoach.certifications && selectedCoach.certifications.length > 0">
                  <h4 class="text-sm font-semibold text-navy mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    專業認證
                  </h4>
                  <ul class="space-y-1">
                    <li v-for="cert in selectedCoach.certifications" :key="cert" class="text-ink/70 text-sm flex items-start gap-2">
                      <span class="text-orange mt-1">•</span>
                      {{ cert }}
                    </li>
                  </ul>
                </div>

                <!-- Education -->
                <div v-if="selectedCoach.education && selectedCoach.education.length > 0">
                  <h4 class="text-sm font-semibold text-navy mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    學歷背景
                  </h4>
                  <ul class="space-y-1">
                    <li v-for="edu in selectedCoach.education" :key="edu" class="text-ink/70 text-sm flex items-start gap-2">
                      <span class="text-orange mt-1">•</span>
                      {{ edu }}
                    </li>
                  </ul>
                </div>

                <!-- Experiences -->
                <div v-if="selectedCoach.experiences && selectedCoach.experiences.length > 0">
                  <h4 class="text-sm font-semibold text-navy mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    經歷
                  </h4>
                  <ul class="space-y-1">
                    <li v-for="exp in selectedCoach.experiences" :key="exp" class="text-ink/70 text-sm flex items-start gap-2">
                      <span class="text-orange mt-1">•</span>
                      {{ exp }}
                    </li>
                  </ul>
                </div>

                <!-- CTA -->
                <div class="pt-4">
                  <NuxtLink
                    :to="`/booking?store=${selectedCoach.store?.slug || ''}`"
                    class="block w-full bg-orange text-white text-center font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors"
                    @click="closeCoachModal"
                  >
                    預約體驗
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
