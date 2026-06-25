import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db, CoachDoc, StoreDoc, docsToArray } from '@/lib/firebase';

// Force dynamic rendering for Firestore data
export const dynamic = 'force-dynamic';

// 從 Firestore 取得單一教練資料
async function getCoach(slug: string) {
  const coachesSnapshot = await db
    .collection('coaches')
    .where('slug', '==', slug)
    .where('isActive', '==', true)
    .limit(1)
    .get();

  if (coachesSnapshot.empty) {
    return null;
  }

  const coaches = docsToArray<CoachDoc>(coachesSnapshot);
  const coach = coaches[0];

  // 取得關聯的門店資料
  let store = null;
  if (coach.storeId) {
    const storeDoc = await db.collection('stores').doc(coach.storeId).get();
    if (storeDoc.exists) {
      const storeData = storeDoc.data() as StoreDoc;
      store = {
        id: storeDoc.id,
        name: storeData.name,
        slug: storeData.slug,
      };
    }
  }

  return { ...coach, store };
}

// 取得同門店的其他教練
async function getOtherCoaches(currentCoachId: string, storeId?: string) {
  let query = db
    .collection('coaches')
    .where('isActive', '==', true)
    .orderBy('sortOrder', 'asc')
    .limit(4);

  const coachesSnapshot = await query.get();
  const coaches = docsToArray<CoachDoc>(coachesSnapshot);

  return coaches
    .filter((c) => c.id !== currentCoachId)
    .slice(0, 3);
}

export async function generateMetadata({ params }: { params: { coach: string } }) {
  const coach = await getCoach(params.coach);
  if (!coach) return {};

  return {
    title: `${coach.name}｜練健康教練團隊`,
    description: coach.description || `${coach.name}，${coach.roleTitle}。專業教練為您提供安全有效的肌力訓練指導。`,
  };
}

// Hero Section
function HeroSection({ coach }: { coach: any }) {
  return (
    <section className="relative bg-navy-700 pt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(251,114,10,0.12)_0%,transparent_50%),radial-gradient(circle_at_85%_75%,rgba(42,82,105,0.5)_0%,transparent_45%)]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[340px_1fr] gap-12 items-center">
          {/* Left - Photo */}
          <div className="flex justify-center lg:justify-start">
            <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-2xl bg-white/[0.08] border border-white/12 overflow-hidden flex items-center justify-center">
              {coach.photo ? (
                <img
                  src={coach.photo}
                  alt={coach.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <svg className="w-24 h-24 text-white/20 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-serif text-4xl font-black text-white/30">{coach.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right - Info */}
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-white/35 mb-5">
              <Link href="/" className="hover:text-white/70 transition-colors">練健康</Link>
              <span className="text-white/20">/</span>
              <Link href="/team" className="hover:text-white/70 transition-colors">教練團隊</Link>
              <span className="text-white/20">/</span>
              <span>{coach.name}</span>
            </nav>

            {/* Store badge */}
            {coach.store && (
              <Link
                href={`/locations/${coach.store.slug}`}
                className="inline-flex items-center gap-2 bg-orange/15 border border-orange/30 text-orange text-xs font-medium px-3 py-1 rounded-full mb-4 tracking-wide hover:bg-orange/25 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {coach.store.name}
              </Link>
            )}

            <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-2">
              {coach.name}<span className="text-orange"> 教練</span>
            </h1>

            <p className="text-orange text-xl font-semibold mb-6">{coach.roleTitle}</p>

            {/* Specialties */}
            {coach.specialties && coach.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {coach.specialties.map((specialty: string) => (
                  <span
                    key={specialty}
                    className="px-3 py-1.5 bg-white/[0.08] border border-white/12 text-white/80 text-sm rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-orange text-white font-bold px-7 py-3 rounded-full shadow-lg shadow-orange/35 hover:bg-orange-400 transition-colors"
              >
                預約體驗課程
              </Link>
              {coach.store && (
                <Link
                  href={`/locations/${coach.store.slug}`}
                  className="inline-flex items-center gap-2 bg-white/[0.08] text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/15 transition-colors"
                >
                  查看服務門店
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection({ coach }: { coach: any }) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
            <span className="w-5 h-0.5 bg-orange" />
            關於教練
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-6">
            認識<span className="text-orange">{coach.name}</span>
          </h2>

          {coach.description ? (
            <p className="text-ink/70 text-lg leading-relaxed whitespace-pre-line">
              {coach.description}
            </p>
          ) : (
            <p className="text-ink/50 text-lg leading-relaxed">
              {coach.name}教練專精於中高齡肌力訓練，以安全、有效的訓練方法，幫助學員建立健康的運動習慣。
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// Credentials Section
function CredentialsSection({ coach }: { coach: any }) {
  const hasCredentials =
    (coach.certifications && coach.certifications.length > 0) ||
    (coach.experiences && coach.experiences.length > 0) ||
    (coach.education && coach.education.length > 0);

  if (!hasCredentials) return null;

  return (
    <section className="bg-cream-100 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange" />
          專業資歷
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-8">
          專業<span className="text-orange">背景與認證</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Certifications */}
          {coach.certifications && coach.certifications.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-navy-700/10">
              <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-700 mb-3">專業認證</h3>
              <ul className="space-y-2">
                {coach.certifications.map((cert: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-ink/70 text-sm">
                    <svg className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Experiences */}
          {coach.experiences && coach.experiences.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-navy-700/10">
              <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-700 mb-3">實務經歷</h3>
              <ul className="space-y-2">
                {coach.experiences.map((exp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-ink/70 text-sm">
                    <svg className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {exp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Education */}
          {coach.education && coach.education.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-navy-700/10">
              <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-700 mb-3">學歷背景</h3>
              <ul className="space-y-2">
                {coach.education.map((edu: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-ink/70 text-sm">
                    <svg className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {edu}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Other Coaches Section
function OtherCoachesSection({ coaches, currentCoachId }: { coaches: any[]; currentCoachId: string }) {
  if (coaches.length === 0) return null;

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange" />
          更多教練
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-8">
          認識<span className="text-orange">其他教練</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coaches.map((coach) => (
            <Link
              key={coach.id}
              href={`/team/${coach.slug}`}
              className="bg-cream-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 border border-navy-700/10"
            >
              {/* Photo */}
              <div className="aspect-[4/3] bg-navy-700/5 flex items-center justify-center">
                {coach.photo ? (
                  <img
                    src={coach.photo}
                    alt={coach.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-16 h-16 text-navy-700/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold text-navy-700 mb-1">{coach.name} 教練</h3>
                <p className="text-orange text-sm mb-3">{coach.roleTitle}</p>
                {coach.specialties && coach.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {coach.specialties.slice(0, 3).map((specialty: string) => (
                      <span
                        key={specialty}
                        className="text-xs text-navy-700/60 bg-navy-700/[0.06] px-2 py-0.5 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-sm text-navy-700 border border-navy-700/15 px-6 py-2.5 rounded-full hover:border-navy-700 transition-colors"
          >
            查看全體教練
          </Link>
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection({ coach }: { coach: any }) {
  return (
    <section className="bg-orange py-16 lg:py-20 text-center">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl lg:text-4xl font-black text-white mb-3">
          讓{coach.name}教練帶你開始
        </h2>
        <p className="text-white/80 mb-8">
          50 歲以上首次體驗完全免費，專業評估 + 客製化訓練建議
        </p>
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 bg-white text-orange font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          立即預約體驗
        </Link>
      </div>
    </section>
  );
}

export default async function CoachPage({ params }: { params: { coach: string } }) {
  const coach = await getCoach(params.coach);

  if (!coach) {
    notFound();
  }

  const otherCoaches = await getOtherCoaches(coach.id, coach.storeId);

  return (
    <div className="min-h-screen bg-cream-100">
      <HeroSection coach={coach} />
      <AboutSection coach={coach} />
      <CredentialsSection coach={coach} />
      <OtherCoachesSection coaches={otherCoaches} currentCoachId={coach.id} />
      <CTASection coach={coach} />
    </div>
  );
}
