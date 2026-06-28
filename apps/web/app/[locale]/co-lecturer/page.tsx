import Link from 'next/link';
import { db, LecturerDoc, docsToArray } from '@/lib/firebase';

// Force dynamic rendering for Firestore data
export const dynamic = 'force-dynamic';

export const metadata = {
  title: '合作講師｜練健康 LKK Wellness',
  description: '練健康合作講師網絡，匯集各領域專業人才，共同推廣中高齡健康訓練。',
};

// 合作講師 fallback 資料
const partnerLecturers = [
  {
    id: 'zhuo-yanting',
    name: '卓彥廷',
    title: '復健科醫師',
    photo: '/images/lecturers/partner/zhuo-yanting.png',
    organization: '天母力康診所',
    description: '復健科專科醫師，致力於將臨床醫學與運動科學深度結合，強調訓練策略而非僅消除疼痛。',
    specialties: ['骨骼肌肉傷害', '運動醫學', '疼痛治療', '特殊族群運動處方'],
    certifications: ['復健科專科醫師', '前台北慈濟醫院復健科主治醫師', 'CAK 認證', 'Dynamic tape 認證', 'PNF 認證'],
  },
  {
    id: 'chen-yanzhi',
    name: '陳彥志',
    title: '骨科醫師',
    photo: '/images/lecturers/partner/chen-yanzhi.png',
    organization: '光田綜合醫院運動醫學科',
    description: '骨科專科醫師，整合臨床骨科與系統化訓練指導，強調安全的動作優化。',
    specialties: ['運動傷害動作評估', '手術評估', '超音波導引注射', '運動處方介入'],
    certifications: ['骨科專科醫師', 'NASM-CES 矯正運動專家', 'NSCA-CSPS 特殊族群訓練專家', '光田綜合醫院運動醫學科主任'],
  },
  {
    id: 'lu-changshuo',
    name: '盧昶碩',
    nickname: 'Justin',
    title: '運動專業講師',
    photo: '/images/lecturers/partner/lu-changshuo.png',
    organization: '動思學院/運動解密 創辦人',
    description: '專精運動專項肌力與體能訓練，曾培訓多支國家代表隊，著有《把私人教練帶回家》。',
    specialties: ['運動專項肌力與體能訓練', '全人教育', '運動心理學'],
    certifications: ['ACE-CPT', 'NSCA-CSCS', 'P3 應用運動科學', '衛福部預防及延緩失能協助員'],
  },
];

// 從 Firestore 取得合作講師資料
async function getPartnerLecturers() {
  try {
    const lecturersSnapshot = await db
      .collection('lecturers')
      .where('isActive', '==', true)
      .where('type', '==', 'partner')
      .orderBy('sortOrder', 'asc')
      .get();

    const lecturers = docsToArray<LecturerDoc>(lecturersSnapshot);
    if (lecturers.length === 0) {
      return partnerLecturers;
    }
    return lecturers;
  } catch (error) {
    console.error('Failed to fetch partner lecturers:', error);
    return partnerLecturers;
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
          <span>合作講師</span>
        </nav>

        <div className="inline-flex items-center bg-orange/20 border border-orange/40 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-5">
          跨領域專業合作講師
        </div>

        <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
          合作<span className="text-orange">講師</span>
        </h1>

        <p className="text-white/60 text-lg font-light leading-relaxed max-w-2xl mx-auto">
          練健康與各領域專業人才合作，結合物理治療、運動科學、營養學等專業，提供全方位的健康訓練服務。
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
          <h3 className="font-serif text-xl font-bold text-navy-700">
            {lecturer.name}
            {lecturer.nickname && <span className="text-navy-700/50 font-normal ml-2">{lecturer.nickname}</span>}
          </h3>
          <p className="text-orange font-semibold text-sm">{lecturer.title}</p>
          {lecturer.organization && (
            <p className="text-ink/50 text-xs mt-1">{lecturer.organization}</p>
          )}
        </div>

        <p className="text-ink/60 text-sm leading-relaxed mb-3">{lecturer.description}</p>

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

// Partners Grid
function PartnersGrid({ lecturers }: { lecturers: any[] }) {
  if (lecturers.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-ink/60">目前暫無合作講師資料</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
          <span className="w-5 h-0.5 bg-orange" />
          醫療專業合作
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-8">
          練健康<span className="text-orange">合作講師</span>
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

// Collaboration Section
function CollaborationSection() {
  const benefits = [
    {
      title: '專業知識交流',
      description: '定期舉辦專業研討會，促進跨領域知識分享與交流。',
      icon: (
        <svg className="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: '課程共同開發',
      description: '結合不同專業背景，開發更完整的訓練課程。',
      icon: (
        <svg className="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: '資源共享網絡',
      description: '建立專業人才網絡，共享資源與轉介服務。',
      icon: (
        <svg className="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-cream-100 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-3">
            <span className="w-5 h-0.5 bg-orange" />
            合作優勢
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700">
            跨領域<span className="text-orange">合作效益</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white rounded-2xl p-6 border border-navy-700/10 shadow-sm text-center"
            >
              <div className="mb-4 flex justify-center">{benefit.icon}</div>
              <h3 className="font-bold text-navy-700 mb-2">{benefit.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{benefit.description}</p>
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
          有興趣成為合作講師？
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          歡迎各領域專業人士加入練健康合作講師網絡，一起推廣中高齡健康訓練。
        </p>
        <Link
          href="/cooperation"
          className="inline-flex items-center gap-2 bg-white text-orange font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          洽談合作 →
        </Link>
      </div>
    </section>
  );
}

export default async function PartnerLecturerPage() {
  const lecturers = await getPartnerLecturers();

  return (
    <div className="min-h-screen bg-cream-100">
      <HeroSection />
      <PartnersGrid lecturers={lecturers} />
      <CollaborationSection />
      <CTASection />
    </div>
  );
}
