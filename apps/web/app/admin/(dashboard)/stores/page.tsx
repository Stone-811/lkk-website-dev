'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Store {
  id: string;
  slug: string;
  name: string;
  city: string;
  district: string;
  phone: string;
  coachCount: number;
  isActive: boolean;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  // 從 API 取得門店資料
  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch('/api/admin/stores');
        if (res.ok) {
          const data = await res.json();
          setStores(
            data.data.map((store: any) => ({
              id: store.id,
              slug: store.slug,
              name: store.name,
              city: store.city,
              district: store.district,
              phone: store.phone || '-',
              coachCount: store._count?.coaches || 0,
              isActive: store.isActive,
            }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, []);

  const handleToggleActive = async (storeId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/stores/${storeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setStores((prev) =>
          prev.map((s) => (s.id === storeId ? { ...s, isActive: !currentStatus } : s))
        );
      }
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  const handleDelete = async (storeId: string) => {
    if (confirm('確定要刪除此門店嗎？此操作無法復原。')) {
      try {
        const res = await fetch(`/api/admin/stores/${storeId}`, { method: 'DELETE' });
        if (res.ok) {
          setStores((prev) => prev.filter((s) => s.id !== storeId));
        } else {
          const data = await res.json();
          alert(data.error || '刪除失敗');
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
          <h1 className="text-2xl font-bold font-sans">門店管理</h1>
          <p className="text-gray-500 mt-1">管理所有門店資訊</p>
        </div>
        <Link href="/admin/stores/new" className="btn btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新增門店
        </Link>
      </div>

      {/* Table */}
      <div className="card border border-gray-200">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>門店名稱</th>
                <th>地區</th>
                <th>電話</th>
                <th>教練數</th>
                <th>狀態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    目前沒有門店資料
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id}>
                    <td className="font-medium">{store.name}</td>
                    <td>
                      {store.city} {store.district}
                    </td>
                    <td>{store.phone}</td>
                    <td>{store.coachCount} 位</td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(store.id, store.isActive)}
                        className={`badge cursor-pointer ${store.isActive ? 'badge-success' : 'badge-gray'}`}
                      >
                        {store.isActive ? '上架中' : '已下架'}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/stores/${store.id}`}
                          className="text-navy-700 hover:text-navy-800 text-sm"
                        >
                          編輯
                        </Link>
                        <button
                          onClick={() => handleDelete(store.id)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
