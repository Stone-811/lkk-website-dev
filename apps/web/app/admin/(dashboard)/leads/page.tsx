'use client';

import { useState, useEffect } from 'react';

interface LeadPayload {
  gender?: string;
  birthDate?: string;
  line?: string;
  filledBySelf?: boolean;
  relationship?: string;
  bookerName?: string;
  contactPhone?: string;
  hasMedicalCondition?: boolean;
  medicalConditionNote?: string;
  preferredTime?: string | string[];
  paymentMethod?: string;
  sources?: string[];
  goal?: string;
  age?: string;
}

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
  payload?: LeadPayload;
}

// 此頁面只顯示預約體驗 (booking) 類型的名單

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


export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);

  // 從 API 取得名單資料（只取 booking 類型）
  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/admin/leads?type=booking');
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
              payload: lead.payload || {},
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
    const headers = ['姓名', '電話', 'Email', '門店', '狀態', '來源', '備註', '建立時間'];
    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.phone,
      lead.email,
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

  // 格式化 preferredTime 顯示
  const formatPreferredTime = (preferredTime: string | string[] | undefined) => {
    if (!preferredTime) return '-';
    if (Array.isArray(preferredTime)) {
      return preferredTime.join('、');
    }
    return preferredTime;
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
          <h1 className="text-2xl font-bold font-sans">客戶預約</h1>
          <p className="text-gray-500 mt-1">管理預約體驗表單</p>
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
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    目前沒有預約資料
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
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
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
            <div className="p-6 space-y-6">
              {/* 學員基本資料 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">學員基本資料</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">姓名</p>
                    <p className="font-medium">{selectedLead.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">電話</p>
                    <p className="font-medium">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{selectedLead.email || '-'}</p>
                  </div>
                  {selectedLead.payload?.line && (
                    <div>
                      <p className="text-xs text-gray-500">Line ID</p>
                      <p className="font-medium">{selectedLead.payload.line}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">性別</p>
                    <p className="font-medium">{selectedLead.payload?.gender || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">出生日期</p>
                    <p className="font-medium">{selectedLead.payload?.birthDate || '-'}</p>
                  </div>
                </div>
              </div>

              {/* 填寫者資料（如果是親友代填） */}
              {selectedLead.payload?.filledBySelf === false && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">預約者資料（親友代填）</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">預約者姓名</p>
                      <p className="font-medium">{selectedLead.payload?.bookerName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">與學員關係</p>
                      <p className="font-medium">{selectedLead.payload?.relationship || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">聯繫電話</p>
                      <p className="font-medium">{selectedLead.payload?.contactPhone || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 健康狀況 */}
              {selectedLead.payload?.hasMedicalCondition !== undefined && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">健康狀況</h3>
                  <div>
                    <p className="text-xs text-gray-500">是否有疾病或近期手術/住院</p>
                    <p className={`font-medium ${selectedLead.payload.hasMedicalCondition ? 'text-orange-600' : ''}`}>
                      {selectedLead.payload.hasMedicalCondition ? '是' : '否'}
                    </p>
                    {selectedLead.payload.hasMedicalCondition && selectedLead.payload.medicalConditionNote && (
                      <p className="mt-1 text-sm text-gray-600 bg-orange-50 p-2 rounded">
                        {selectedLead.payload.medicalConditionNote}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 預約資訊 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">預約資訊</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">門店</p>
                    <p className="font-medium">{selectedLead.store}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">方便聯繫時段</p>
                    <p className="font-medium">{formatPreferredTime(selectedLead.payload?.preferredTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">付款方式</p>
                    <p className={`font-medium ${selectedLead.payload?.paymentMethod === '50歲以上免費' ? 'text-green-600' : ''}`}>
                      {selectedLead.payload?.paymentMethod || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">建立時間</p>
                    <p className="font-medium">{selectedLead.createdAt}</p>
                  </div>
                </div>
              </div>

              {/* 來源 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">來源資訊</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">從哪裡得知</p>
                    <p className="font-medium">
                      {selectedLead.payload?.sources?.length
                        ? selectedLead.payload.sources.join('、')
                        : selectedLead.source || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 客戶留言 */}
              {selectedLead.message && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">客戶留言</h3>
                  <p className="p-3 bg-gray-50 rounded-lg text-sm">{selectedLead.message}</p>
                </div>
              )}

              {/* 內部備註 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">內部備註</h3>
                <textarea
                  rows={3}
                  placeholder="新增內部備註..."
                  className="input"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
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
