import Link from 'next/link';

const events = [
  {
    iconType: 'deadlift',
    name: '六角槓硬舉',
    desc: '下肢肌力・爆發力\n招牌項目，傳承自第一屆',
  },
  {
    iconType: 'walking',
    name: '功能性行走',
    desc: '步態穩定・平衡控制\n日常動作的極致挑戰',
  },
  {
    iconType: 'strength',
    name: '上肢推拉力',
    desc: '肩部・核心整合\n全身連動的力量展現',
  },
  {
    iconType: 'cardio',
    name: '心肺耐力',
    desc: '有氧能力・恢復速度\n展現中高齡的活力底蘊',
  },
];

function EventIcon({ type }: { type: string }) {
  const iconClass = "w-6 h-6 text-orange";
  switch (type) {
    case 'deadlift':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h4v12H4zM16 8h4v12h-4zM2 12h20M12 4v4" />
        </svg>
      );
    case 'walking':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h3a2 2 0 012 2v9a2 2 0 01-2 2h-3m-6-4l3 3-3 3M7 15h6" />
        </svg>
      );
    case 'strength':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'cardio':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function LKK4Section() {
  return (
    <section className="relative bg-[#0e2230] py-16 lg:py-24 overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-orange to-transparent" />

      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,114,10,0.08)_0%,transparent_50%),radial-gradient(circle_at_10%_80%,rgba(42,82,105,0.3)_0%,transparent_40%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-center">
          {/* Left content */}
          <div>
            {/* Kicker */}
            <div className="flex items-center gap-2 text-xs font-bold text-orange tracking-widest uppercase mb-4">
              <span className="w-7 h-0.5 bg-orange" />
              練健康年度賽事品牌
            </div>

            {/* Logo */}
            <div className="font-serif text-5xl lg:text-7xl font-black text-white leading-none mb-1 tracking-tight">
              LKK<span className="text-orange">4</span>
            </div>
            <div className="text-lg text-white/55 font-light tracking-wide mb-4">
              中高齡四項體能挑戰賽
            </div>

            {/* Season badge */}
            <div className="inline-flex items-center bg-orange/12 border border-orange/25 rounded-full px-4 py-1.5 text-sm text-orange font-medium mb-5">
              第六屆・2026 年 12 月・籌備中
            </div>

            <p className="text-white/65 leading-relaxed mb-6 max-w-lg">
              由練健康創辦，台灣唯一專為 50 歲以上設計的年度競技賽事。從聖誕老人硬舉大賽出發，進化為涵蓋肌力、爆發力、心肺與靈活度的四項全能挑戰——讓每一位中高齡參賽者，用成績證明年齡不是終點。
            </p>

            {/* Stats */}
            <div className="flex gap-8 flex-wrap mb-6">
              <div>
                <div className="font-serif text-2xl font-black text-orange leading-none">5 屆</div>
                <div className="text-xs text-white/40 mt-0.5">賽事歷史</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-black text-orange leading-none">50+</div>
                <div className="text-xs text-white/40 mt-0.5">歲以上參賽資格</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-black text-orange leading-none">媒體</div>
                <div className="text-xs text-white/40 mt-0.5">大愛・吳淡如・動思學院</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/lkk4"
                className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-orange/35 hover:bg-orange-400 transition-colors"
              >
                往屆精彩回顧 →
              </Link>
              <Link
                href="/cooperation"
                className="inline-flex items-center gap-2 bg-transparent text-orange px-5 py-3 rounded-full border border-orange/50 hover:bg-orange/10 transition-colors"
              >
                贊助・合作洽談
              </Link>
            </div>
          </div>

          {/* Right - Events grid */}
          <div className="grid grid-cols-2 gap-3">
            {events.map((event) => (
              <div
                key={event.name}
                className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 hover:bg-orange/[0.08] hover:border-orange/25 transition-colors"
              >
                <div className="mb-2"><EventIcon type={event.iconType} /></div>
                <div className="font-serif font-bold text-white mb-0.5">{event.name}</div>
                <div className="text-xs text-white/40 leading-relaxed whitespace-pre-line">{event.desc}</div>
              </div>
            ))}
            <p className="col-span-2 text-xs text-white/25 text-center mt-2">
              ＊四項賽制為 2026 年新制，詳細規則賽前公告
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
