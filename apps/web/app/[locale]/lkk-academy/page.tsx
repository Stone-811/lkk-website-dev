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
    level: 'Lv1 初階',
    levelColor: 'bg-green-600',
    category: '學術',
    categoryColor: 'bg-navy-700',
    title: '練健康訓練營',
    subtitle: '熟練六大基礎動作，安全有效地帶領教學',
    description: '熟練六大基礎動作，並能以安全、有效、邏輯清楚的方式教學。培養立即上線授課能力，並與客戶應對的軟實力。',
    duration: '40 小時',
    targetAudience: ['想成為全方位教練者', '跨領域轉職教練者', '健身愛好者'],
    highlights: ['六大基礎動作', '系統化教學', '軟實力培養'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop&q=80',
    registrationUrl: 'https://www.surveycake.com/s/W2y4Z',
  },
  {
    id: 'coaching-language',
    level: 'Lv1 初階',
    levelColor: 'bg-green-600',
    category: '學術',
    categoryColor: 'bg-navy-700',
    title: '高效指導語與動作拆解實戰課',
    subtitle: '讓任何人快速學會動作教學，與教會親朋好友',
    description: '讓任何人快速學會動作教學，有能力帶領團體課程與教會親朋好友。掌握六大基礎動作的自由重量操作、原理、變化式。',
    duration: '8 小時',
    targetAudience: ['新手教練', '想提升教學指導語者'],
    highlights: ['指導語技巧', '動作拆解', '團體課程帶領'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop&q=80',
    registrationUrl: 'https://www.surveycake.com/s/W2y4Z',
  },
  {
    id: 'biomechanics',
    level: 'Lv2 中階',
    levelColor: 'bg-blue-500',
    category: '學術',
    categoryColor: 'bg-navy-700',
    title: '解剖生物力學',
    subtitle: '建立人體運作原理的底層知識',
    description: '建立人體運作原理的底層知識，透過理解槓桿如何發揮功能，可獨立推演肌肉與骨骼發力的路徑。',
    duration: '24 小時',
    targetAudience: ['想全面了解肌動學及解剖學的教練', '人體工作者', '肌動、解剖、運動科學愛好者'],
    highlights: ['解剖學基礎', '生物力學原理', '動作分析應用'],
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=500&fit=crop&q=80',
    registrationUrl: 'https://www.surveycake.com/s/W2y4Z',
  },
  {
    id: 'senior-training',
    level: 'Lv3 高階',
    levelColor: 'bg-purple-500',
    category: '學術',
    categoryColor: 'bg-navy-700',
    title: '中高齡訓練研習營',
    subtitle: '學會身體能力評估與解法，安全有效帶領特殊病友',
    description: '學會身體能力評估與解法，解決基本活動度問題。學會安全考量與生理限制下的訓練進退階邏輯。了解常見疾病病理，建立醫療轉介共通語言。能夠安全有效帶領特殊病友進步。',
    duration: '32 小時（4天）',
    targetAudience: ['教練、醫療人員、照護員', '需要面對中高齡、特殊族群者'],
    highlights: ['身體能力評估', '疾病病理了解', '醫療轉介溝通'],
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=500&fit=crop&q=80',
    registrationUrl: 'https://www.surveycake.com/s/DraAb',
  },
  {
    id: 'eagle-eye',
    level: 'Lv3 高階',
    levelColor: 'bg-purple-500',
    category: '學術',
    categoryColor: 'bg-navy-700',
    title: '鷹眼大師',
    subtitle: '常見功能障礙與對策、精準動作解析與判斷點',
    description: '系統性排除肩頸、脊椎（含胸椎、腰椎）、髖部和膝蓋等部位的常見動作障礙與功能受限。理解並應用不同平面動作組合，學習多面向的動作篩檢與分析，建立快速的判斷點。掌握身體運作的核心運動原則，設計相對應解決方法以優化動作。',
    duration: '16 小時',
    targetAudience: ['擁有一定教學經驗之教練', '健康促進人士', '醫療人員'],
    highlights: ['功能障礙對策', '動作篩檢分析', '訓練課表設計'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop&q=80',
    registrationUrl: 'https://www.surveycake.com/s/W2y4Z',
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

// Course Overview Section - Why we created the academy
function WhyAcademySection() {
  return (
    <section className="py-16 bg-cream-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-3">
              <span className="w-5 h-0.5 bg-orange" />
              學院理念
            </div>
            <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-6">
              為什麼我們想成立<span className="text-orange">練健康學院</span>？
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-navy-700/10 shadow-sm">
            <p className="text-ink/80 leading-relaxed mb-6">
              練健康自成立以來，累積服務超過 <strong className="text-navy-700">6,000 位學員</strong>，其中近 50% 為中高齡及特殊族群個案。在實務現場，我們看見了許多教練（與想成為教練的人）面臨的共同困境：
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-cream-100 rounded-xl p-5 border-l-4 border-orange">
                <h3 className="font-bold text-navy-700 mb-2">學用落差</h3>
                <p className="text-sm text-ink/70">缺乏系統化管道，難以將書本上的「基礎理論」轉化為現場的「有效教學」。</p>
              </div>
              <div className="bg-cream-100 rounded-xl p-5 border-l-4 border-orange">
                <h3 className="font-bold text-navy-700 mb-2">特殊族群缺口</h3>
                <p className="text-sm text-ink/70">傳統肌力訓練教學多針對年輕族群，面對身體有較多限制的長輩，缺乏相對應的訓練知識及合適的指導技巧。</p>
              </div>
            </div>

            <p className="text-ink/80 leading-relaxed mb-4">
              為了回應這些需求，我們設立了<strong className="text-orange">練健康學院</strong>，整合學科與術科的專業，設計出循序漸進的研習課程。不論你是剛入門、想補強基礎的教練，還是希望在職涯中持續精進、拓展專業的人，都能在練健康學院所開的課表中，找到實用且符合現場需求的學習資源。
            </p>

            <p className="text-navy-700 font-medium leading-relaxed">
              我們相信，專業教練的養成不只需要知識，更需要能落地的解法。練健康學院整合學科與術科，為你搭建一座從「正確練」到「好會教」的橋樑。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Course Overview Section
function CourseOverviewSection() {
  const coursesByLevel = [
    {
      level: 'Lv 1. 初階',
      levelColor: 'bg-green-600',
      description: '教學經驗及現場掌控',
      courses: [
        {
          title: '高效指導語與動作拆解實戰課',
          category: '學術',
          objectives: ['讓任何人快速學會動作教學，有能力帶領團體課程與教會親朋好友。', '掌握六大基礎動作的自由重量操作、原理、變化式。'],
          target: '新手教練：想瞭解更多有效動作教學指導語以提升教學能力。',
        },
        {
          title: '練健康訓練營',
          category: '學術',
          objectives: ['熟練六大基礎動作，並能以安全、有效、邏輯清楚的方式教學。', '培養立即上線授課能力，並與客戶應對的軟實力。'],
          target: '教練：想成為全方位教練。跨領域轉職教練者：有訓練經驗，想培養教學能力。健身愛好者：有訓練經驗，對訓練知識感興趣。',
        },
      ],
    },
    {
      level: 'Lv 2. 中階',
      levelColor: 'bg-blue-500',
      description: '身體理解及應用層面',
      courses: [
        {
          title: '解剖生物力學',
          category: '學術',
          objectives: ['建立人體運作原理的底層知識，透過理解槓桿如何發揮功能，可獨立推演肌肉與骨骼發力的路徑。'],
          target: '教練：想全面了解並應用肌動學及解剖學。人體工作者。肌動、人體解剖、運動科學愛好者。',
        },
      ],
    },
    {
      level: 'Lv 3. 高階',
      levelColor: 'bg-purple-500',
      description: '中高齡與特殊族群',
      courses: [
        {
          title: '中高齡訓練研習營',
          category: '學術',
          objectives: ['學會身體能力評估與解法，解決基本活動度問題。', '學會安全考量與生理限制下的訓練進退階邏輯。', '了解常見疾病病理，建立醫療轉介共通語言。', '能夠安全有效帶領特殊病友進步。'],
          target: '教練、醫療人員、照護員：需要面對中高齡、特殊族群者。',
        },
        {
          title: '鷹眼大師',
          category: '學術',
          objectives: ['常見功能障礙與對策：系統性排除肩頸、脊椎、髖部和膝蓋等部位的常見動作障礙與功能受限。', '精準動作解析與判斷點：理解並應用不同平面動作組合，學習多面向的動作篩檢與分析。', '上／下肢運動解法：掌握身體運作的核心運動原則，設計相對應解決方法以優化動作。', '建立訓練課表：根據動作分析結果，設計針對功能障礙的訓練路徑，有效解決訓練中出現的動作問題。'],
          target: '擁有一定教學經驗之教練：想增進評估能力、解決訓練問題。健康促進人士：想透過運動固化按摩放鬆的效果。醫療人員：針對服務個案的需求，提升解決問題的能力。',
        },
      ],
    },
  ];

  return (
    <section className="py-16 bg-navy-700">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-3">
            <span className="w-5 h-0.5 bg-orange" />
            課程總覽
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-white mb-4">
            練健康<span className="text-orange">課程總覽</span>
          </h2>
          <div className="flex items-center justify-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-navy-600 border border-white/30"></span>
              學術課程
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          {coursesByLevel.map((levelData) => (
            <div key={levelData.level} className="space-y-4">
              {/* Level Header */}
              <div className={`${levelData.levelColor} rounded-xl p-4 text-center`}>
                <div className="text-white font-bold text-lg">{levelData.level}</div>
                <div className="text-white/80 text-sm">{levelData.description}</div>
              </div>

              {/* Courses */}
              {levelData.courses.map((course) => (
                <div key={course.title} className="bg-cream-100 rounded-xl p-5 border-2 border-cream-200">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-bold text-navy-700 text-sm leading-tight">{course.title}</h3>
                    <span className="text-[10px] bg-navy-700 text-white px-2 py-0.5 rounded">{course.category}</span>
                  </div>

                  <div className="mb-3">
                    <p className="text-[10px] font-bold text-orange mb-1">課程目標</p>
                    <ul className="text-xs text-ink/70 space-y-1">
                      {course.objectives.map((obj, idx) => (
                        <li key={idx} className="flex gap-1.5">
                          <span className="text-orange">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-cream-200">
                    <p className="text-[10px] font-bold text-orange mb-1">對象</p>
                    <p className="text-xs text-ink/70">{course.target}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
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
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`${course.levelColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {course.level}
                  </span>
                  <span className="bg-navy-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>
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
      <WhyAcademySection />
      <CourseOverviewSection />
      <CoursesSection />
      <PartnersSection />
      <CTASection />
    </div>
  );
}
