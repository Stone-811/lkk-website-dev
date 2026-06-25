import Link from 'next/link';

export default function HeroSection() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen bg-navy-800 flex flex-col justify-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(251,114,10,0.12)_0%,transparent_55%),radial-gradient(circle_at_10%_80%,rgba(42,82,105,0.6)_0%,transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-12 lg:py-16">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-orange/15 border border-orange/35 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-5 tracking-wide">
                <span className="w-1.5 h-1.5 bg-orange rounded-full" />
                台北・新北 中高齡肌力訓練專家
              </div>

              <h1 className="font-serif text-4xl lg:text-6xl font-black text-white leading-tight mb-5">
                40歲後<br />
                肌肉每年<span className="text-orange">流失1%</span><br />
                我們讓你練回來
              </h1>

              <p className="text-white/65 text-lg font-light leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                由物理治療師、呼吸治療師與專業教練組成，以運動醫學為基礎，為中高齡與特殊族群量身打造安全有效的肌力訓練課程。
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 bg-orange text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-orange/35 hover:bg-orange-400 transition-all hover:-translate-y-0.5"
                >
                  立即預約體驗課 →
                </Link>
                <Link
                  href="https://l-kk.tw/category/%e6%a1%88%e4%be%8b%e5%88%86%e4%ba%ab/"
                  className="inline-flex items-center gap-2 bg-transparent text-white/75 px-6 py-3.5 rounded-full border border-white/20 hover:border-white/50 hover:text-white transition-colors"
                >
                  看學員成果
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 mt-4 text-sm text-white/50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong className="text-orange">50歲以上完全免費</strong>，一般首次體驗僅需 $500</span>
              </div>
            </div>

            {/* Right - Stats Card */}
            <aside className="hidden lg:block bg-white/[0.06] backdrop-blur-md border border-white/12 rounded-3xl p-7">
              <div className="space-y-0">
                <HeroStat
                  icon={<svg className="w-5 h-5 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h4v12H4zM16 8h4v12h-4zM2 12h20M12 4v4" /></svg>}
                  num="1,000+"
                  label="服務學員人次"
                />
                <HeroStat
                  icon={<svg className="w-5 h-5 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                  num="PT 背景"
                  label="物理治療師・呼吸治療師主導"
                />
                <HeroStat
                  icon={<svg className="w-5 h-5 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  num="4 間"
                  label="門店｜台北・新北"
                />
                <HeroStat
                  icon={<svg className="w-5 h-5 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
                  num="6 屆"
                  label="LKK4 中高齡年度競技賽事"
                  isLast
                />
              </div>
            </aside>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="flex flex-col items-center gap-1.5 text-white/30 text-xs animate-bounce">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            往下滑
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Data Strip */}
      <DataStrip />
    </>
  );
}

function HeroStat({ icon, num, label, isLast = false }: { icon: React.ReactNode; num: string; label: string; isLast?: boolean }) {
  return (
    <div className={`flex items-center gap-4 py-4 ${!isLast ? 'border-b border-white/[0.08]' : ''}`}>
      <div className="w-11 h-11 rounded-lg bg-orange/20 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-serif text-xl font-black text-white leading-none">{num}</div>
        <div className="text-xs text-white/50 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function TrustBar() {
  const logos = [
    '大愛新聞',
    '吳淡如人生實用商學院',
    '動思學院 MoveThink',
    '高年級不打烊',
    '強者我朋友',
  ];

  return (
    <div className="bg-white border-b border-navy-700/15 py-4">
      <div className="container mx-auto px-4 flex items-center gap-8 flex-wrap">
        <span className="text-xs font-medium text-ink/40 tracking-widest uppercase whitespace-nowrap">曾受報導</span>
        <div className="flex items-center gap-8 flex-wrap">
          {logos.map((logo) => (
            <span
              key={logo}
              className="font-serif text-sm font-bold text-ink/30 hover:text-ink/60 transition-colors whitespace-nowrap"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataStrip() {
  const stats = [
    { num: '1%', text: ['40歲後每年流失的肌肉量', '不訓練，就是被動老化'] },
    { num: '50+', text: ['歲以上首次體驗完全免費', '零門檻開始第一堂課'] },
    { num: '90歲', text: ['阿嬤也能做硬舉', '年齡不是限制，方法才是'] },
    { num: '醫療', text: ['背景教練團隊', '物理治療師主導，安全不受傷'] },
  ];

  return (
    <section className="bg-navy-800 py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] rounded-2xl overflow-hidden">
          {stats.map((stat) => (
            <div key={stat.num} className="bg-navy-800 p-6 lg:p-8 hover:bg-white/[0.04] transition-colors">
              <div className="font-serif text-3xl lg:text-5xl font-black text-orange leading-none mb-2">
                {stat.num}
              </div>
              <p className="text-white/65 text-sm leading-relaxed">
                <strong className="text-white">{stat.text[0]}</strong>
                <br />
                {stat.text[1]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
