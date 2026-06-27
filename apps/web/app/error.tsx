'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-4xl font-black text-navy-700 mb-4">
          發生錯誤
        </h1>
        <p className="text-ink/60 mb-6">
          抱歉，頁面載入時發生問題。請重新嘗試。
        </p>
        <button
          onClick={reset}
          className="bg-orange text-white font-bold px-6 py-3 rounded-full hover:bg-orange/90 transition-colors"
        >
          重新載入
        </button>
      </div>
    </div>
  );
}
