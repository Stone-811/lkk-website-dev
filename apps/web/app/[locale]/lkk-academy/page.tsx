import Link from 'next/link';

// Force dynamic rendering for next-intl
export const dynamic = 'force-dynamic';

export const metadata = {
  title: '練健康學院｜專業教練培訓課程',
  description: '練健康學院提供系統化中高齡與特殊族群訓練課程，從入門到進階，培養專業教練人才。',
};

const courses = [
  {
    id: 'training-camp',
    level: '入門',
    levelColor: 'bg-green-500',
    title: '訓練營',
    subtitle: '系統化培訓，助你轉職成為專業教練',
    description: '針對想轉職或入門者的系統性培訓課程，從基礎解剖學到實務操作，建立完整的訓練知識體系。',
    duration: '40 小時',
    targetAudience: ['想轉職的健身愛好者', '運動相關科系學生', '物理治療師/職能治療師'],
    highlights: ['完整系統化課程', '實務操作演練', '結業取得認證'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop&q=80',
    registrationUrl: 'https://www.surveycake.com/s/練健康訓練營',
  },
  {
    id: 'coaching-language',
    level: '實戰',
    levelColor: 'bg-blue-500',
    title: '高效指導語與動作拆解實戰課',
    subtitle: '提升教學溝通技巧，讓學員秒懂動作要領',
    description: '教練最重要的能力之一就是溝通。本課程教你如何用精準的指導語，讓學員快速理解動作要領，提升教學效率。',
    duration: '8 小時',
    targetAudience: ['在職教練', '想提升教學技巧者', '團體課程講師'],
    highlights: ['指導語模板', '動作拆解技巧', '現場實作演練'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop&q=80',
    registrationUrl: 'https://www.surveycake.com/s/指導語課程',
  },
  {
    id: 'senior-training',
    level: '實戰',
    levelColor: 'bg-blue-500',
    title: '中高齡訓練研習',
    subtitle: '醫療與實務結合的四天深度研習',
    description: '結合物理治療與運動訓練的專業課程，學習如何安全有效地為中高齡族群設計訓練計畫。',
    duration: '32 小時（4天）',
    targetAudience: ['物理治療師', '職能治療師', '在職教練'],
    highlights: ['醫療專業背景', '中高齡專項技術', '案例分析討論'],
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=500&fit=crop&q=80',
    registrationUrl: 'https://www.surveycake.com/s/中高齡研習',
  },
  {
    id: 'eagle-eye',
    level: '進階',
    levelColor: 'bg-purple-500',
    title: '鷹眼大師',
    subtitle: '進階動作評估與問題解決能力',
    description: '培養教練的「鷹眼」能力，學習如何快速辨識學員動作問題，並提供精準的矯正策略。',
    duration: '16 小時',
    targetAudience: ['資深教練', '物理治療師', '想提升評估能力者'],
    highlights: ['動作評估系統', '問題解決框架', '進階矯正技巧'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop&q=80',
    registrationUrl: 'https://www.surveycake.com/s/鷹眼大師',
  },
  {
    id: 'biomechanics',
    level: '基礎',
    levelColor: 'bg-orange-500',
    title: '解剖生物力學',
    subtitle: '深化基礎科學知識，打穩專業根基',
    description: '從解剖學與生物力學的角度理解人體動作，為教練生涯打下堅實的科學基礎。',
    duration: '24 小時',
    targetAudience: ['所有教練', '運動愛好者', '想打好基礎者'],
    highlights: ['解剖學基礎', '生物力學原理', '動作分析應用'],
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=500&fit=crop&q=80',
    registrationUrl: 'https://www.surveycake.com/s/解剖生物力學',
  },
];

const stats = [
  { num: '200+', label: '認證教練' },
  { num: '50+', label: '合作機構' },
  { num: '5 年', label: '培訓經驗' },
  { num: '95%', label: '學員滿意度' },
];

const partners = [
  '國家衛生研究院',
  '嘉義慈濟醫院',
  '衛福部草屯療養院',
  '馬來西亞 PhysioGym',
];

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

      <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-white/35 mb-6">
              <Link href="/" className="hover:text-white/70 transition-colors">練健康</Link>
              <span className="text-white/20">›</span>
              <span>練健康學院</span>
            </nav>

            <div className="inline-flex items-center bg-orange/20 border border-orange/40 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-5">
              中高齡與特殊族群訓練專業培訓
            </div>

            <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              練健康<span className="text-orange">學院</span>
            </h1>

            <p className="text-white/60 text-lg font-light leading-relaxed max-w-xl mb-8">
              從物理治療到肌力訓練，系統化培養專業教練。已培育 200+ 認證教練，遍及台灣與海外。
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#courses" className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-orange/35 hover:-translate-y-0.5 transition-transform">
                查看課程 →
              </a>
              <a
                href="https://l-kk.tw/課程報名/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
              >
                前往報名頁
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/[0.07] border border-white/10 rounded-xl p-6 text-center">
                <div className="font-serif text-3xl lg:text-4xl font-bold text-orange">{stat.num}</div>
                <div className="text-white/50 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Learning Path Section
function LearningPathSection() {
  const levels = [
    { name: '入門', color: 'bg-green-500', courses: ['訓練營'] },
    { name: '基礎', color: 'bg-orange-500', courses: ['解剖生物力學'] },
    { name: '實戰', color: 'bg-blue-500', courses: ['高效指導語', '中高齡研習'] },
    { name: '進階', color: 'bg-purple-500', courses: ['鷹眼大師'] },
  ];

  return (
    <section className="py-16 bg-cream-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-3">
            <span className="w-5 h-0.5 bg-orange" />
            學習路徑
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700">
            教練<span className="text-orange">學習地圖</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-navy-700/10" />
            <div className="absolute top-6 left-0 w-3/4 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500" />

            {levels.map((level, idx) => (
              <div key={level.name} className="relative flex flex-col items-center z-10">
                <div className={`w-12 h-12 ${level.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                  {idx + 1}
                </div>
                <div className="mt-3 text-sm font-bold text-navy-700">{level.name}</div>
                <div className="mt-1 text-xs text-ink/50 text-center max-w-[100px]">
                  {level.courses.join('、')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Courses Section
function CoursesSection() {
  return (
    <section id="courses" className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-3">
            <span className="w-5 h-0.5 bg-orange" />
            課程介紹
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-4">
            專業<span className="text-orange">培訓課程</span>
          </h2>
          <p className="text-ink/60 max-w-2xl mx-auto">
            由物理治療師、職能治療師與資深教練組成的講師團隊，提供最專業的訓練課程。
          </p>
        </div>

        <div className="space-y-8">
          {courses.map((course, idx) => (
            <article
              key={course.id}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 lg:gap-8 bg-cream-100 rounded-2xl overflow-hidden border border-navy-700/10`}
            >
              {/* Image */}
              <div className="lg:w-2/5 aspect-video lg:aspect-auto relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-4 left-4 ${course.levelColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {course.level}
                </span>
              </div>

              {/* Content */}
              <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <h3 className="font-serif text-2xl font-bold text-navy-700 mb-2">{course.title}</h3>
                  <p className="text-orange font-medium">{course.subtitle}</p>
                </div>

                <p className="text-ink/60 mb-4 leading-relaxed">{course.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-1.5 text-navy-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </span>
                </div>

                {/* Target Audience */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-ink/50 mb-2">適合對象</p>
                  <div className="flex flex-wrap gap-2">
                    {course.targetAudience.map((audience) => (
                      <span key={audience} className="text-xs bg-navy-700/10 text-navy-700 px-3 py-1 rounded-full">
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.highlights.map((highlight) => (
                    <span key={highlight} className="text-xs bg-orange/10 text-orange px-3 py-1 rounded-full">
                      {highlight}
                    </span>
                  ))}
                </div>

                <a
                  href={course.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-2.5 rounded-full shadow-lg shadow-orange/25 hover:-translate-y-0.5 transition-transform w-fit"
                >
                  立即報名 →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Partners Section
function PartnersSection() {
  return (
    <section className="py-16 bg-cream-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-3">
            <span className="w-5 h-0.5 bg-orange" />
            合作機構
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700">
            深度研究與<span className="text-orange">指標合作</span>單位
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {partners.map((partner) => (
            <div
              key={partner}
              className="bg-white border border-navy-700/10 rounded-lg px-6 py-4 text-navy-700 font-medium shadow-sm"
            >
              {partner}
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
          準備好開始你的教練之路了嗎？
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          加入練健康學院，成為專業的中高齡訓練教練。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://l-kk.tw/課程報名/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-orange font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            前往報名 →
          </a>
          <Link
            href="/cooperation"
            className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white font-bold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
          >
            企業培訓洽詢
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LkkAcademyPage() {
  return (
    <div className="min-h-screen bg-cream-100">
      <HeroSection />
      <LearningPathSection />
      <CoursesSection />
      <PartnersSection />
      <CTASection />
    </div>
  );
}
