import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { db, CoachDoc, StoreDoc, docsToArray } from '@/lib/firebase';

// Force dynamic rendering for Firestore data
export const dynamic = 'force-dynamic';

// 從 Firestore 取得教練資料
async function getCoaches() {
  // 取得所有門店的 Map（用於對照 storeId）
  const storesSnapshot = await db
    .collection('stores')
    .where('isActive', '==', true)
    .get();
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

  return coaches.map((coach) => {
    const store = coach.storeId ? storesMap.get(coach.storeId) : null;
    return {
      id: coach.id,
      name: coach.name,
      slug: coach.slug,
      title: coach.roleTitle || '',
      store: store?.name || '',
      storeId: store?.slug || '',
      specialties: coach.specialties || [],
      certifications: coach.certifications || [],
      description: coach.description || '',
      photo: coach.photo,
    };
  });
}

// 從 Firestore 取得門店列表
async function getStoreNames() {
  const storesSnapshot = await db
    .collection('stores')
    .where('isActive', '==', true)
    .orderBy('sortOrder', 'asc')
    .get();
  const stores = docsToArray<StoreDoc>(storesSnapshot);
  return ['全部', ...stores.map((s) => s.name)];
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'home.team' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function TeamPage() {
  const t = await getTranslations('home.team');
  const coaches = await getCoaches();
  const stores = await getStoreNames();

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 font-serif">{t('title')}</h1>
          <p className="text-cream-200 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      {/* Filter - 暫時靜態，後續可改為互動 */}
      <section className="border-b border-cream-200 sticky top-16 bg-cream-100 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {stores.map((store, index) => (
              <button
                key={store}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  index === 0
                    ? 'bg-orange text-white'
                    : 'bg-cream-200 text-ink-600 hover:bg-cream-300'
                }`}
              >
                {store}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Coach List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coaches.map((coach) => (
              <div
                key={coach.id}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Coach Image */}
                <div className="aspect-square relative bg-cream-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-24 h-24 text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                {/* Coach Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-navy-700 font-serif">{coach.name}</h2>
                      <p className="text-orange">{coach.title}</p>
                    </div>
                    <Link
                      href={`/locations/${coach.storeId}`}
                      className="text-sm text-ink-500 hover:text-orange"
                    >
                      {coach.store}
                    </Link>
                  </div>

                  <p className="text-ink-600 text-sm mb-4 line-clamp-2">{coach.description}</p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {coach.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-orange/10 text-orange text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Certifications */}
                  <div className="pt-4 border-t border-cream-200">
                    <p className="text-xs text-ink-500 mb-2">專業認證</p>
                    <div className="flex flex-wrap gap-2">
                      {coach.certifications.map((cert) => (
                        <span key={cert} className="text-xs text-ink-600">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-navy-700 font-serif">找到適合您的教練了嗎？</h2>
          <p className="text-ink-600 mb-8">預約免費體驗，讓專業教練為您評估並制定訓練計畫</p>
          <Link href="/booking" className="btn btn-primary">
            立即預約
          </Link>
        </div>
      </section>
    </div>
  );
}
