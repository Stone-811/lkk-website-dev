import Link from 'next/link';

export const metadata = {
  title: '經營團隊｜練健康 LKK Wellness',
  description: '認識練健康的經營團隊，由物理治療師與運動科學專家組成，致力於中高齡健康訓練。',
};

// 經營團隊資料
const managementTeam = [
  {
    id: '1',
    name: '黃元杰',
    nickname: '肥老闆',
    title: '創辦人暨執行長',
    photo: '/images/team/huang-yuanjie.png',
    description: '練健康創辦人，擁有經濟學碩士背景，曾任職於健身產業行銷與國際產品管理。深知台灣中高齡族群的運動需求，創立練健康，致力打造最專業的中高齡健身品牌。',
    credentials: ['IHFI 台灣 CPT 國際健康體適能專業人員', 'CPR + AED 認證', '台大農經所碩士'],
  },
  {
    id: '2',
    name: '曾子桓',
    nickname: 'Giwane',
    title: '訓練部區域經理・肌力與體能教練',
    photo: '/images/team/tseng-tzuhuan.png',
    description: '專精於肌力與體能訓練、運動表現提升及中高齡族群訓練。具備豐富的運動員培訓經驗，負責練健康教練團隊的訓練品質把關。',
    credentials: ['NSCA-CSCS', 'TSCA-SCC', 'SMA 運動總監認證', 'ASCA-VBT', 'AFAA-WT'],
  },
  {
    id: '3',
    name: '鄭宇劭',
    nickname: 'Bob',
    title: '總教練',
    photo: '/images/team/cheng-yushao.png',
    description: '物理治療師背景，專精於運動傷害防護與中高齡肌力訓練。曾擔任競速滑冰世界盃隨隊體能訓練師，將專業運動員的訓練方法融入中高齡健身課程。',
    credentials: ['物理治療師證照', 'NSCA-CSCS', 'NASM-CES', 'C 級肌力與體能教練'],
  },
];

// Hero Section
function HeroSection() {
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
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-1.5 text-xs text-white/35 mb-6">
          <Link href="/" className="hover:text-white/70 transition-colors">練健康</Link>
          <span className="text-white/20">›</span>
          <Link href="/team-intro" className="hover:text-white/70 transition-colors">團隊介紹</Link>
          <span className="text-white/20">›</span>
          <span>經營團隊</span>
        </nav>

        <div className="inline-flex items-center gap-2 bg-orange/20 border border-orange/40 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-5">
          <span className="w-2 h-2 bg-orange rounded-full" />
          專業醫療背景
        </div>

        <h1 className="font-serif text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
          經營<span className="text-orange">團隊</span>
        </h1>

        <p className="text-white/60 text-lg font-light leading-relaxed max-w-2xl mx-auto">
          由物理治療師與醫療專業人員創立，我們深知中高齡族群的身體需求，致力於打造最安全、最有效的訓練環境。
        </p>
      </div>
    </section>
  );
}

// Team Grid
function TeamGrid() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {managementTeam.map((member) => (
            <article
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-navy-700/10 hover:-translate-y-1 transition-transform"
            >
              {/* Photo */}
              <div className="aspect-[3/4] bg-gradient-to-br from-navy-700 to-navy-700/80 relative">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-7xl font-black text-white/20">{member.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="font-serif text-xl font-bold text-navy-700">
                    {member.name}
                    {member.nickname && <span className="text-navy-700/50 font-normal ml-2">{member.nickname}</span>}
                  </h2>
                  <p className="text-orange font-semibold text-sm">{member.title}</p>
                </div>

                <p className="text-ink/60 leading-relaxed mb-4 text-sm">{member.description}</p>

                {/* Credentials */}
                <div className="flex flex-wrap gap-2">
                  {member.credentials.map((cred) => (
                    <span
                      key={cred}
                      className="text-xs font-medium text-navy-700 bg-navy-700/[0.08] px-3 py-1 rounded-full"
                    >
                      {cred}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Vision Section
function VisionSection() {
  return (
    <section className="bg-cream-100 py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-orange tracking-widest uppercase mb-3">
            <span className="w-5 h-0.5 bg-orange" />
            我們的理念
            <span className="w-5 h-0.5 bg-orange" />
          </div>
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-6">
            讓每位長輩都能<span className="text-orange">安全有效</span>地運動
          </h2>
          <p className="text-ink/60 leading-relaxed text-lg">
            我們相信，年齡不是限制，而是開始。透過專業的評估與個人化的訓練計畫，
            幫助每一位學員找回身體的自主權，享受更有品質的生活。
          </p>
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
          想認識更多團隊成員？
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          我們的教練團隊都有專業醫療或運動科學背景，歡迎了解更多。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/team-intro/coaches"
            className="inline-flex items-center gap-2 bg-white text-orange font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            查看教練團隊 →
          </Link>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-white/20 text-white font-bold px-8 py-3.5 rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          >
            預約體驗
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function TeamIntroPage() {
  return (
    <div className="min-h-screen bg-cream-100">
      <HeroSection />
      <TeamGrid />
      <VisionSection />
      <CTASection />
    </div>
  );
}
