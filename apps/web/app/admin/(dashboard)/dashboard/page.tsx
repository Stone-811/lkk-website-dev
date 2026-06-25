import Link from 'next/link';

// 暫用假資料
const stats = [
  { name: '本月新名單', value: '47', change: '+12%', href: '/admin/leads' },
  { name: '待處理名單', value: '8', change: '-3', href: '/admin/leads?status=new' },
  { name: '本月預約', value: '32', change: '+8%', href: '/admin/leads?type=booking' },
  { name: '門店數', value: '5', change: '0', href: '/admin/stores' },
];

const recentLeads = [
  { id: '1', name: '王小明', phone: '0912-XXX-XXX', type: 'booking', store: '台北南京店', status: 'new', createdAt: '2024-01-15 14:30' },
  { id: '2', name: '李小華', phone: '0923-XXX-XXX', type: 'booking', store: '台北民生店', status: 'contacted', createdAt: '2024-01-15 11:20' },
  { id: '3', name: '張大偉', phone: '0934-XXX-XXX', type: 'franchise', store: '-', status: 'new', createdAt: '2024-01-14 16:45' },
  { id: '4', name: '陳美玲', phone: '0945-XXX-XXX', type: 'booking', store: '新竹店', status: 'scheduled', createdAt: '2024-01-14 10:15' },
];

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
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-sans">儀表板</h1>
        <p className="text-gray-500 mt-1">歡迎回來，以下是今日摘要</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="card border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500">{stat.name}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-bold">{stat.value}</p>
              <span
                className={`text-sm ${
                  stat.change.startsWith('+')
                    ? 'text-green-600'
                    : stat.change.startsWith('-')
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {stat.change}
              </span>
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
              {recentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="font-medium">{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{typeLabels[lead.type]}</td>
                  <td>{lead.store}</td>
                  <td>
                    <span className={`badge ${statusLabels[lead.status].class}`}>
                      {statusLabels[lead.status].label}
                    </span>
                  </td>
                  <td className="text-gray-500 text-sm">{lead.createdAt}</td>
                </tr>
              ))}
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
          href="/admin/leads/export"
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
