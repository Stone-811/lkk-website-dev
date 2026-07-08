'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PersonalRecordPage() {
  const [participantId, setParticipantId] = useState('');
  const [name, setName] = useState('');
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantId.trim() || !name.trim()) return;

    setIsLoading(true);
    // Simulate API call - will be replaced with actual API when data table is ready
    await new Promise(resolve => setTimeout(resolve, 500));
    setSearched(true);
    setIsLoading(false);
  };

  const handleReset = () => {
    setParticipantId('');
    setName('');
    setSearched(false);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero */}
      <section className="relative bg-[#0e2230] py-16 lg:py-24 overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(251,114,10,0.15)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/lkk4"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回 LKK4 賽事頁
          </Link>

          <h1 className="font-serif text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            LKK4 <span className="text-orange">參賽成績查詢</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            輸入您的參賽編號與姓名，即可查詢歷年參賽成績紀錄
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-navy-700/10">
              <div className="space-y-5">
                {/* Participant ID */}
                <div>
                  <label htmlFor="participantId" className="block text-sm font-semibold text-navy-700 mb-2">
                    參賽編號 <span className="text-orange">*</span>
                  </label>
                  <input
                    type="text"
                    id="participantId"
                    value={participantId}
                    onChange={(e) => setParticipantId(e.target.value)}
                    placeholder="例：LKK4-2025-001"
                    className="w-full px-4 py-3 border border-navy-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors"
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-navy-700 mb-2">
                    姓名 <span className="text-orange">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="請輸入報名時填寫的姓名"
                    className="w-full px-4 py-3 border border-navy-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !participantId.trim() || !name.trim()}
                  className="w-full bg-orange text-white font-bold py-3 rounded-lg shadow-lg shadow-orange/25 hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      查詢中...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      查詢成績
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Search Result */}
            {searched && (
              <div className="mt-8 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-navy-700/10 text-center">
                <div className="w-16 h-16 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-navy-700/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-navy-700 mb-2">
                  尚無符合的成績紀錄
                </h3>
                <p className="text-ink/60 text-sm mb-4">
                  查無參賽編號「{participantId}」與姓名「{name}」的成績資料。<br />
                  請確認輸入資訊是否正確，或聯繫主辦單位。
                </p>
                <button
                  onClick={handleReset}
                  className="text-orange font-semibold hover:text-orange-600 transition-colors"
                >
                  重新查詢
                </button>
              </div>
            )}

            {/* Info Note */}
            <div className="mt-6 bg-navy-700/5 rounded-xl p-4 text-sm text-ink/60">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-navy-700/40 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-navy-700 mb-1">查詢說明</p>
                  <ul className="space-y-1">
                    <li>參賽編號可於報名確認信或現場報到時取得</li>
                    <li>姓名請輸入報名時填寫的完整中文姓名</li>
                    <li>成績資料將於賽後 3-5 個工作天內更新</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl lg:text-3xl font-black text-navy-700 mb-4">
            還沒參加過 LKK4？
          </h2>
          <p className="text-ink/60 mb-6 max-w-md mx-auto">
            50 歲以上即可報名參賽，先從免費體驗開始，讓教練評估你的實力！
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/lkk4"
              className="inline-flex items-center gap-2 bg-navy-700 text-white font-bold px-6 py-3 rounded-full hover:bg-navy-600 transition-colors"
            >
              了解 LKK4 賽事
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-orange/25 hover:bg-orange-400 transition-colors"
            >
              預約免費體驗 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
