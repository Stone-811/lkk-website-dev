'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Coach {
  id: string;
  name: string;
  title: string;
  store: string;
  storeId: string;
  specialties: string[];
  isActive: boolean;
}

interface Store {
  value: string;
  label: string;
}

export default function CoachesPage() {
  const router = useRouter();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [storeOptions, setStoreOptions] = useState<Store[]>([{ value: '', label: '全部門店' }]);
  const [loading, setLoading] = useState(true);
  const [storeFilter, setStoreFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 從 API 取得教練資料
  useEffect(() => {
    async function fetchData() {
      try {
        const [coachesRes, storesRes] = await Promise.all([
          fetch('/api/admin/coaches'),
          fetch('/api/public/stores'),
        ]);

        if (coachesRes.ok) {
          const coachesData = await coachesRes.json();
          setCoaches(
            coachesData.data.map((c: any) => ({
              id: c.id,
              name: c.name,
              title: c.roleTitle || '',
              store: c.store?.name || '',
              storeId: c.store?.slug || '',
              specialties: c.specialties || [],
              isActive: c.isActive,
            }))
          );
        }

        if (storesRes.ok) {
          const storesData = await storesRes.json();
          setStoreOptions([
            { value: '', label: '全部門店' },
            ...storesData.data.map((s: any) => ({ value: s.slug, label: s.name })),
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCoaches = coaches.filter((coach) => {
    if (storeFilter && coach.storeId !== storeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        coach.name.toLowerCase().includes(query) ||
        coach.title.toLowerCase().includes(query) ||
        coach.specialties.some((s) => s.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleToggleActive = async (coachId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/coaches/${coachId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setCoaches((prev) =>
          prev.map((c) => (c.id === coachId ? { ...c, isActive: !currentStatus } : c))
        );
      }
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  const handleDelete = async (coachId: string) => {
    if (confirm('確定要刪除此教練嗎？此操作無法復原。')) {
      try {
        const res = await fetch(`/api/admin/coaches/${coachId}`, { method: 'DELETE' });
        if (res.ok) {
          setCoaches((prev) => prev.filter((c) => c.id !== coachId));
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sans">教練管理</h1>
          <p className="text-gray-500 mt-1">管理所有教練資訊</p>
        </div>
        <Link href="/admin/coaches/new" className="btn btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新增教練
        </Link>
      </div>

      {/* Filters */}
      <div className="card border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="搜尋姓名、職稱、專長..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="input w-auto"
          >
            {storeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500">共 {filteredCoaches.length} 位教練</p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoaches.map((coach) => (
          <div key={coach.id} className="card border border-gray-200 p-4">
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold font-sans">{coach.name}</h3>
                    <p className="text-sm text-navy-700">{coach.title}</p>
                  </div>
                  <span
                    className={`badge ${coach.isActive ? 'badge-success' : 'badge-gray'}`}
                  >
                    {coach.isActive ? '上架' : '下架'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{coach.store}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {coach.specialties.map((s) => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleToggleActive(coach.id, coach.isActive)}
                className="btn btn-ghost text-sm"
              >
                {coach.isActive ? '下架' : '上架'}
              </button>
              <Link href={`/admin/coaches/${coach.id}`} className="btn btn-secondary text-sm">
                編輯
              </Link>
              <button
                onClick={() => handleDelete(coach.id)}
                className="btn btn-ghost text-sm text-red-500 hover:bg-red-50"
              >
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
