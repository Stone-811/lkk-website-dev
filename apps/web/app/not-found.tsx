import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-serif text-8xl font-black text-orange mb-4">404</div>
        <h1 className="font-serif text-2xl font-bold text-navy-700 mb-4">
          頁面不存在
        </h1>
        <p className="text-ink/60 mb-6">
          抱歉，找不到您要的頁面。可能已被移除或網址輸入錯誤。
        </p>
        <Link
          href="/"
          className="inline-block bg-orange text-white font-bold px-6 py-3 rounded-full hover:bg-orange/90 transition-colors"
        >
          回到首頁
        </Link>
      </div>
    </div>
  );
}
