'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalLeadsThisMonth: number;
  pendingLeads: number;
  bookingsThisMonth: number;
  storeCount: number;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  type: string;
  store: { id: string; name: string } | null;
  status: string;
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  booking: '預約體驗',
  franchise: '加盟洽詢',
  cooperation: '合作洽詢',
};

const statusLabels: Record<string, { label: string; class: string }> = {
  new: { label: '新名單', class: 'badge-info' },
  contacted: { label: '已聯繫', class: 'badge-warning' },
  scheduled: { label: '已預約', class: 'badge-success' },
  completed: { label: '已完成', class: 'badge-gray' },
  cancelled: { label: '已取消', class: 'badge-danger' },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeadsThisMonth: 0,
    pendingLeads: 0,
    bookingsThisMonth: 0,
    storeCount: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch leads and stores in parallel
        const [leadsRes, storesRes] = await Promise.all([
          fetch('/api/admin/leads'),
          fetch('/api/public/stores'),
        ]);

        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          const leads = leadsData.data || [];

          // Calculate stats
          const now = new Date();
          const thisMonth = now.getMonth();
          const thisYear = now.getFullYear();

          const leadsThisMonth = leads.filter((lead: any) => {
            const createdAt = new Date(lead.createdAt);
            return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear;
          });

          const pendingLeads = leads.filter((lead: any) => lead.status === 'new');
          const bookingsThisMonth = leadsThisMonth.filter((lead: any) => lead.type === 'booking');

          setStats((prev) => ({
            ...prev,
            totalLeadsThisMonth: leadsThisMonth.length,
            pendingLeads: pendingLeads.length,
            bookingsThisMonth: bookingsThisMonth.length,
          }));

          // Get recent leads (top 5)
          setRecentLeads(
            leads.slice(0, 5).map((lead: any) => ({
              id: lead.id,
              name: lead.name,
              phone: lead.phone ? lead.phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1-XXX-$3') : '',
              type: lead.type,
              store: lead.store,
              status: lead.status,
              createdAt: new Date(lead.createdAt).toLocaleString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }),
            }))
          );
        }

        if (storesRes.ok) {
          const storesData = await storesRes.json();
          setStats((prev) => ({
            ...prev,
            storeCount: storesData.data?.length || 0,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  const statsCards = [
    { name: '本月新名單', value: stats.totalLeadsThisMonth.toString(), href: '/admin/leads' },
    { name: '待處理名單', value: stats.pendingLeads.toString(), href: '/admin/leads?status=new' },
    { name: '本月預約', value: stats.bookingsThisMonth.toString(), href: '/admin/leads?type=booking' },
    { name: '門店數', value: stats.storeCount.toString(), href: '/admin/stores' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-sans">儀表板</h1>
        <p className="text-gray-500 mt-1">歡迎回來，以下是今日摘要</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="card border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500">{stat.name}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="card border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold font-sans">最新名單</h2>
          <Link href="/admin/leads" className="text-sm text-navy-700 hover:text-navy-800">
            查看全部 →
          </Link>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>姓名</th>
                <th>電話</th>
                <th>類型</th>
                <th>門店</th>
                <th>狀態</th>
                <th>建立時間</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    目前沒有名單資料
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="font-medium">{lead.name}</td>
                    <td>{lead.phone}</td>
                    <td>{typeLabels[lead.type] || lead.type}</td>
                    <td>{lead.store?.name || '-'}</td>
                    <td>
                      <span className={`badge ${statusLabels[lead.status]?.class || 'badge-gray'}`}>
                        {statusLabels[lead.status]?.label || lead.status}
                      </span>
                    </td>
                    <td className="text-gray-500 text-sm">{lead.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/stores/new"
          className="card border border-gray-200 p-6 hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-navy-700/10 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-navy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <p className="font-medium">新增門店</p>
            <p className="text-sm text-gray-500">建立新的門店資料</p>
          </div>
        </Link>

        <Link
          href="/admin/coaches/new"
          className="card border border-gray-200 p-6 hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <p className="font-medium">新增教練</p>
            <p className="text-sm text-gray-500">建立新的教練資料</p>
          </div>
        </Link>

        <Link
          href="/admin/leads"
          className="card border border-gray-200 p-6 hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium">匯出名單</p>
            <p className="text-sm text-gray-500">下載 CSV 報表</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
