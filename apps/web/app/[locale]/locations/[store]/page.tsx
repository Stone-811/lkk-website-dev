import Link from 'next/link';
import { notFound } from 'next/navigation';

// Force dynamic rendering for next-intl
export const dynamic = 'force-dynamic';

// 暫用假資料，後續從 CMS API 取得
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
    },
    transport: {
      mrt: { station: '新店七張站 1 號出口', desc: '出站後沿北新路方向直行，約步行 3 分鐘，大樓入口在便利商店旁，下樓梯至 B1-2。' },
      bus: { stop: '七張站', desc: '849、綠12、綠14、橘12 等路線均可抵達，下車後步行 2 分鐘。' },
      car: { desc: '沿北新路往新店方向，過七張路口後即可見到，大樓地下室入口在右側。' },
      parking: { desc: '七張捷運站旁有公共停車場（收費），或北新路沿線路邊停車格。地下室停車空間有限，請提前確認。' },
    },
    googleMapUrl: 'https://maps.google.com/?q=新北市新店區北新路二段252號',
    geo: { lat: 24.9682, lng: 121.5396 },
    coaches: [
      {
        id: '1',
        name: '鄭宇劭',
        role: '物理治療師・總教練',
        bio: '世大運場館經理、競速滑冰世界盃隨隊物理治療師出身，深耕中高齡運動訓練逾十年。擅長從身體結構評估問題根源，課表設計以「安全有感」為核心。',
        tags: ['物理治療師', '中高齡訓練', '術後復健', '世大運'],
      },
      {
        id: '2',
        name: '吳貫宇',
        role: '呼吸治療師',
        bio: '彰化基督教醫院呼吸治療師背景，將呼吸功能訓練整合進肌力課程，特別擅長服務心肺功能較弱或術後族群，讓學員在安全前提下有效提升體能。',
        tags: ['呼吸治療師', '心肺訓練', '特殊族群'],
      },
    ],
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
    },
    transport: {
      mrt: { station: '南京復興站 2 號出口', desc: '出站後沿南京東路三段方向步行約 3 分鐘。' },
      bus: { stop: '南京復興站', desc: '多條公車路線可達。' },
      car: { desc: '南京東路三段，近南京復興捷運站。' },
      parking: { desc: '附近有公共停車場，或路邊停車格。' },
    },
    googleMapUrl: 'https://maps.google.com/?q=台北市中山區南京東路三段29號',
    geo: { lat: 25.0522, lng: 121.5443 },
    coaches: [],
  },
  'songjiang': {
    id: 'songjiang',
    name: '松江店',
    district: '台北市中山區',
    address: '松江路 122 號 B1',
    postalCode: '104',
    phone: '(02) 2542-6898',
    phoneRaw: '+886225426898',
    description: '位於台北市松江路商圈，捷運松江南京站步行 5 分鐘。專業物理治療師教練團隊。',
    businessHours: {
      weekday: '09:00 – 21:00',
      saturday: '09:00 – 18:00',
      sunday: '公休',
    },
    transport: {
      mrt: { station: '松江南京站 4 號出口', desc: '出站後沿松江路方向步行約 5 分鐘。' },
      bus: { stop: '松江南京站', desc: '多條公車路線可達。' },
      car: { desc: '松江路，近松江南京捷運站。' },
      parking: { desc: '附近有公共停車場。' },
    },
    googleMapUrl: 'https://maps.google.com/?q=台北市中山區松江路122號',
    geo: { lat: 25.0531, lng: 121.5332 },
    coaches: [],
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
    },
    transport: {
      mrt: { station: '西門站 6 號出口', desc: '出站後沿寶慶路方向步行約 3 分鐘。' },
      bus: { stop: '西門站', desc: '多條公車路線可達。' },
      car: { desc: '寶慶路，近西門捷運站。' },
      parking: { desc: '附近有多處公共停車場。' },
    },
    googleMapUrl: 'https://maps.google.com/?q=台北市中正區寶慶路39號',
    geo: { lat: 25.0423, lng: 121.5069 },
    coaches: [],
  },
};

const allStores = Object.values(storesData);

export async function generateStaticParams() {
  return Object.keys(storesData).map((store) => ({ store }));
}

export async function generateMetadata({ params }: { params: { store: string } }) {
  const store = storesData[params.store];
  if (!store) return {};

  return {
    title: `練健康${store.name}｜${store.district}中高齡肌力訓練`,
    description: `練健康${store.name}，位於${store.district}${store.address}。專業物理治療師背景教練，50歲以上首次體驗完全免費。`,
  };
}

// Hero Section
function HeroSection({ store }: { store: any }) {
  return (
    <section className="relative bg-navy-700 pt-16 overflow-hidden min-h-[68vh] flex items-center">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(251,114,10,0.10)_0%,transparent_50%),radial-gradient(circle_at_5%_75%,rgba(42,82,105,0.5)_0%,transparent_45%)]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-center">
          {/* Left content */}
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-white/35 mb-5">
              <Link href="/" className="hover:text-white/70 transition-colors">練健康</Link>
              <span className="text-white/20">›</span>
              <Link href="/locations" className="hover:text-white/70 transition-colors">門店地點</Link>
              <span className="text-white/20">›</span>
              <span>{store.name}</span>
            </nav>

            {/* District badge */}
            <div className="inline-flex items-center gap-2 bg-orange/15 border border-orange/30 text-orange text-xs font-medium px-3 py-1 rounded-full mb-4 tracking-wide">
              <span className="w-1.5 h-1.5 bg-orange rounded-full" />
              {store.district}
            </div>

            <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              練健康<span className="text-orange">{store.name}</span><br />
              中高齡肌力訓練
            </h1>

            <p className="text-white/65 text-lg font-light leading-relaxed mb-8 max-w-lg">
              {store.description}
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-orange text-white font-bold px-7 py-3 rounded-full shadow-lg shadow-orange/35 hover:bg-orange-400 transition-colors"
              >
                立即預約體驗 →
              </Link>
              <a
                href={`tel:${store.phoneRaw}`}
                className="inline-flex items-center gap-2 bg-white/[0.08] text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/15 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 011 1.18 2 2 0 013 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
                </svg>
                直接來電
              </a>
            </div>

            <div className="flex items-center gap-2 mt-4 text-sm text-white/45">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span><strong className="text-orange">50歲以上完全免費</strong>・一般首次體驗 $500</span>
            </div>
          </div>

          {/* Right - Info Card */}
          <aside className="hidden lg:block bg-white/[0.07] backdrop-blur-sm border border-white/12 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex gap-3 items-start pb-4 border-b border-white/[0.08]">
                <div className="w-9 h-9 rounded-lg bg-orange/20 flex items-center justify-center text-base flex-shrink-0">📍</div>
                <div>
                  <div className="text-[0.7rem] text-white/35 mb-0.5 tracking-wide">地址</div>
                  <div className="text-sm text-white leading-relaxed">{store.district}<br />{store.address}</div>
                </div>
              </div>

              <div className="flex gap-3 items-start pb-4 border-b border-white/[0.08]">
                <div className="w-9 h-9 rounded-lg bg-orange/20 flex items-center justify-center text-base flex-shrink-0">📞</div>
                <div>
                  <div className="text-[0.7rem] text-white/35 mb-0.5 tracking-wide">電話</div>
                  <a href={`tel:${store.phoneRaw}`} className="text-sm text-orange">{store.phone}</a>
                </div>
              </div>

              <div className="flex gap-3 items-start pb-4 border-b border-white/[0.08]">
                <div className="w-9 h-9 rounded-lg bg-orange/20 flex items-center justify-center text-base flex-shrink-0">🕐</div>
                <div>
                  <div className="text-[0.7rem] text-white/35 mb-0.5 tracking-wide">營業時間</div>
                  <div className="text-sm text-white leading-relaxed">
                    週一至五 {store.businessHours.weekday}<br />
                    週六 {store.businessHours.saturday}<br />
                    週日 {store.businessHours.sunday}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-lg bg-orange/20 flex items-center justify-center text-base flex-shrink-0">🚇</div>
                <div>
                  <div className="text-[0.7rem] text-white/35 mb-0.5 tracking-wide">捷運</div>
                  <div className="text-sm text-white leading-relaxed">
                    {store.transport.mrt.station}<br />
                    步行約 3 分鐘
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// Access Section
function AccessSection({ store }: { store: any }) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange" />
          交通指引
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-8">
          怎麼<span className="text-orange">找到我們</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Map placeholder */}
          <div className="aspect-[4/3] bg-cream-100 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-8">
            <div className="font-serif text-lg font-bold text-navy-700 mb-2">Google Maps 嵌入</div>
            <p className="text-ink/50 text-sm mb-4">{store.district}{store.address}</p>
            <a
              href={store.googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy-700 font-medium text-sm hover:text-orange transition-colors"
            >
              在 Google Maps 開啟 →
            </a>
          </div>

          {/* Transport info */}
          <div>
            <div className="space-y-3">
              <div className="flex gap-3 items-start p-4 bg-cream-100 rounded-xl border border-navy-700/15">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-600 text-white flex-shrink-0 mt-0.5">捷運</span>
                <div className="text-sm text-ink/70 leading-relaxed">
                  <strong className="text-navy-700">{store.transport.mrt.station}</strong><br />
                  {store.transport.mrt.desc}
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 bg-cream-100 rounded-xl border border-navy-700/15">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange text-white flex-shrink-0 mt-0.5">公車</span>
                <div className="text-sm text-ink/70 leading-relaxed">
                  <strong className="text-navy-700">{store.transport.bus.stop}</strong><br />
                  {store.transport.bus.desc}
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 bg-cream-100 rounded-xl border border-navy-700/15">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-navy-700 text-white flex-shrink-0 mt-0.5">開車</span>
                <div className="text-sm text-ink/70 leading-relaxed">
                  <strong className="text-navy-700">{store.district}{store.address}</strong><br />
                  {store.transport.car.desc}
                </div>
              </div>

              <div className="flex gap-3 items-start p-4 bg-cream-100 rounded-xl border border-navy-700/15">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-ink/50 text-white flex-shrink-0 mt-0.5">停車</span>
                <div className="text-sm text-ink/70 leading-relaxed">
                  <strong className="text-navy-700">建議使用附近公共停車場</strong><br />
                  {store.transport.parking.desc}
                </div>
              </div>
            </div>

            {/* Hours table */}
            <div className="mt-6 border border-navy-700/15 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="px-4 py-3 text-sm font-medium text-navy-700 bg-cream-100">週一 – 週五</div>
                <div className="px-4 py-3 text-sm text-ink/70">{store.businessHours.weekday}</div>
              </div>
              <div className="grid grid-cols-2 border-t border-navy-700/15">
                <div className="px-4 py-3 text-sm font-medium text-navy-700 bg-cream-100">週六</div>
                <div className="px-4 py-3 text-sm text-ink/70">{store.businessHours.saturday}</div>
              </div>
              <div className="grid grid-cols-2 border-t border-navy-700/15">
                <div className="px-4 py-3 text-sm font-medium text-ink/50 bg-cream-100">週日</div>
                <div className="px-4 py-3 text-sm text-ink/50">{store.businessHours.sunday}</div>
              </div>
              <div className="grid grid-cols-2 border-t border-navy-700/15">
                <div className="px-4 py-3 text-xs text-ink/50 bg-cream-100">國定假日</div>
                <div className="px-4 py-3 text-xs text-ink/50">依公告，請來電確認</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Coaches Section
function CoachesSection({ store }: { store: any }) {
  if (!store.coaches || store.coaches.length === 0) return null;

  return (
    <section className="bg-cream-100 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange" />
          本店教練
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-3">
          認識<span className="text-orange">你的教練</span>
        </h2>
        <p className="text-ink/60 leading-relaxed mb-8 max-w-xl">
          每位教練都有醫療或專業運動科學背景，我們相信讓你在第一次見面前就認識教練，是降低陌生感最好的方式。
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {store.coaches.map((coach: any) => (
            <article key={coach.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-navy-700/15 hover:-translate-y-1 transition-transform">
              {/* Photo placeholder */}
              <div className="h-56 bg-gradient-to-br from-navy-700 to-navy-700/80 flex items-center justify-center relative">
                <span className="font-serif text-6xl font-black text-white/25">{coach.name.charAt(0)}</span>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-navy-700/70 to-transparent" />
              </div>

              <div className="p-5">
                <div className="font-serif text-lg font-bold text-navy-700 mb-0.5">{coach.name} 教練</div>
                <div className="text-sm text-orange font-semibold mb-3 tracking-wide">{coach.role}</div>
                <p className="text-sm text-ink/60 leading-relaxed mb-4">{coach.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {coach.tags.map((tag: string) => (
                    <span key={tag} className="text-xs font-medium text-navy-700 bg-navy-700/[0.08] px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-sm text-navy-700 border border-navy-700/15 px-6 py-2.5 rounded-full hover:border-navy-700 transition-colors"
          >
            查看全體教練介紹 →
          </Link>
        </div>
      </div>
    </section>
  );
}

// Photos Section
function PhotosSection({ store }: { store: any }) {
  const photos = [
    { label: '主訓練區', span: true },
    { label: '一對一訓練空間', span: false },
    { label: '入口 / 接待區', span: false },
    { label: '器材區', span: false },
    { label: '休息與更衣區', span: false },
  ];

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange" />
          門店環境
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-3">
          來之前<span className="text-orange">先看看</span>
        </h2>
        <p className="text-ink/60 leading-relaxed mb-8 max-w-xl">
          B1-2 的訓練空間，安靜、不擁擠，沒有一般健身房的喧鬧。教練和學員的比例讓每個人都能得到充分的關注。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {photos.map((photo, idx) => (
            <div
              key={photo.label}
              className={`aspect-[4/3] bg-navy-700 rounded-xl flex items-center justify-center ${
                photo.span ? 'md:col-span-2 md:aspect-video' : ''
              }`}
            >
              <span className="text-xs text-white/40 text-center px-4">
                {photo.label}<br />（實際照片請替換）
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Cases Teaser Section
function CasesTeaser() {
  return (
    <section className="bg-cream-100 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 lg:p-10 border border-navy-700/15 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
                <span className="w-5 h-0.5 bg-orange" />
                學員案例
              </div>
              <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-3">
                真實改變<span className="text-orange">不是口號</span>
              </h2>
              <p className="text-ink/60 leading-relaxed mb-6 max-w-md">
                70歲的阿嬤、中風後的復健、術後重建體力——超過千位學員的故事，都在這裡。看看和你有相同起點的人，是怎麼開始改變的。
              </p>
              <Link
                href="https://l-kk.tw/category/%e6%a1%88%e4%be%8b%e5%88%86%e4%ba%ab/"
                className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-orange/35 hover:bg-orange-400 transition-colors"
              >
                看所有學員案例 →
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {[
                { num: '1,000+', label: '服務學員人次' },
                { num: '50+', label: '歲以上佔多數' },
                { num: '5 年+', label: '深耕中高齡訓練' },
              ].map((stat) => (
                <div key={stat.label} className="flex-1 p-5 bg-cream-100 rounded-xl border border-navy-700/10">
                  <div className="font-serif text-3xl font-black text-orange leading-none">{stat.num}</div>
                  <div className="text-sm text-ink/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Other Stores Section
function OtherStoresSection({ currentStoreId }: { currentStoreId: string }) {
  const otherStores = allStores.filter((s) => s.id !== currentStoreId);

  return (
    <section className="bg-navy-700 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm font-bold text-orange/80 tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange/80" />
          其他門店
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-black text-white mb-8">
          這裡不方便？<span className="text-orange">還有其他分店</span>
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {otherStores.map((store, idx) => (
            <Link
              key={store.id}
              href={`/locations/${store.id}`}
              className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-orange/25 flex items-center justify-center text-xs font-bold text-orange mb-3">
                {idx + 1}
              </div>
              <div className="font-serif text-base font-bold text-white mb-1">{store.name}</div>
              <div className="text-xs text-white/45 leading-relaxed mb-2">
                {store.district}<br />{store.address}
              </div>
              <div className="text-xs text-orange">{store.phone} →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection({ store }: { store: any }) {
  return (
    <section className="bg-orange py-16 lg:py-20 text-center">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl lg:text-4xl font-black text-white mb-3">
          {store.name}，等你來
        </h2>
        <p className="text-white/80 mb-8">
          從捷運站走過來只要幾分鐘，第一堂 50 歲以上完全免費。
        </p>
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 bg-white text-orange font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          立即預約體驗 →
        </Link>
        <div className="mt-4 text-white/60 text-sm">
          或直接來電：<a href={`tel:${store.phoneRaw}`} className="text-white font-medium">{store.phone}</a>
        </div>
      </div>
    </section>
  );
}

export default function StorePage({ params }: { params: { store: string } }) {
  const store = storesData[params.store];

  if (!store) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <HeroSection store={store} />
      <AccessSection store={store} />
      <CoachesSection store={store} />
      <PhotosSection store={store} />
      <CasesTeaser />
      <OtherStoresSection currentStoreId={store.id} />
      <CTASection store={store} />
    </div>
  );
}
