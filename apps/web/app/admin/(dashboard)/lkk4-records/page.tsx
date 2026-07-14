'use client';

import { useState } from 'react';

export default function LKK4RecordsPage() {
  const [csvData, setCsvData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Remove BOM if present
      const cleanText = text.replace(/^\uFEFF/, '');
      setCsvData(cleanText);
      setMessage({ type: 'success', text: `已載入：${file.name}` });
    };
    reader.onerror = () => {
      setMessage({ type: 'error', text: '檔案讀取失敗' });
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleImport = async () => {
    if (!csvData.trim()) {
      setMessage({ type: 'error', text: '請先上傳 CSV 檔案' });
      return;
    }

    setIsImporting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/lkk4-records/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '匯入失敗');
      }

      setMessage({ type: 'success', text: data.message });
      setCsvData('');
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '匯入失敗',
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Preview first few rows
  const previewRows = csvData ? csvData.split('\n').slice(0, 4) : [];

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold font-sans">LKK4 成績管理</h1>
        <p className="text-gray-500 text-sm">上傳 CSV 檔案匯入成績，匯入時會自動覆蓋舊資料</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 card border border-gray-200 p-6 flex flex-col">
        <div className="flex-1 flex flex-col gap-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選擇 CSV 檔案
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-navy-700 file:text-white
                hover:file:bg-navy-600
                file:cursor-pointer"
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Preview */}
          {previewRows.length > 0 && (
            <div className="flex-1 min-h-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                資料預覽
              </label>
              <div className="bg-gray-50 rounded-lg p-3 h-32 overflow-auto">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {previewRows.join('\n')}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Import Button */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleImport}
            disabled={isImporting || !csvData.trim()}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isImporting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                匯入中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                匯入並覆蓋
              </>
            )}
          </button>

          {csvData.trim() && (
            <button
              onClick={() => {
                setCsvData('');
                setMessage(null);
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
              }}
              className="btn btn-secondary"
            >
              清除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
