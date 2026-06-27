import Link from 'next/link';
import { db, LecturerDoc, docsToArray } from '@/lib/firebase';

// Force dynamic rendering for Firestore data
export const dynamic = 'force-dynamic';

export const metadata = {
  title: '練健康講師｜練健康 LKK Wellness',
  description: '練健康專業講師團隊，提供中高齡健康訓練課程與專業培訓。',
};

// 授權講師 fallback 資料
const authorizedLecturers = [
  {
    id: 'cheng-yushao',
    name: '鄭宇劭',
    title: 'Lv 3 講師・物理治療師',
    photo: '/images/lecturers/lkk/cheng-yushao.png',
    specialties: ['運動專項肌力訓練', '中高齡/特殊族群訓練'],
    certifications: ['競技與教練科學碩士', '物理治療學士'],
  },
  {
    id: 'lin-xingchen',
    name: '林星辰',
    title: 'Lv 1 講師・物理治療師',
    photo: '/images/lecturers/lkk/lin-xingchen.png',
    specialties: ['中高齡/特殊族群訓練', '動作控制', '功能改善'],
    certifications: ['物理治療學系', 'Neurac 認證'],
  },
  {
    id: 'cheng-jiankuan',
    name: '鄭健寬',
    title: 'Lv 1 講師・職能治療師',
    photo: '/images/lecturers/lkk/cheng-jiankuan.png',
    specialties: ['中高齡/特殊族群訓練', '日常功能整合'],
    certifications: ['職能治療學系'],
  },
  {
    id: 'li-boqiao',
    name: '李柏橋',
    title: 'Lv 1 講師',
    photo: '/images/lecturers/lkk/li-boqiao.png',
    specialties: ['健力訓練', '中高齡肌力訓練'],
    certifications: ['NSCA-CPT'],
  },
  {
    id: 'wu-zhenming',
    name: '吳禎明',
    title: 'Lv 1 講師',
    photo: '/images/lecturers/lkk/wu-zhenming.png',
    specialties: ['運動科學檢測', '增肌訓練', '週期化課表設計'],
    certifications: ['NSCA-CSCS', 'ACE-CPT'],
  },
  {
    id: 'wang-yunting',
    name: '王韻婷',
    title: 'Lv 1 講師',
    photo: '/images/lecturers/lkk/wang-yunting.png',
    specialties: ['功能性訓練', '身體組成調整', '壺鈴', '中高齡訓練'],
    certifications: ['NASM-CPT'],
  },
];

// 客座講師 fallback 資料
const guestLecturers = [
  {
    id: 'tseng-tzuhuan',
    name: '曾子桓',
    title: '訓練部區域經理',
    photo: '/images/lecturers/lkk/tseng-tzuhuan.png',
    specialties: ['肌力與體能訓練', '運動表現提升'],
  },
  {
    id: 'wu-haoyu',
    name: '吳皓宇',
    title: '營養師・訓練部副理',
    photo: '/images/lecturers/lkk/wu-haoyu.png',
    specialties: ['運動營養', '增肌減脂', '中高齡訓練'],
  },
  {
    id: 'xiao-yanrong',
    name: '蕭彥嶸',
    title: '運動防護師・南京店店主管',
    photo: '/images/lecturers/lkk/xiao-yanrong.png',
    specialties: ['重訓', '健力', '傷害預防'],
  },
  {
    id: 'li-zheyu',
    name: '李哲宇',
    title: '新店七張店店主管',
    photo: '/images/lecturers/lkk/li-zheyu.png',
    specialties: ['肌力訓練', '功能性動作', '中高齡訓練'],
  },
  {
    id: 'liuchang',
    name: '石峻瑋',
    title: '營運經理',
    photo: '/images/lecturers/lkk/liuchang.png',
    specialties: ['營運管理', '課程規劃'],
  },
  {
    id: 'ruan-wenwen',
    name: '阮玟文',
    title: '品牌經理',
    photo: '/images/lecturers/lkk/ruan-wenwen.png',
    specialties: ['品牌行銷', '課程推廣'],
    certifications: ['NSCA-CPT'],
  },
];

// 從 Firestore 取得練健康講師資料
async function getLkkLecturers() {
  try {
    const lecturersSnapshot = await db
      .collection('lecturers')
      .where('isActive', '==', true)
      .where('type', '==', 'lkk')
      .orderBy('sortOrder', 'asc')
      .get();

    const lecturers = docsToArray<LecturerDoc>(lecturersSnapshot);
    if (lecturers.length === 0) {
      return { authorized: authorizedLecturers, guest: guestLecturers };
    }
    return { authorized: lecturers.filter(l => l.title?.includes('Lv')), guest: lecturers.filter(l => !l.title?.includes('Lv')) };
  } catch (error) {
    console.error('Failed to fetch LKK lecturers:', error);
    return { authorized: authorizedLecturers, guest: guestLecturers };
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
          <span>練健康講師</span>
        </nav>

        <div className="inline-flex items-center gap-2 bg-orange/20 border border-orange/40 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-5">
          <span className="w-2 h-2 bg-orange rounded-full" />
          專業培訓講師
        </div>

        <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
          練健康<span className="text-orange">講師</span>
        </h1>

        <p className="text-white/60 text-lg font-light leading-relaxed max-w-2xl mx-auto">
          由醫療專業背景講師組成，提供系統化的中高齡訓練課程，培養更多專業人才投入銀髮健康產業。
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
        </div>

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

// Instructors Grid
function InstructorsGrid({ data }: { data: { authorized: any[]; guest: any[] } }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* 授權講師 */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
            <span className="w-5 h-0.5 bg-orange" />
            授權講師
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-8">
            練健康<span className="text-orange">認證講師</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {data.authorized.map((lecturer) => (
              <LecturerCard key={lecturer.id} lecturer={lecturer} />
            ))}
          </div>
        </div>

        {/* 客座講師 */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-2">
            <span className="w-5 h-0.5 bg-orange" />
            客座講師
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-8">
            專業<span className="text-orange">客座講師</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {data.guest.map((lecturer) => (
              <LecturerCard key={lecturer.id} lecturer={lecturer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Courses Section
function CoursesSection() {
  const courses = [
    {
      title: '中高齡肌力訓練基礎班',
      duration: '16 小時',
      description: '從解剖學、生理學基礎到實務操作，建立完整的中高齡訓練知識體系。',
    },
    {
      title: '特殊族群訓練進階班',
      duration: '24 小時',
      description: '針對術後、中風、慢性病等特殊族群的訓練策略與注意事項。',
    },
    {
      title: '講師培訓認證課程',
      duration: '40 小時',
      description: '完整的講師培訓計畫，取得練健康認證講師資格。',
    },
  ];

  return (
    <section className="bg-cream-100 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-3">
            <span className="w-5 h-0.5 bg-orange" />
            課程介紹
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700">
            專業<span className="text-orange">培訓課程</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {courses.map((course) => (
            <div
              key={course.title}
              className="bg-white rounded-2xl p-6 border border-navy-700/10 shadow-sm"
            >
              <div className="text-xs font-medium text-orange bg-orange/10 px-3 py-1 rounded-full inline-block mb-4">
                {course.duration}
              </div>
              <h3 className="font-bold text-navy-700 mb-2">{course.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{course.description}</p>
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
          想了解更多課程資訊？
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          歡迎洽詢練健康講師培訓課程，一起投入銀髮健康產業。
        </p>
        <Link
          href="/cooperation"
          className="inline-flex items-center gap-2 bg-white text-orange font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          聯絡我們 →
        </Link>
      </div>
    </section>
  );
}

export default async function LkkLecturerPage() {
  const lecturers = await getLkkLecturers();

  return (
    <div className="min-h-screen bg-cream-100">
      <HeroSection />
      <InstructorsGrid data={lecturers} />
      <CoursesSection />
      <CTASection />
    </div>
  );
}
