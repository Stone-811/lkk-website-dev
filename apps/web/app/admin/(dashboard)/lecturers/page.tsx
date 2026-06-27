'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lecturer {
  id: string;
  name: string;
  title: string;
  type: 'lkk' | 'partner' | 'overseas';
  photo?: string;
  specialties: string[];
  isActive: boolean;
}

const typeLabels: Record<string, string> = {
  lkk: '練健康授權講師',
  partner: '合作講師',
  overseas: '海外授權講師',
};

const typeColors: Record<string, string> = {
  lkk: 'bg-orange-100 text-orange-700',
  partner: 'bg-blue-100 text-blue-700',
  overseas: 'bg-green-100 text-green-700',
};

export default function LecturersPage() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/lecturers');
        if (res.ok) {
          const data = await res.json();
          setLecturers(
            data.data.map((l: any) => ({
              id: l.id,
              name: l.name,
              title: l.title || '',
              type: l.type,
              photo: l.photo,
              specialties: l.specialties || [],
              isActive: l.isActive,
            }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch lecturers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredLecturers = lecturers.filter((lecturer) => {
    if (typeFilter && lecturer.type !== typeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        lecturer.name.toLowerCase().includes(query) ||
        lecturer.title.toLowerCase().includes(query) ||
        lecturer.specialties.some((s) => s.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleToggleActive = async (lecturerId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/lecturers/${lecturerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setLecturers((prev) =>
          prev.map((l) => (l.id === lecturerId ? { ...l, isActive: !currentStatus } : l))
        );
      }
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  const handleDelete = async (lecturerId: string) => {
    if (confirm('確定要刪除此講師嗎？此操作無法復原。')) {
      try {
        const res = await fetch(`/api/admin/lecturers/${lecturerId}`, { method: 'DELETE' });
        if (res.ok) {
          setLecturers((prev) => prev.filter((l) => l.id !== lecturerId));
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
          <h1 className="text-2xl font-bold font-sans">講師管理</h1>
          <p className="text-gray-500 mt-1">管理練健康授權講師、合作講師、海外授權講師</p>
        </div>
        <Link href="/admin/lecturers/new" className="btn btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新增講師
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="">全部類型</option>
            <option value="lkk">練健康授權講師</option>
            <option value="partner">合作講師</option>
            <option value="overseas">海外授權講師</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card border border-gray-200 p-4">
          <div className="text-2xl font-bold text-navy-700">{lecturers.length}</div>
          <div className="text-sm text-gray-500">總講師數</div>
        </div>
        <div className="card border border-gray-200 p-4">
          <div className="text-2xl font-bold text-orange-600">
            {lecturers.filter((l) => l.type === 'lkk').length}
          </div>
          <div className="text-sm text-gray-500">練健康授權</div>
        </div>
        <div className="card border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {lecturers.filter((l) => l.type === 'partner').length}
          </div>
          <div className="text-sm text-gray-500">合作講師</div>
        </div>
        <div className="card border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {lecturers.filter((l) => l.type === 'overseas').length}
          </div>
          <div className="text-sm text-gray-500">海外授權</div>
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500">共 {filteredLecturers.length} 位講師</p>

      {/* Grid */}
      {filteredLecturers.length === 0 ? (
        <div className="card border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-500">尚無講師資料</p>
          <Link href="/admin/lecturers/new" className="btn btn-primary mt-4 inline-flex">
            新增第一位講師
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLecturers.map((lecturer) => (
            <div key={lecturer.id} className="card border border-gray-200 p-4">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                  {lecturer.photo ? (
                    <img src={lecturer.photo} alt={lecturer.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold font-sans">{lecturer.name}</h3>
                      <p className="text-sm text-navy-700">{lecturer.title}</p>
                    </div>
                    <span
                      className={`badge ${lecturer.isActive ? 'badge-success' : 'badge-gray'}`}
                    >
                      {lecturer.isActive ? '上架' : '下架'}
                    </span>
                  </div>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded mt-2 ${typeColors[lecturer.type]}`}>
                    {typeLabels[lecturer.type]}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {lecturer.specialties.slice(0, 3).map((s) => (
                      <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                    {lecturer.specialties.length > 3 && (
                      <span className="text-xs text-gray-400">+{lecturer.specialties.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleToggleActive(lecturer.id, lecturer.isActive)}
                  className="btn btn-ghost text-sm"
                >
                  {lecturer.isActive ? '下架' : '上架'}
                </button>
                <Link href={`/admin/lecturers/${lecturer.id}`} className="btn btn-secondary text-sm">
                  編輯
                </Link>
                <button
                  onClick={() => handleDelete(lecturer.id)}
                  className="btn btn-ghost text-sm text-red-500 hover:bg-red-50"
                >
                  刪除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
