import Link from 'next/link';

export default function CTABanner() {
  return (
    <section className="bg-orange py-16 lg:py-20 text-center">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl lg:text-4xl font-black text-white mb-3">
          開始你的第一步
        </h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          不管幾歲，現在都不晚。先來一堂體驗課，讓我們了解你的狀況。
        </p>
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 bg-white text-orange font-bold px-10 py-4 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          立即預約免費體驗 →
        </Link>
        <p className="text-white/65 text-sm mt-4">
          50歲以上完全免費・一般首次體驗 $500・無隱藏費用
        </p>
      </div>
    </section>
  );
}
