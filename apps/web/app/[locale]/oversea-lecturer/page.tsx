import Link from 'next/link';
import { db, LecturerDoc, docsToArray } from '@/lib/firebase';

// Force dynamic rendering for Firestore data
export const dynamic = 'force-dynamic';

export const metadata = {
  title: '海外授權講師｜練健康 LKK Wellness',
  description: '練健康海外授權講師網絡，將專業中高齡訓練系統推廣至國際市場。',
};

// 海外授權講師 fallback 資料
const overseasLecturers = [
  {
    id: 'zhou-qianmei',
    name: '周千媚',
    title: '海外授權講師',
    photo: '/images/lecturers/overseas/zhou-qianmei.png',
    region: '馬來西亞',
    countries: ['馬來西亞'],
    description: '練健康首位海外授權講師，將台灣專業的中高齡訓練系統引進馬來西亞，推廣安全有效的銀髮健身課程。',
    specialties: ['中高齡肌力訓練', '特殊族群訓練'],
    certifications: ['練健康授權講師認證'],
  },
];

// 從 Firestore 取得海外講師資料
async function getOverseasLecturers() {
  try {
    const lecturersSnapshot = await db
      .collection('lecturers')
      .where('isActive', '==', true)
      .where('type', '==', 'overseas')
      .orderBy('sortOrder', 'asc')
      .get();

    const lecturers = docsToArray<LecturerDoc>(lecturersSnapshot);
    if (lecturers.length === 0) {
      return overseasLecturers;
    }
    return lecturers;
  } catch (error) {
    console.error('Failed to fetch overseas lecturers:', error);
    return overseasLecturers;
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
          <span>海外授權講師</span>
        </nav>

        <div className="inline-flex items-center gap-2 bg-orange/20 border border-orange/40 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-5">
          <span className="w-2 h-2 bg-orange rounded-full" />
          國際授權網絡
        </div>

        <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
          海外授權<span className="text-orange">講師</span>
        </h1>

        <p className="text-white/60 text-lg font-light leading-relaxed max-w-2xl mx-auto">
          練健康將專業的中高齡訓練系統推廣至海外，透過授權講師網絡，讓更多人受益於安全有效的訓練方法。
        </p>
      </div>
    </section>
  );
}

// Lecturer Card Component
function LecturerCard({ lecturer }: { lecturer: any }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-lg border border-navy-700/10 hover:-translate-y-1 transition-transform">
      <div className="aspect-square bg-gradient-to-br from-navy-700 to-navy-700/80 relative">
        {lecturer.photo ? (
          <img
            src={lecturer.photo}
            alt={lecturer.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-7xl font-black text-white/20">{lecturer.name.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-serif text-xl font-bold text-navy-700">{lecturer.name}</h3>
          <p className="text-orange font-semibold text-sm">{lecturer.title}</p>
          {lecturer.region && (
            <p className="text-ink/50 text-xs mt-1">{lecturer.region}</p>
          )}
        </div>

        {lecturer.description && (
          <p className="text-ink/60 text-sm leading-relaxed mb-3">{lecturer.description}</p>
        )}

        {/* Specialties */}
        {lecturer.specialties && lecturer.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {lecturer.specialties.map((spec: string) => (
              <span
                key={spec}
                className="text-xs font-medium text-white bg-orange px-2.5 py-1 rounded-full"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Certifications */}
        {lecturer.certifications && lecturer.certifications.length > 0 && (
          <div className="pt-3 border-t border-navy-700/10">
            <div className="flex flex-wrap gap-1.5">
              {lecturer.certifications.map((cert: string) => (
                <span key={cert} className="text-xs text-navy-700/70 bg-navy-700/[0.06] px-2 py-0.5 rounded">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

// Lecturers Grid
function LecturersGrid({ lecturers }: { lecturers: any[] }) {
  if (lecturers.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange" />
          授權講師
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-8">
          海外<span className="text-orange">授權講師</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {lecturers.map((lecturer) => (
            <LecturerCard key={lecturer.id} lecturer={lecturer} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Authorization Process
function AuthorizationProcess() {
  const steps = [
    {
      num: '01',
      title: '申請洽談',
      description: '有興趣的專業人士可透過聯絡表單提出申請，我們會安排初步洽談。',
    },
    {
      num: '02',
      title: '資格審核',
      description: '審核申請者的專業背景、經驗與當地市場狀況。',
    },
    {
      num: '03',
      title: '培訓認證',
      description: '完成練健康核心課程培訓，取得授權講師認證。',
    },
    {
      num: '04',
      title: '正式授權',
      description: '簽署授權合約，獲得在地區內使用練健康品牌與課程的授權。',
    },
  ];

  return (
    <section className="bg-cream-100 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-3">
            <span className="w-5 h-0.5 bg-orange" />
            授權流程
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700">
            如何成為<span className="text-orange">授權講師</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-orange/20 -translate-x-1/2" />
              )}

              <div className="bg-white rounded-2xl p-6 border border-navy-700/10 shadow-sm text-center relative">
                <div className="w-12 h-12 rounded-full bg-orange text-white font-serif font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-navy-700 mb-2">{step.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{step.description}</p>
              </div>
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
          想在海外推廣練健康？
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          歡迎海外專業人士加入練健康授權講師網絡，將專業訓練帶到您的國家。
        </p>
        <Link
          href="/cooperation"
          className="inline-flex items-center gap-2 bg-white text-orange font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          申請授權 →
        </Link>
      </div>
    </section>
  );
}

export default async function OverseasLecturerPage() {
  const lecturers = await getOverseasLecturers();

  return (
    <div className="min-h-screen bg-cream-100">
      <HeroSection />
      <LecturersGrid lecturers={lecturers} />
      <AuthorizationProcess />
      <CTASection />
    </div>
  );
}
