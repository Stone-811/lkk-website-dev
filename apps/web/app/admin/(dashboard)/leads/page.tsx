'use client';

import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  store: string;
  storeId: string | null;
  status: string;
  source: string;
  message: string;
  internalNote: string;
  createdAt: string;
}

const typeOptions = [
  { value: '', label: '全部類型' },
  { value: 'booking', label: '預約體驗' },
  { value: 'franchise', label: '加盟洽詢' },
  { value: 'cooperation', label: '合作洽詢' },
];

const statusOptions = [
  { value: '', label: '全部狀態' },
  { value: 'new', label: '新名單' },
  { value: 'contacted', label: '已聯繫' },
  { value: 'scheduled', label: '已預約' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

const statusLabels: Record<string, { label: string; class: string }> = {
  new: { label: '新名單', class: 'badge-info' },
  contacted: { label: '已聯繫', class: 'badge-warning' },
  scheduled: { label: '已預約', class: 'badge-success' },
  completed: { label: '已完成', class: 'badge-gray' },
  cancelled: { label: '已取消', class: 'badge-danger' },
};

const typeLabels: Record<string, string> = {
  booking: '預約體驗',
  franchise: '加盟洽詢',
  cooperation: '合作洽詢',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);

  // 從 API 取得名單資料
  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/admin/leads');
        if (res.ok) {
          const data = await res.json();
          setLeads(
            data.data.map((lead: any) => ({
              id: lead.id,
              name: lead.name,
              phone: lead.phone,
              email: lead.email || '',
              type: lead.type,
              store: lead.store?.name || '-',
              storeId: lead.store?.slug || null,
              status: lead.status,
              source: lead.sourceChannel || lead.sourcePage || '-',
              message: lead.message || '',
              internalNote: lead.internalNote || '',
              createdAt: new Date(lead.createdAt).toLocaleString('zh-TW'),
            }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    if (typeFilter && lead.type !== typeFilter) return false;
    if (statusFilter && lead.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        lead.email.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
      }
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedLead || !noteText.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNote: noteText, addNote: noteText }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLead.id ? { ...l, internalNote: noteText } : l
          )
        );
        setSelectedLead({ ...selectedLead, internalNote: noteText });
        alert('備註已儲存');
      }
    } catch (error) {
      console.error('Save note failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    // 產生 CSV
    const headers = ['姓名', '電話', 'Email', '類型', '門店', '狀態', '來源', '備註', '建立時間'];
    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.phone,
      lead.email,
      typeLabels[lead.type] || lead.type,
      lead.store,
      statusLabels[lead.status]?.label || lead.status,
      lead.source,
      lead.message,
      lead.createdAt,
    ]);

    const csvContent =
      '\uFEFF' + // BOM for UTF-8
      [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
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
          <h1 className="text-2xl font-bold font-sans">表單名單</h1>
          <p className="text-gray-500 mt-1">管理所有預約、加盟、合作洽詢表單</p>
        </div>
        <button onClick={handleExport} className="btn btn-secondary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          匯出 CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="搜尋姓名、電話、Email..."
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
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-auto"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        共 {filteredLeads.length} 筆資料
      </p>

      {/* Table */}
      <div className="card border border-gray-200">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>姓名</th>
                <th>聯絡資訊</th>
                <th>類型</th>
                <th>門店</th>
                <th>狀態</th>
                <th>來源</th>
                <th>建立時間</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    目前沒有名單資料
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="font-medium">{lead.name}</td>
                    <td>
                      <div className="text-sm">
                        <div>{lead.phone}</div>
                        <div className="text-gray-500">{lead.email}</div>
                      </div>
                    </td>
                    <td>{typeLabels[lead.type] || lead.type}</td>
                    <td>{lead.store}</td>
                    <td>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${statusLabels[lead.status]?.class || 'badge-gray'}`}
                      >
                        {statusOptions.slice(1).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-sm text-gray-500">{lead.source}</td>
                    <td className="text-sm text-gray-500">{lead.createdAt}</td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setNoteText(lead.internalNote);
                        }}
                        className="text-navy-700 hover:text-navy-800 text-sm"
                      >
                        詳情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold font-sans">名單詳情</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">姓名</p>
                  <p className="font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">類型</p>
                  <p className="font-medium">{typeLabels[selectedLead.type] || selectedLead.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">電話</p>
                  <p className="font-medium">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedLead.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">門店</p>
                  <p className="font-medium">{selectedLead.store}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">來源</p>
                  <p className="font-medium">{selectedLead.source}</p>
                </div>
              </div>
              {selectedLead.message && (
                <div>
                  <p className="text-sm text-gray-500">客戶備註</p>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedLead.message}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 mb-2">內部備註</p>
                <textarea
                  rows={3}
                  placeholder="新增內部備註..."
                  className="input"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setSelectedLead(null)} className="btn btn-secondary">
                關閉
              </button>
              <button
                onClick={handleSaveNote}
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? '儲存中...' : '儲存備註'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
