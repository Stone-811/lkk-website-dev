'use client';

import { useState } from 'react';

export default function LKK4RecordsPage() {
  const [csvData, setCsvData] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      setMessage({ type: 'success', text: `已載入檔案：${file.name}` });
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
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '匯入失敗',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('確定要刪除所有 LKK4 成績資料嗎？此操作無法復原。')) {
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/lkk4-records/import', {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '刪除失敗');
      }

      setMessage({ type: 'success', text: data.message });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '刪除失敗',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Preview first few rows
  const previewRows = csvData
    ? csvData.split('\n').slice(0, 6)
    : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-sans">LKK4 成績管理</h1>
        <p className="text-gray-500 mt-1">匯入與管理 LKK4 參賽成績資料</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Upload Section */}
      <div className="card border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">匯入 CSV 資料</h2>

        <div className="space-y-4">
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
            <p className="mt-1 text-xs text-gray-500">
              CSV 格式：year, competition_group, team_name, rank, name, gender, body_weight, ...
            </p>
            <p className="mt-1 text-xs text-orange-600 font-medium">
              注意：匯入時會自動覆蓋所有舊資料
            </p>
          </div>

          {/* Preview */}
          {previewRows.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                資料預覽（前 5 筆）
              </label>
              <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {previewRows.join('\n')}
                </pre>
              </div>
            </div>
          )}

          {/* Import Button */}
          <div className="flex gap-3">
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
                  匯入資料
                </>
              )}
            </button>

            <button
              onClick={() => {
                setCsvData('');
                setMessage(null);
              }}
              disabled={!csvData.trim()}
              className="btn btn-secondary disabled:opacity-50"
            >
              清除
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border border-red-200 p-6 bg-red-50/50">
        <h2 className="text-lg font-semibold text-red-700 mb-4">危險區域</h2>
        <p className="text-sm text-red-600 mb-4">
          刪除所有 LKK4 成績資料。此操作無法復原，請謹慎操作。
        </p>
        <button
          onClick={handleDeleteAll}
          disabled={isDeleting}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              刪除中...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              刪除所有資料
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="card border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">使用說明</h2>
        <div className="prose prose-sm text-gray-600">
          <ol className="list-decimal list-inside space-y-2">
            <li>準備 CSV 檔案，格式需包含以下欄位：
              <code className="bg-gray-100 px-1 rounded text-xs ml-1">
                year, competition_group, team_name, rank, name, gender, body_weight, first_attempt, first_attempt_result, second_attempt, second_attempt_result, third_attempt, third_attempt_result, final_score, IPF_GL_point
              </code>
            </li>
            <li>點選「選擇 CSV 檔案」上傳檔案</li>
            <li>確認預覽資料無誤後，點選「匯入資料」</li>
            <li>匯入時會<strong>自動覆蓋</strong>所有舊資料，無需手動刪除</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
