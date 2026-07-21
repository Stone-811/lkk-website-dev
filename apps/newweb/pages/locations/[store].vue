<script setup lang="ts">
const route = useRoute()
const storeSlug = route.params.store as string

// 門店基本資料
const storesData: Record<string, any> = {
  'xindian': {
    id: 'xindian',
    name: '新店七張店',
    district: '新北市新店區',
    address: '北新路二段 252 號 B1-2',
    postalCode: '231',
    phone: '(02) 8914-6428',
    phoneRaw: '+886289146428',
    description: '新北市新店區唯一專注中高齡與特殊族群的肌力訓練中心，由物理治療師背景教練帶領，捷運七張站步行 3 分鐘。',
    businessHours: {
      weekday: '09:00 – 21:00',
      saturday: '09:00 – 18:00',
      sunday: '公休',
      holiday: '依公告，請來電確認',
    },
    transport: {
      mrt: { station: '新店七張站 1 號出口', desc: '出站後沿北新路方向直行，約步行 3 分鐘，大樓入口在便利商店旁，下樓梯至 B1-2。' },
      bus: { stop: '七張站', desc: '849、綠12、綠14、橘12 等路線均可抵達，下車後步行 2 分鐘。' },
      car: { desc: '沿北新路往新店方向，過七張路口後即可見到，大樓地下室入口在右側。' },
      parking: { desc: '七張捷運站旁有公共停車場（收費），或北新路沿線路邊停車格。地下室停車空間有限，請提前確認。' },
    },
    googleMapUrl: 'https://maps.google.com/?q=新北市新店區北新路二段252號',
    geo: { lat: 24.9682, lng: 121.5396 },
  },
  'nanjing': {
    id: 'nanjing',
    name: '南京店',
    district: '台北市中山區',
    address: '南京東路三段 29 號 B1',
    postalCode: '104',
    phone: '(02) 2507-4196',
    phoneRaw: '+886225074196',
    description: '位於台北市中心南京復興商圈，捷運南京復興站步行 3 分鐘。專為中高齡及特殊族群設計的肌力訓練中心。',
    businessHours: {
      weekday: '09:00 – 21:00',
      saturday: '09:00 – 18:00',
      sunday: '公休',
      holiday: '依公告，請來電確認',
    },
    transport: {
      mrt: { station: '南京復興站 2 號出口', desc: '出站後沿南京東路三段方向步行約 3 分鐘。' },
      bus: { stop: '南京復興站', desc: '多條公車路線可達。' },
      car: { desc: '南京東路三段，近南京復興捷運站。' },
      parking: { desc: '附近有公共停車場，或路邊停車格。' },
    },
    googleMapUrl: 'https://maps.google.com/?q=台北市中山區南京東路三段29號',
    geo: { lat: 25.0522, lng: 121.5443 },
  },
  'songjiang': {
    id: 'songjiang',
    name: '松江店',
    district: '台北市中山區',
    address: '松江路 122 號 B1',
    postalCode: '104',
    phone: '(02) 2537-1055',
    phoneRaw: '+886225371055',
    description: '位於台北市松江路商圈，捷運松江南京站步行 5 分鐘。專業物理治療師教練團隊。',
    businessHours: {
      weekday: '09:00 – 21:00',
      saturday: '09:00 – 18:00',
      sunday: '公休',
      holiday: '依公告，請來電確認',
    },
    transport: {
      mrt: { station: '松江南京站 4 號出口', desc: '出站後沿松江路方向步行約 5 分鐘。' },
      bus: { stop: '松江南京站', desc: '多條公車路線可達。' },
      car: { desc: '松江路，近松江南京捷運站。' },
      parking: { desc: '附近有公共停車場。' },
    },
    googleMapUrl: 'https://maps.google.com/?q=台北市中山區松江路122號',
    geo: { lat: 25.0531, lng: 121.5332 },
  },
  'ximending': {
    id: 'ximending',
    name: '西門店',
    district: '台北市中正區',
    address: '寶慶路 39 號',
    postalCode: '100',
    phone: '(02) 2370-3245',
    phoneRaw: '+886223703245',
    description: '位於西門町商圈，捷運西門站步行 3 分鐘。鄰近交通便利，適合各年齡層。',
    businessHours: {
      weekday: '09:00 – 21:00',
      saturday: '09:00 – 18:00',
      sunday: '公休',
      holiday: '依公告，請來電確認',
    },
    transport: {
      mrt: { station: '西門站 6 號出口', desc: '出站後沿寶慶路方向步行約 3 分鐘。' },
      bus: { stop: '西門站', desc: '多條公車路線可達。' },
      car: { desc: '寶慶路，近西門捷運站。' },
      parking: { desc: '附近有多處公共停車場。' },
    },
    googleMapUrl: 'https://maps.google.com/?q=台北市中正區寶慶路39號',
    geo: { lat: 25.0423, lng: 121.5069 },
  },
}

const store = computed(() => storesData[storeSlug])

// 取得其他分店（排除當前分店）
const otherStores = computed(() => {
  return Object.values(storesData).filter((s: any) => s.id !== storeSlug)
})

// 處理 404
if (!store.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '找不到此門店'
  })
}

useHead({
  title: `練健康${store.value.name}｜${store.value.district}中高齡肌力訓練`,
  meta: [
    {
      name: 'description',
      content: `練健康${store.value.name}，位於${store.value.district}${store.value.address}。專業物理治療師背景教練，50歲以上首次體驗完全免費。`
    }
  ]
})

// 門店照片
const photos = [
  { label: '主訓練區', span: true, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop&q=80' },
  { label: '一對一訓練空間', span: false, image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=450&fit=crop&q=80' },
  { label: '專業器材區', span: false, image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=450&fit=crop&q=80' },
  { label: '功能性訓練區', span: false, image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=450&fit=crop&q=80' },
  { label: '舒適休息區', span: false, image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&h=450&fit=crop&q=80' },
]

// 各門店教練資料
const coachesByStore: Record<string, any[]> = {
  xindian: [
    { id: 'xd-1', name: '李哲宇', roleTitle: '店主管・物理治療師・教練', specialties: ['動作優化訓練', '骨骼肌肉系統傷害後訓練', '中高齡肌力訓練'], photo: '/images/coaches/xindian/li-zheyu.jpg' },
    { id: 'xd-2', name: '劉軒豪', roleTitle: '物理治療師・教練', specialties: ['中高齡族群肌力訓練', '骨骼肌肉系統傷害後訓練', '退化性關節炎訓練', '懸吊系統訓練'], photo: '/images/coaches/xindian/liu-xuanhao.png' },
    { id: 'xd-3', name: '柯雲翔', roleTitle: '物理治療師・教練', specialties: ['中高齡族群肌力訓練', '慢性疼痛族群肌力訓練', '動作控制優化訓練'], photo: '/images/coaches/xindian/ke-yunxiang.png' },
    { id: 'xd-4', name: '林學禮', roleTitle: '物理治療師・教練', specialties: ['姿勢控制與骨盆穩定', '呼吸訓練', '術後族群肌力訓練', '脊椎與核心控制訓練'], photo: '/images/coaches/xindian/lin-xueli.png' },
    { id: 'xd-5', name: '楊百恩', roleTitle: '物理治療師・教練', specialties: ['動作控制訓練', '骨骼肌肉系統傷害後訓練', '中高齡肌力訓練'], photo: '/images/coaches/xindian/yang-baien.png' },
    { id: 'xd-6', name: '陳宣戎', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '懸吊系統訓練', '皮拉提斯訓練', '腰椎骨盆穩定訓練'], photo: '/images/coaches/xindian/chen-xuanrong.jpg' },
    { id: 'xd-7', name: '陳冠翰', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '懸吊系統訓練', '腰椎骨盆穩定訓練'], photo: '/images/coaches/xindian/chen-guanhan.png' },
    { id: 'xd-8', name: '姚舜瀚', roleTitle: '教練', specialties: ['中高齡肌力訓練', '青少年運動表現訓練', '運動員肌力訓練'], photo: '/images/coaches/xindian/yao-shunhan.png' },
    { id: 'xd-9', name: '林芳妤', roleTitle: '教練', specialties: ['中高齡肌力訓練', '核心穩定訓練', '皮拉提斯課程'], photo: '/images/coaches/xindian/lin-fangyu.png' },
    { id: 'xd-10', name: '鄭健寬', roleTitle: '教練', specialties: ['身心動作教育', '特殊族群訓練', '中高齡肌力訓練', '功能性動作訓練'], photo: '/images/coaches/xindian/zheng-jiankuan.png' },
  ],
  nanjing: [
    { id: 'nj-1', name: '蕭彥嶸', roleTitle: '店主管・物理治療師・教練', specialties: ['動作優化訓練', '骨骼肌肉系統傷害後訓練', '中高齡肌力訓練'], photo: '/images/coaches/nanjing/xiao-yanrong.png' },
    { id: 'nj-2', name: '鄭宇劭', roleTitle: '副店主管・物理治療師・教練', specialties: ['中高齡肌力訓練', '運動表現提升', '術後復健訓練'], photo: '/images/coaches/nanjing/zheng-yushao.png' },
    { id: 'nj-3', name: '謝季宏', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '動作控制訓練', '神經系統疾患訓練'], photo: '/images/coaches/nanjing/xie-jihong.png' },
    { id: 'nj-4', name: '林星辰', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '骨骼肌肉系統傷害後訓練', '姿勢矯正訓練'], photo: '/images/coaches/nanjing/lin-xingchen.png' },
    { id: 'nj-5', name: '鍾尚哲', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '神經系統疾患訓練', '平衡訓練'], photo: '/images/coaches/nanjing/zhong-shangzhe.png' },
    { id: 'nj-6', name: '許逸陽', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '動作控制訓練', '皮拉提斯訓練'], photo: '/images/coaches/nanjing/xu-yiyang.png' },
    { id: 'nj-7', name: '李昆穆', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '長照族群訓練', '平衡與步態訓練'], photo: '/images/coaches/nanjing/li-kunmu.png' },
    { id: 'nj-8', name: '楊宛珧', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '皮拉提斯訓練', '女性健康訓練'], photo: '/images/coaches/nanjing/yang-wanyao.png' },
    { id: 'nj-9', name: '王韻婷', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '動作控制訓練', 'GYROKINESIS® 訓練'], photo: '/images/coaches/nanjing/wang-yunting.png' },
    { id: 'nj-10', name: '劉心維', roleTitle: '教練', specialties: ['中高齡肌力訓練', '體態雕塑', '功能性訓練'], photo: '/images/coaches/nanjing/liu-xinwei.png' },
    { id: 'nj-11', name: '王文郁', roleTitle: '教練', specialties: ['中高齡肌力訓練', '核心訓練', '體態調整'], photo: '/images/coaches/nanjing/wang-wenyu.png' },
    { id: 'nj-12', name: '李才昇', roleTitle: '教練', specialties: ['中高齡肌力訓練', '運動表現訓練', '爆發力訓練'], photo: '/images/coaches/nanjing/li-caisheng.png' },
    { id: 'nj-13', name: '蔡秉杰', roleTitle: '教練', specialties: ['中高齡肌力訓練', '體態雕塑', '減脂訓練'], photo: '/images/coaches/nanjing/cai-bingjie.png' },
    { id: 'nj-14', name: '沈思彤', roleTitle: '教練', specialties: ['中高齡肌力訓練', '瑜珈課程', '柔軟度訓練'], photo: '/images/coaches/nanjing/shen-sitong.png' },
  ],
  songjiang: [
    { id: 'sj-1', name: '王均佑', roleTitle: '店主管・物理治療師・教練', specialties: ['動作優化訓練', '骨骼肌肉系統傷害後訓練', '中高齡肌力訓練'], photo: '/images/coaches/songjiang/wang-junyou.jpg' },
    { id: 'sj-2', name: '劉育銘', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '骨骼肌肉系統傷害後訓練', '姿勢矯正訓練'], photo: '/images/coaches/songjiang/liu-yuming.jpg' },
    { id: 'sj-3', name: '徐睿揚', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '神經系統疾患訓練', '平衡訓練'], photo: '/images/coaches/songjiang/xu-ruiyang.jpg' },
    { id: 'sj-4', name: '陳重光', roleTitle: '教練', specialties: ['中高齡肌力訓練', '功能性訓練', '運動表現訓練'], photo: '/images/coaches/songjiang/chen-zhongguang.jpg' },
    { id: 'sj-5', name: '張承玴', roleTitle: '教練', specialties: ['中高齡肌力訓練', '壺鈴訓練', '體態雕塑'], photo: '/images/coaches/songjiang/zhang-chengxi.jpg' },
  ],
  ximending: [
    { id: 'xm-1', name: '陳亮宇', roleTitle: '店主管・物理治療師・教練', specialties: ['動作優化訓練', '骨骼肌肉系統傷害後訓練', '中高齡肌力訓練'], photo: '/images/coaches/ximending/chen-liangyu.png' },
    { id: 'xm-2', name: '林亞儒', roleTitle: '副店主管・物理治療師・教練', specialties: ['中高齡肌力訓練', '皮拉提斯訓練', '女性健康訓練'], photo: '/images/coaches/ximending/lin-yaru.png' },
    { id: 'xm-3', name: '趙世剛', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '骨骼肌肉系統傷害後訓練', '姿勢矯正訓練'], photo: '/images/coaches/ximending/zhao-shigang.png' },
    { id: 'xm-4', name: '吳貫宇', roleTitle: '呼吸治療師・教練', specialties: ['中高齡肌力訓練', '心肺功能訓練', '術後族群訓練'], photo: '/images/coaches/ximending/wu-guanyu.png' },
    { id: 'xm-5', name: '鍾緯沛', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '皮拉提斯訓練', '動作控制訓練'], photo: '/images/coaches/ximending/zhong-weipei.png' },
    { id: 'xm-6', name: '范瑞瑜', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '骨骼肌肉系統傷害後訓練', '平衡訓練'], photo: '/images/coaches/ximending/fan-ruiyu.jpg' },
    { id: 'xm-7', name: '陳品瀚', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '動作控制訓練', '核心穩定訓練'], photo: '/images/coaches/ximending/chen-pinhan.png' },
    { id: 'xm-8', name: '朱兆煜', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '骨骼肌肉系統傷害後訓練', '動作優化訓練'], photo: '/images/coaches/ximending/zhu-zhaoyu.png' },
    { id: 'xm-9', name: '陳詠佑', roleTitle: '物理治療師・教練', specialties: ['中高齡肌力訓練', '神經系統疾患訓練', '平衡與步態訓練'], photo: '/images/coaches/ximending/chen-yongyou.png' },
    { id: 'xm-10', name: '許雅淇', roleTitle: '教練', specialties: ['中高齡肌力訓練', '核心訓練', '體態雕塑'], photo: '/images/coaches/ximending/xu-yaqi.png' },
    { id: 'xm-11', name: '林哲玄', roleTitle: '教練', specialties: ['中高齡肌力訓練', '功能性訓練', '運動表現訓練'], photo: '/images/coaches/ximending/lin-zhexuan.png' },
    { id: 'xm-12', name: '邱子豪', roleTitle: '教練', specialties: ['中高齡肌力訓練', '壺鈴訓練', '體態雕塑'], photo: '/images/coaches/ximending/qiu-zihao.png' },
    { id: 'xm-13', name: '陳泊維', roleTitle: '教練', specialties: ['中高齡肌力訓練', '功能性訓練', '減脂訓練'], photo: '/images/coaches/ximending/chen-bowei.png' },
    { id: 'xm-14', name: '林誌楷', roleTitle: '教練', specialties: ['中高齡肌力訓練', '運動表現訓練', '懸吊訓練'], photo: '/images/coaches/ximending/lin-zhikai.png' },
  ],
}

// 取得當前門店的教練
const coaches = coachesByStore[storeSlug] || []
</script>

<template>
  <div v-if="store" class="min-h-screen bg-cream-100">
    <!-- Hero Section -->
    <section class="relative bg-navy-700 pt-16 overflow-hidden min-h-[68vh] flex items-center">
      <!-- Background effects -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(251,114,10,0.10)_0%,transparent_50%),radial-gradient(circle_at_5%_75%,rgba(42,82,105,0.5)_0%,transparent_45%)]" />
        <div
          class="absolute inset-0 opacity-[0.022]"
          :style="{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }"
        />
      </div>

      <div class="container mx-auto px-4 relative z-10 py-12 lg:py-20">
        <div class="max-w-2xl">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-1.5 text-xs text-white/35 mb-5">
            <NuxtLink to="/" class="hover:text-white/70 transition-colors">練健康</NuxtLink>
            <span class="text-white/20">›</span>
            <NuxtLink to="/locations" class="hover:text-white/70 transition-colors">門店地點</NuxtLink>
            <span class="text-white/20">›</span>
            <span>{{ store.name }}</span>
          </nav>

          <!-- District badge -->
          <div class="inline-flex items-center gap-2 bg-orange/15 border border-orange/30 text-orange text-xs font-medium px-3 py-1 rounded-full mb-4 tracking-wide">
            <span class="w-1.5 h-1.5 bg-orange rounded-full" />
            {{ store.district }}
          </div>

          <h1 class="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            練健康<span class="text-orange">{{ store.name }}</span><br />
            中高齡肌力訓練
          </h1>

          <p class="text-white/65 text-lg font-light leading-relaxed mb-8 max-w-lg">
            {{ store.description }}
          </p>

          <div class="flex gap-3 flex-wrap">
            <NuxtLink
              to="/booking"
              class="inline-flex items-center gap-2 bg-orange text-white font-bold px-7 py-3 rounded-full shadow-lg shadow-orange/35 hover:bg-orange-400 transition-colors"
            >
              立即預約體驗 →
            </NuxtLink>
            <a
              :href="`tel:${store.phoneRaw}`"
              class="inline-flex items-center gap-2 bg-white/[0.08] text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/15 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 011 1.18 2 2 0 013 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
              </svg>
              直接來電
            </a>
          </div>

          <div class="flex items-center gap-2 mt-4 text-sm text-white/45">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span><strong class="text-orange">50歲以上完全免費</strong>・一般首次體驗 $500</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Access Section -->
    <section class="bg-white py-16 lg:py-20">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span class="w-5 h-0.5 bg-orange" />
          交通指引
        </div>
        <h2 class="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-8">
          怎麼<span class="text-orange">找到我們</span>
        </h2>

        <div class="grid lg:grid-cols-2 gap-8 items-start">
          <!-- Google Maps Embed -->
          <div class="aspect-[4/3] bg-cream-100 rounded-2xl shadow-lg overflow-hidden relative">
            <iframe
              :src="`https://www.google.com/maps?q=${store.geo.lat},${store.geo.lng}&z=16&output=embed`"
              width="100%"
              height="100%"
              style="border: 0"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              :title="`${store.name} 地圖`"
              class="absolute inset-0"
            />
            <a
              :href="store.googleMapUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-navy-700 font-medium text-sm px-4 py-2 rounded-full shadow-lg hover:bg-white transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              在 Google Maps 開啟
            </a>
          </div>

          <!-- Transport info -->
          <div>
            <div class="space-y-3">
              <div class="flex gap-3 items-start p-4 bg-cream-100 rounded-xl border border-navy-700/15">
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-green-600 text-white flex-shrink-0 mt-0.5">捷運</span>
                <div class="text-sm text-ink/70 leading-relaxed">
                  <strong class="text-navy-700">{{ store.transport.mrt.station }}</strong><br />
                  {{ store.transport.mrt.desc }}
                </div>
              </div>

              <div class="flex gap-3 items-start p-4 bg-cream-100 rounded-xl border border-navy-700/15">
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-orange text-white flex-shrink-0 mt-0.5">公車</span>
                <div class="text-sm text-ink/70 leading-relaxed">
                  <strong class="text-navy-700">{{ store.transport.bus.stop }}</strong><br />
                  {{ store.transport.bus.desc }}
                </div>
              </div>

              <div class="flex gap-3 items-start p-4 bg-cream-100 rounded-xl border border-navy-700/15">
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-navy-700 text-white flex-shrink-0 mt-0.5">開車</span>
                <div class="text-sm text-ink/70 leading-relaxed">
                  <strong class="text-navy-700">{{ store.district }}{{ store.address }}</strong><br />
                  {{ store.transport.car.desc }}
                </div>
              </div>

              <div class="flex gap-3 items-start p-4 bg-cream-100 rounded-xl border border-navy-700/15">
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-ink/50 text-white flex-shrink-0 mt-0.5">停車</span>
                <div class="text-sm text-ink/70 leading-relaxed">
                  <strong class="text-navy-700">建議使用附近公共停車場</strong><br />
                  {{ store.transport.parking.desc }}
                </div>
              </div>
            </div>

            <!-- Hours table -->
            <div class="mt-6 border border-navy-700/15 rounded-xl overflow-hidden">
              <div class="grid grid-cols-2">
                <div class="px-4 py-3 text-sm font-medium text-navy-700 bg-cream-100">週一 – 週五</div>
                <div class="px-4 py-3 text-sm text-ink/70">{{ store.businessHours.weekday }}</div>
              </div>
              <div class="grid grid-cols-2 border-t border-navy-700/15">
                <div class="px-4 py-3 text-sm font-medium text-navy-700 bg-cream-100">週六</div>
                <div class="px-4 py-3 text-sm text-ink/70">{{ store.businessHours.saturday }}</div>
              </div>
              <div class="grid grid-cols-2 border-t border-navy-700/15">
                <div class="px-4 py-3 text-sm font-medium text-navy-700 bg-cream-100">週日</div>
                <div class="px-4 py-3 text-sm text-ink/70">{{ store.businessHours.sunday }}</div>
              </div>
              <div class="grid grid-cols-2 border-t border-navy-700/15">
                <div class="px-4 py-3 text-sm font-medium text-navy-700 bg-cream-100">國定假日</div>
                <div class="px-4 py-3 text-sm text-ink/70">{{ store.businessHours.holiday || '依公告，請來電確認' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Coaches Section -->
    <section v-if="coaches.length > 0" class="bg-cream-100 py-16 lg:py-20">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
              <span class="w-5 h-0.5 bg-orange" />
              本店教練
            </div>
            <h2 class="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-3">
              認識<span class="text-orange">你的教練</span>
            </h2>
            <p class="text-ink/60 leading-relaxed max-w-xl">
              每位教練都有醫療或專業運動科學背景，我們相信讓你在第一次見面前就認識教練，是降低陌生感最好的方式。
            </p>
          </div>
        </div>

        <!-- Coach Carousel -->
        <CoachCarousel :coaches="coaches" />
      </div>
    </section>

    <!-- Photos Section -->
    <section class="bg-white py-16 lg:py-20">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span class="w-5 h-0.5 bg-orange" />
          門店環境
        </div>
        <h2 class="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-3">
          來之前<span class="text-orange">先看看</span>
        </h2>
        <p class="text-ink/60 leading-relaxed mb-8 max-w-xl">
          專業的訓練空間，安靜、不擁擠，沒有一般健身房的喧鬧。教練和學員的比例讓每個人都能得到充分的關注。
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            v-for="photo in photos"
            :key="photo.label"
            :class="[
              'aspect-[4/3] rounded-xl overflow-hidden relative group',
              photo.span ? 'md:col-span-2 md:aspect-video' : ''
            ]"
          >
            <img
              :src="photo.image"
              :alt="photo.label"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-navy-700/70 via-transparent to-transparent" />
            <span class="absolute bottom-4 left-4 text-sm font-medium text-white">
              {{ photo.label }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-navy-700 py-16 lg:py-20 text-center">
      <div class="container mx-auto px-4">
        <h2 class="font-serif text-3xl lg:text-4xl font-black text-white mb-3">
          {{ store.name }}，等你來
        </h2>
        <p class="text-white/70 mb-8">
          從捷運站走過來只要幾分鐘，第一堂 50 歲以上完全免費。
        </p>
        <NuxtLink
          to="/booking"
          class="inline-flex items-center gap-2 bg-orange text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          立即預約體驗 →
        </NuxtLink>
        <div class="mt-4 text-white/50 text-sm">
          或直接來電：<a :href="`tel:${store.phoneRaw}`" class="text-white font-medium hover:text-orange transition-colors">{{ store.phone }}</a>
        </div>
      </div>
    </section>

    <!-- Other Stores Section -->
    <section class="bg-orange py-10 lg:py-12 text-center">
      <div class="container mx-auto px-4">
        <h3 class="font-serif text-xl lg:text-2xl font-bold text-white mb-2">
          其他分店選擇
        </h3>
        <p class="text-white/80 text-sm mb-6">
          若{{ store.name }}不方便，歡迎參考其他分店
        </p>

        <!-- Other stores grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
          <NuxtLink
            v-for="otherStore in otherStores"
            :key="otherStore.id"
            :to="`/locations/${otherStore.id}`"
            class="group bg-white rounded-xl px-5 py-4 text-left shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-serif text-base font-bold text-navy-700 group-hover:text-orange transition-colors">
                  {{ otherStore.name }}
                </h4>
                <p class="text-xs text-ink/50">{{ otherStore.district }}</p>
              </div>
              <span class="w-6 h-6 rounded-full bg-orange/10 flex items-center justify-center text-orange group-hover:bg-orange group-hover:text-white transition-colors">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
