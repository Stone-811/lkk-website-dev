'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LKK4Record {
  id: string;
  year: number;
  name: string;
  competitionGroup: string;
  rank: number | null;
  finalScore: number;
  teamName: string | null;
  gender: string;
}

export default function PersonalRecordPage() {
  const [year, setYear] = useState('');
  const [name, setName] = useState('');
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<LKK4Record[]>([]);
  const [error, setError] = useState('');

  // 可選年度（從 CSV 資料來看有 2024 和 2025）
  const availableYears = ['2025', '2024'];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !name.trim()) return;

    setIsLoading(true);
    setError('');
    setRecords([]);

    try {
      const res = await fetch(
        `/api/public/lkk4-records?year=${encodeURIComponent(year)}&name=${encodeURIComponent(name.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '查詢失敗');
      }

      setRecords(data.data || []);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '查詢失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setYear('');
    setName('');
    setSearched(false);
    setRecords([]);
    setError('');
  };

  // 組別名稱對照
  const getGroupDisplayName = (group: string) => {
    const groupMap: Record<string, string> = {
      '長青混合組': '長青混合組',
      '男子第一組': '男子第一組',
      '男子第二組': '男子第二組',
      '男子第三組': '男子第三組',
      '男子第四組': '男子第四組',
      '女子第一組': '女子第一組',
      '女子第二組': '女子第二組',
      '女子第三組': '女子第三組',
      '女子第四組': '女子第四組',
    };
    return groupMap[group] || group;
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
            選擇參賽年度並輸入姓名，即可查詢您的參賽成績紀錄
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-navy-700/10">
              <div className="space-y-5">
                {/* Year */}
                <div>
                  <label htmlFor="year" className="block text-sm font-semibold text-navy-700 mb-2">
                    參賽年度 <span className="text-orange">*</span>
                  </label>
                  <select
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 border border-navy-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors bg-white appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%232A5269%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10"
                    required
                  >
                    <option value="">請選擇年度</option>
                    {availableYears.map((y) => (
                      <option key={y} value={y}>
                        {y} 年
                      </option>
                    ))}
                  </select>
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

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !year || !name.trim()}
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

            {/* Search Result - Has Records */}
            {searched && records.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-navy-700/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-navy-700">
                      查詢成功
                    </h3>
                    <p className="text-ink/60 text-sm">
                      共找到 {records.length} 筆成績紀錄
                    </p>
                  </div>
                </div>

                {/* Records Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-navy-700/10">
                        <th className="text-left py-3 px-2 font-semibold text-navy-700">年度</th>
                        <th className="text-left py-3 px-2 font-semibold text-navy-700">組別</th>
                        <th className="text-left py-3 px-2 font-semibold text-navy-700">隊名</th>
                        <th className="text-center py-3 px-2 font-semibold text-navy-700">名次</th>
                        <th className="text-right py-3 px-2 font-semibold text-navy-700">成績 (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record) => (
                        <tr key={record.id} className="border-b border-navy-700/5 hover:bg-cream-50">
                          <td className="py-3 px-2">
                            <span className="font-medium text-navy-700">{record.year}</span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="text-ink/80">{getGroupDisplayName(record.competitionGroup)}</span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="text-ink/80">{record.teamName || '-'}</span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            {record.rank ? (
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                                record.rank === 1
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : record.rank === 2
                                  ? 'bg-gray-100 text-gray-700'
                                  : record.rank === 3
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-navy-700/5 text-navy-700'
                              }`}>
                                {record.rank}
                              </span>
                            ) : (
                              <span className="text-ink/40">-</span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="font-bold text-orange text-lg">
                              {record.finalScore > 0 ? record.finalScore : '-'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-4 border-t border-navy-700/10 flex justify-center">
                  <button
                    onClick={handleReset}
                    className="text-navy-700 font-semibold hover:text-orange transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    重新查詢
                  </button>
                </div>
              </div>
            )}

            {/* Search Result - No Records */}
            {searched && records.length === 0 && (
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
                  查無 {year} 年姓名「{name}」的成績資料。<br />
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
