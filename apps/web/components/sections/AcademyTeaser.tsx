import Link from 'next/link';

export default function AcademyTeaser() {
  return (
    <section className="bg-navy-700 py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left content */}
          <div>
            <div className="text-xs font-bold text-white/50 tracking-widest uppercase mb-2">
              教練・加盟夥伴
            </div>
            <h2 className="font-serif text-2xl lg:text-3xl font-black text-white mb-2">
              你是教練或投資者？<br />
              <span className="text-orange">這裡有屬於你的入口</span>
            </h2>
            <p className="text-white/60 leading-relaxed max-w-lg">
              練健康學院提供學分制教練認證課程；加盟說明頁面完整呈現市場機會、獲利模型與 LKK4 品牌差異化，讓你在填表前就能充分評估。
            </p>
          </div>

          {/* Right - buttons */}
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link
              href="https://l-kk.tw/academy/"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/18 transition-colors whitespace-nowrap"
            >
              練健康學院 →
            </Link>
            <Link
              href="/franchise"
              className="inline-flex items-center gap-2 bg-orange/15 text-orange px-6 py-3 rounded-full border border-orange/30 hover:bg-orange/25 transition-colors whitespace-nowrap"
            >
              加盟說明 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
