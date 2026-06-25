'use client';

import { useState } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

// 暫用假資料
const initialFaqs: FAQ[] = [
  {
    id: '1',
    question: '預約體驗需要付費嗎？',
    answer: '首次體驗完全免費，包含體適能檢測與教練諮詢。',
    category: '預約相關',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: '2',
    question: '一對一課程如何收費？',
    answer: '我們提供多種課程方案，單堂課程約 $1,500-2,500，購買多堂享有優惠。詳細價格請預約體驗時詢問教練。',
    category: '費用相關',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: '3',
    question: '上課前需要準備什麼？',
    answer: '請穿著舒適的運動服裝與運動鞋，攜帶毛巾和水壺即可。我們提供置物櫃和淋浴設施。',
    category: '上課須知',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: '4',
    question: '可以取消或改期嗎？',
    answer: '課程可於 24 小時前免費取消或改期。24 小時內取消將扣除一堂課程。',
    category: '上課須知',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: '5',
    question: '適合完全沒有運動經驗的人嗎？',
    answer: '非常適合！我們的教練會根據您的程度設計專屬課程，從基礎動作開始教起，循序漸進。',
    category: '預約相關',
    sortOrder: 5,
    isActive: true,
  },
];

const categoryOptions = ['預約相關', '費用相關', '上課須知', '其他'];

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');

  const [formData, setFormData] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    category: '預約相關',
    sortOrder: 0,
    isActive: true,
  });

  const filteredFaqs = faqs.filter((faq) => {
    if (categoryFilter && faq.category !== categoryFilter) return false;
    return true;
  });

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setFormData(faq);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      question: '',
      answer: '',
      category: '預約相關',
      sortOrder: faqs.length + 1,
      isActive: true,
    });
  };

  const handleSave = () => {
    if (isAdding) {
      const newFaq: FAQ = {
        id: Date.now().toString(),
        question: formData.question || '',
        answer: formData.answer || '',
        category: formData.category || '預約相關',
        sortOrder: formData.sortOrder || 0,
        isActive: formData.isActive ?? true,
      };
      setFaqs([...faqs, newFaq]);
    } else if (editingId) {
      setFaqs(
        faqs.map((faq) =>
          faq.id === editingId ? { ...faq, ...formData } : faq
        )
      );
    }
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      question: '',
      answer: '',
      category: '預約相關',
      sortOrder: 0,
      isActive: true,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      question: '',
      answer: '',
      category: '預約相關',
      sortOrder: 0,
      isActive: true,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除此 FAQ 嗎？')) {
      setFaqs(faqs.filter((faq) => faq.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setFaqs(
      faqs.map((faq) =>
        faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sans">常見問題管理</h1>
          <p className="text-gray-500 mt-1">管理網站上的 FAQ 內容</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新增 FAQ
        </button>
      </div>

      {/* Filter */}
      <div className="card border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">分類篩選：</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="">全部分類</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="card border-2 border-navy-700/20 bg-navy-700/5 p-6">
          <h3 className="font-bold font-sans mb-4">{isAdding ? '新增 FAQ' : '編輯 FAQ'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                問題 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.question || ''}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="input bg-white"
                placeholder="輸入常見問題"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                答案 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.answer || ''}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="input bg-white"
                rows={3}
                placeholder="輸入問題解答"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">分類</label>
                <select
                  value={formData.category || '預約相關'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input bg-white"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">排序</label>
                <input
                  type="number"
                  value={formData.sortOrder || 0}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="input bg-white"
                  min="0"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-navy-700 rounded"
                  />
                  <span className="text-sm">顯示於前台</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <button onClick={handleCancel} className="btn btn-ghost">
                取消
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
                disabled={!formData.question || !formData.answer}
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFaqs
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((faq) => (
            <div key={faq.id} className={`card border border-gray-200 p-4 ${!faq.isActive ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {faq.category}
                    </span>
                    {!faq.isActive && (
                      <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded">
                        已隱藏
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-lg font-sans">Q: {faq.question}</h3>
                  <p className="text-gray-600 mt-1">A: {faq.answer}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(faq.id)}
                    className={`text-sm ${faq.isActive ? 'text-orange-500' : 'text-green-500'}`}
                  >
                    {faq.isActive ? '隱藏' : '顯示'}
                  </button>
                  <button
                    onClick={() => handleEdit(faq)}
                    className="text-navy-700 hover:text-navy-800 text-sm"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    刪除
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {filteredFaqs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {categoryFilter ? '此分類沒有 FAQ' : '尚無 FAQ，點擊上方按鈕新增'}
        </div>
      )}
    </div>
  );
}
