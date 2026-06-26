import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { db, StoreDoc, docsToArray } from '@/lib/firebase';

// Force dynamic rendering for Firestore data
export const dynamic = 'force-dynamic';

// 靜態門店資料（備援用）
const fallbackStores = [
  {
    id: 'nanjing',
    name: '南京店',
    district: '台北市中山區',
    address: '台北市中山區南京東路三段 29 號 B1',
    phone: '(02) 2507-4196',
    mrt: '捷運南京復興站 步行3分鐘',
    features: ['一對一訓練', '團體課程'],
    coachCount: 3,
  },
  {
    id: 'songjiang',
    name: '松江店',
    district: '台北市中山區',
    address: '台北市中山區松江路 122 號 B1',
    phone: '請來電詢問',
    mrt: '捷運松江南京站 步行2分鐘',
    features: ['一對一訓練'],
    coachCount: 2,
  },
  {
    id: 'ximending',
    name: '西門店',
    district: '台北市中正區',
    address: '台北市中正區寶慶路 39 號',
    phone: '(02) 2370-3245',
    mrt: '捷運西門站 步行5分鐘',
    features: ['一對一訓練', '團體課程'],
    coachCount: 2,
  },
  {
    id: 'xindian',
    name: '新店七張店',
    district: '新北市新店區',
    address: '新北市新店區北新路二段 252 號 B1-2',
    phone: '(02) 8914-6428',
    mrt: '捷運七張站 步行1分鐘',
    features: ['一對一訓練', '寬敞空間'],
    coachCount: 3,
  },
];

// 從 Firestore 取得門店資料
async function getStores() {
  try {
    const storesSnapshot = await db
      .collection('stores')
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc')
      .get();

    const stores = docsToArray<StoreDoc>(storesSnapshot);

    // 計算每個門店的教練數量
    const storeCoachCounts = new Map<string, number>();
    const coachesSnapshot = await db
      .collection('coaches')
      .where('isActive', '==', true)
      .get();
    coachesSnapshot.docs.forEach((doc) => {
      const storeId = doc.data().storeId;
      if (storeId) {
        storeCoachCounts.set(storeId, (storeCoachCounts.get(storeId) || 0) + 1);
      }
    });

    return stores.map((store) => ({
      id: store.slug,
      name: store.name,
      district: `${store.city || ''}${store.district || ''}`,
      address: store.address || '',
      phone: store.phone || '',
      mrt: store.transportation || '',
      features: [], // TODO: 可從資料庫新增 features 欄位
      coachCount: storeCoachCounts.get(store.id) || 0,
    }));
  } catch (error) {
    console.error('Failed to fetch stores from Firestore, using fallback data:', error);
    return fallbackStores;
  }
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home.locations' });
  return {
    title: '門店地點｜練健康 LKK Wellness',
    description: '練健康在大台北地區有 4 間分店，新店七張、南京、松江、西門，每間都鄰近捷運站。50歲以上首次體驗完全免費。',
  };
}

// Hero Section
function HeroSection({ storeCount }: { storeCount: number }) {
  return (
    <section className="relative bg-navy-700 pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(251,114,10,0.10)_0%,transparent_55%),radial-gradient(circle_at_5%_75%,rgba(58,106,133,0.3)_0%,transparent_45%)]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-orange/20 border border-orange/40 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-5">
          <span className="w-2 h-2 bg-orange rounded-full" />
          全台 {storeCount} 間門店
        </div>

        <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
          找到離你最近的<span className="text-orange">練健康</span>
        </h1>

        <p className="text-white/60 text-lg font-light leading-relaxed mb-8 max-w-xl mx-auto">
          每間門店都鄰近捷運站，由物理治療師背景教練帶領，專為中高齡及特殊族群打造的訓練環境。
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-white/40">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span><strong className="text-orange-300">50歲以上免費</strong>・一般首次 $500・不強迫買課</span>
        </div>
      </div>
    </section>
  );
}

// Stats Bar
function StatsBar({ storeCount }: { storeCount: number }) {
  const stats = [
    { num: String(storeCount), label: '間門店' },
    { num: '1,000+', label: '服務學員' },
    { num: '7 年', label: '深耕中高齡' },
    { num: '100%', label: '鄰近捷運' },
  ];

  return (
    <div className="bg-white border-b border-navy-700/15">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-navy-700/15">
          {stats.map((stat) => (
            <div key={stat.label} className="py-5 text-center">
              <div className="font-serif text-2xl lg:text-3xl font-black text-navy-700">{stat.num}</div>
              <div className="text-xs text-ink/50 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Store type
type Store = {
  id: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  mrt: string;
  features: string[];
  coachCount: number;
};

// Store Card
function StoreCard({ store, index }: { store: Store; index: number }) {
  return (
    <Link
      href={`/locations/${store.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-navy-700/15 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
    >
      {/* Store image placeholder */}
      <div className="aspect-video bg-gradient-to-br from-navy-700 to-navy-700/80 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-5xl font-black text-white/20">{store.name.charAt(0)}</span>
        </div>
        {/* Number badge */}
        <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-orange flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {index + 1}
        </div>
        {/* District badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-medium text-navy-700 px-3 py-1 rounded-full">
          {store.district}
        </div>
      </div>

      {/* Store info */}
      <div className="p-5">
        <h2 className="font-serif text-xl font-black text-navy-700 mb-2 group-hover:text-orange transition-colors">
          {store.name}
        </h2>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm text-ink/60">
            <svg className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{store.address}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-ink/60">
            <svg className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{store.mrt}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {store.features.map((feature) => (
            <span key={feature} className="text-xs font-medium text-navy-700 bg-navy-700/[0.08] px-2.5 py-0.5 rounded-full">
              {feature}
            </span>
          ))}
        </div>

        {/* Phone & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-700/10">
          <span className="text-orange font-semibold">{store.phone}</span>
          <span className="text-sm text-navy-700 font-medium group-hover:text-orange transition-colors">
            查看詳情 →
          </span>
        </div>
      </div>
    </Link>
  );
}

// Stores Grid
function StoresGrid({ stores }: { stores: Store[] }) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stores.map((store, idx) => (
            <StoreCard key={store.id} store={store} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Map Section
function MapSection({ stores }: { stores: Store[] }) {
  return (
    <section className="bg-white py-12 lg:py-16 border-t border-navy-700/15">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
            <span className="w-5 h-0.5 bg-orange" />
            門店分布
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700">
            全台<span className="text-orange">{stores.length} 間分店</span>
          </h2>
        </div>

        {/* Map placeholder */}
        <div className="aspect-[16/7] bg-cream-100 rounded-2xl border border-navy-700/15 flex flex-col items-center justify-center text-center p-8">
          <div className="font-serif text-lg font-bold text-navy-700 mb-2">Google Maps 總覽</div>
          <p className="text-ink/50 text-sm">{stores.map((s) => s.name).join('・')}</p>
        </div>

        {/* Store quick links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/locations/${store.id}`}
              className="flex items-center gap-3 p-4 bg-cream-100 rounded-xl border border-navy-700/15 hover:border-orange/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-orange/15 flex items-center justify-center text-orange font-bold text-sm flex-shrink-0">
                {store.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-navy-700 text-sm truncate">{store.name}</div>
                <div className="text-xs text-ink/50 truncate">{store.district}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Reason Icon Component
function ReasonIcon({ type }: { type: string }) {
  const iconClass = "w-8 h-8 text-orange";
  switch (type) {
    case 'medical':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case 'transit':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h8m-8 4h8m-4 8V7m-4 12h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 'senior':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case 'free':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
}

// Why Choose Section
function WhyChooseSection() {
  const reasons = [
    {
      iconType: 'medical',
      title: '物理治療師背景',
      desc: '每間門店都有物理治療師或運動科學專業教練，安全是最高原則。',
    },
    {
      iconType: 'transit',
      title: '捷運三分鐘可達',
      desc: '所有門店都在捷運站步行範圍內，不管刮風下雨都能輕鬆抵達。',
    },
    {
      iconType: 'senior',
      title: '專為中高齡設計',
      desc: '70% 學員都是 50 歲以上，環境安靜、不擁擠、沒有壓力。',
    },
    {
      iconType: 'free',
      title: '50歲以上免費體驗',
      desc: '不是試課，是真正完整的 60-75 分鐘體驗課，讓我們先了解你。',
    },
  ];

  return (
    <section className="bg-cream-100 py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
            <span className="w-5 h-0.5 bg-orange" />
            為什麼選擇練健康
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700">
            每一間店都是<span className="text-orange">同樣的堅持</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => (
            <div key={reason.title} className="bg-white rounded-2xl p-6 border border-navy-700/15 shadow-sm">
              <div className="mb-4"><ReasonIcon type={reason.iconType} /></div>
              <h3 className="font-bold text-navy-700 mb-2">{reason.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="bg-orange py-16 lg:py-20 text-center">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl lg:text-4xl font-black text-white mb-3">
          找到離你最近的門店了嗎？
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          立即預約免費體驗，由我們的專業教練帶領你開始第一步。
        </p>
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 bg-white text-orange font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          立即預約體驗 →
        </Link>
        <div className="mt-4 text-white/60 text-sm">
          50歲以上完全免費・不強迫買課
        </div>
      </div>
    </section>
  );
}

export default async function LocationsPage() {
  const stores = await getStores();

  return (
    <div className="min-h-screen bg-cream-100">
      <HeroSection storeCount={stores.length} />
      <StatsBar storeCount={stores.length} />
      <StoresGrid stores={stores} />
      <MapSection stores={stores} />
      <WhyChooseSection />
      <CTASection />
    </div>
  );
}
