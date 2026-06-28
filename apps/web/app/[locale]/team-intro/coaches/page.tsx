import Link from 'next/link';
import { db, CoachDoc, StoreDoc, docsToArray } from '@/lib/firebase';
import { fallbackCoaches, Coach } from '@/lib/fallback-coaches';

// Force dynamic rendering for Firestore data
export const dynamic = 'force-dynamic';

export const metadata = {
  title: '全體教練｜練健康 LKK Wellness',
  description: '練健康專業教練團隊，由物理治療師與運動科學專家組成，專注於中高齡健康訓練。',
};

// 門店名稱對照
const storeNames: Record<string, string> = {
  xindian: '新店七張店',
  nanjing: '南京店',
  songjiang: '松江店',
  ximending: '西門店',
};

// 從 fallback 資料取得所有教練
function getFallbackCoaches() {
  const allCoaches: any[] = [];
  Object.entries(fallbackCoaches).forEach(([storeSlug, coaches]) => {
    coaches.forEach((coach) => {
      allCoaches.push({
        id: coach.id,
        name: coach.name,
        slug: coach.id,
        title: coach.roleTitle || '',
        store: storeNames[storeSlug] || '',
        storeSlug: storeSlug,
        specialties: coach.specialties || [],
        certifications: coach.certifications || [],
        description: '',
        photo: coach.photo,
      });
    });
  });
  return allCoaches;
}

// 從 Firestore 取得教練資料
async function getCoaches() {
  try {
    // 取得所有門店的 Map（用於對照 storeId）
    const storesSnapshot = await db
      .collection('stores')
      .where('isActive', '==', true)
      .get();

    // 如果 Firestore 沒有門店資料，使用 fallback
    if (storesSnapshot.empty) {
      console.log('No stores in Firestore, using fallback coaches data');
      return getFallbackCoaches();
    }

    const storesMap = new Map<string, { name: string; slug: string }>();
    storesSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      storesMap.set(doc.id, { name: data.name, slug: data.slug });
    });

    // 取得所有活躍教練
    const coachesSnapshot = await db
      .collection('coaches')
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc')
      .get();

    const coaches = docsToArray<CoachDoc>(coachesSnapshot);

    // 如果 Firestore 沒有教練資料，使用 fallback
    if (coaches.length === 0) {
      console.log('No coaches in Firestore, using fallback coaches data');
      return getFallbackCoaches();
    }

    return coaches.map((coach) => {
      const store = coach.storeId ? storesMap.get(coach.storeId) : null;
      return {
        id: coach.id,
        name: coach.name,
        slug: coach.slug,
        title: coach.roleTitle || '',
        store: store?.name || '',
        storeSlug: store?.slug || '',
        specialties: coach.specialties || [],
        certifications: coach.certifications || [],
        description: coach.description || '',
        photo: coach.photo,
      };
    });
  } catch (error) {
    console.error('Failed to fetch coaches from Firestore, using fallback:', error);
    return getFallbackCoaches();
  }
}

// 從 Firestore 取得門店列表
async function getStores() {
  try {
    const storesSnapshot = await db
      .collection('stores')
      .where('isActive', '==', true)
      .orderBy('sortOrder', 'asc')
      .get();
    const stores = docsToArray<StoreDoc>(storesSnapshot);

    // 如果 Firestore 沒有資料，使用 fallback
    if (stores.length === 0) {
      return [
        { name: '新店七張店', slug: 'xindian' },
        { name: '南京店', slug: 'nanjing' },
        { name: '松江店', slug: 'songjiang' },
        { name: '西門店', slug: 'ximending' },
      ];
    }

    return stores.map((s) => ({ name: s.name, slug: s.slug }));
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    // 使用 fallback
    return [
      { name: '新店七張店', slug: 'xindian' },
      { name: '南京店', slug: 'nanjing' },
      { name: '松江店', slug: 'songjiang' },
      { name: '西門店', slug: 'ximending' },
    ];
  }
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative bg-navy-700 pt-16 overflow-hidden">
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
        <nav className="flex items-center justify-center gap-1.5 text-xs text-white/35 mb-6">
          <Link href="/" className="hover:text-white/70 transition-colors">練健康</Link>
          <span className="text-white/20">›</span>
          <Link href="/team-intro" className="hover:text-white/70 transition-colors">團隊介紹</Link>
          <span className="text-white/20">›</span>
          <span>全體教練</span>
        </nav>

        <div className="inline-flex items-center bg-orange/20 border border-orange/40 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-5">
          物理治療背景專業教練
        </div>

        <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
          全體<span className="text-orange">教練</span>
        </h1>

        <p className="text-white/60 text-lg font-light leading-relaxed max-w-2xl mx-auto">
          每位教練都有物理治療師或醫療專業背景，專精於中高齡與特殊族群訓練，讓您在安全的環境下達到最佳訓練效果。
        </p>
      </div>
    </section>
  );
}

// Store Filter
function StoreFilter({ stores }: { stores: { name: string; slug: string }[] }) {
  return (
    <section className="border-b border-cream-200 sticky top-16 bg-cream-100 z-10">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 py-4 overflow-x-auto">
          <Link
            href="/team-intro/coaches"
            className="px-4 py-2 rounded-full whitespace-nowrap bg-orange text-white"
          >
            全部
          </Link>
          {stores.map((store) => (
            <Link
              key={store.slug}
              href={`/locations/${store.slug}`}
              className="px-4 py-2 rounded-full whitespace-nowrap bg-cream-200 text-ink-600 hover:bg-cream-300 transition-colors"
            >
              {store.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Coach Card
function CoachCard({ coach }: { coach: any }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-navy-700/10">
      {/* Coach Image */}
      <div className="aspect-square relative bg-cream-200">
        {coach.photo ? (
          <img
            src={coach.photo}
            alt={coach.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-700 to-navy-700/80">
            <span className="font-serif text-6xl font-black text-white/20">{coach.name.charAt(0)}</span>
          </div>
        )}
        {/* Store badge */}
        {coach.store && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-medium text-navy-700 px-3 py-1 rounded-full">
            {coach.store}
          </div>
        )}
      </div>

      {/* Coach Info */}
      <div className="p-6">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-navy-700 font-serif">{coach.name}</h2>
          <p className="text-orange font-semibold">{coach.title}</p>
        </div>

        <p className="text-ink/60 text-sm mb-4 line-clamp-2">{coach.description}</p>

        {/* Specialties */}
        {coach.specialties.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {coach.specialties.slice(0, 3).map((specialty: string) => (
              <span
                key={specialty}
                className="px-3 py-1 bg-orange/10 text-orange text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}

        {/* Certifications */}
        {coach.certifications.length > 0 && (
          <div className="pt-4 border-t border-cream-200">
            <p className="text-xs text-ink/40 mb-2">專業認證</p>
            <div className="flex flex-wrap gap-1">
              {coach.certifications.slice(0, 2).map((cert: string) => (
                <span key={cert} className="text-xs text-ink/60">
                  {cert}
                </span>
              ))}
              {coach.certifications.length > 2 && (
                <span className="text-xs text-ink/40">+{coach.certifications.length - 2}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Coaches Grid
function CoachesGrid({ coaches }: { coaches: any[] }) {
  if (coaches.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-ink/60">目前暫無教練資料</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
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
          找到適合您的教練了嗎？
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          預約免費體驗，讓專業教練為您評估並制定訓練計畫。50歲以上首次體驗完全免費。
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

export default async function AllTrainersPage() {
  const [coaches, stores] = await Promise.all([getCoaches(), getStores()]);

  return (
    <div className="min-h-screen bg-cream-100">
      <HeroSection />
      <StoreFilter stores={stores} />
      <CoachesGrid coaches={coaches} />
      <CTASection />
    </div>
  );
}
