'use client';

import { useState, useEffect } from 'react';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    podcast: string;
    line: string;
    email: string;
  };
  notifications: {
    emailOnNewLead: boolean;
    emailRecipients: string;
  };
}

const defaultSettings: Settings = {
  siteName: '練健康',
  siteDescription: '專業一對一私人教練，科學化訓練，找回你的健康生活。',
  contactEmail: 'lkk@l-kk.tw',
  contactPhone: '02-2712-3456',
  socialLinks: {
    facebook: 'https://www.facebook.com/LKKWellnessCenter/',
    instagram: 'https://www.instagram.com/lkk_wellness/',
    youtube: 'https://www.youtube.com/c/LKKWellness',
    podcast: 'https://podcasts.apple.com/tw/podcast/%E5%88%9D%E4%B8%80%E5%8D%81%E4%BA%94%E7%B7%B4%E5%81%A5%E5%BA%B7/id1779024584',
    line: 'https://line.me/R/ti/p/%40201fzruh',
    email: 'lkk@l-kk.tw',
  },
  notifications: {
    emailOnNewLead: true,
    emailRecipients: '',
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'notifications'>('general');
  const [testingSend, setTestingSend] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings({
            siteName: data.data.siteName || defaultSettings.siteName,
            siteDescription: data.data.siteDescription || defaultSettings.siteDescription,
            contactEmail: data.data.contactEmail || defaultSettings.contactEmail,
            contactPhone: data.data.contactPhone || defaultSettings.contactPhone,
            socialLinks: {
              facebook: data.data.socialLinks?.facebook || defaultSettings.socialLinks.facebook,
              instagram: data.data.socialLinks?.instagram || defaultSettings.socialLinks.instagram,
              youtube: data.data.socialLinks?.youtube || defaultSettings.socialLinks.youtube,
              podcast: data.data.socialLinks?.podcast || defaultSettings.socialLinks.podcast,
              line: data.data.socialLinks?.line || defaultSettings.socialLinks.line,
              email: data.data.socialLinks?.email || defaultSettings.socialLinks.email,
            },
            notifications: data.data.notifications || defaultSettings.notifications,
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save each section
      const sections = [
        {
          section: 'general',
          data: {
            siteName: settings.siteName,
            siteDescription: settings.siteDescription,
            contactEmail: settings.contactEmail,
            contactPhone: settings.contactPhone,
          },
        },
        { section: 'social', data: settings.socialLinks },
        { section: 'notifications', data: settings.notifications },
      ];

      for (const { section, data } of sections) {
        await fetch('/api/admin/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section, data }),
        });
      }
      alert('設定已儲存');
    } catch (error) {
      console.error('Save failed:', error);
      alert('儲存失敗');
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async () => {
    if (!settings.notifications.emailRecipients.trim()) {
      alert('請先填寫通知收件人');
      return;
    }

    setTestingSend(true);
    try {
      const recipients = settings.notifications.emailRecipients
        .split(',')
        .map((e) => e.trim())
        .filter((e) => e);

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-notification', recipients }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('測試通知已發送，請檢查收件匣');
      } else {
        alert(data.error || '發送失敗');
      }
    } catch (error) {
      console.error('Test notification failed:', error);
      alert('發送失敗，請確認 SMTP 設定是否正確');
    } finally {
      setTestingSend(false);
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
      <div>
        <h1 className="text-2xl font-bold font-sans">系統設定</h1>
        <p className="text-gray-500 mt-1">管理網站基本設定</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-navy-700 text-navy-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            基本資訊
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'social'
                ? 'border-navy-700 text-navy-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            社群連結
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-navy-700 text-navy-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            通知設定
          </button>
        </nav>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="card border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">網站名稱</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="input max-w-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">網站描述</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="input max-w-xl"
              rows={2}
            />
            <p className="text-xs text-gray-500 mt-1">用於 SEO meta description</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">聯絡信箱</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">聯絡電話</label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="input"
              />
            </div>
          </div>
        </div>
      )}

      {/* Social Tab */}
      {activeTab === 'social' && (
        <div className="card border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </span>
            </label>
            <input
              type="url"
              value={settings.socialLinks.facebook}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                })
              }
              className="input max-w-xl"
              placeholder="https://www.facebook.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </span>
            </label>
            <input
              type="url"
              value={settings.socialLinks.instagram}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                })
              }
              className="input max-w-xl"
              placeholder="https://www.instagram.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                YouTube
              </span>
            </label>
            <input
              type="url"
              value={settings.socialLinks.youtube}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, youtube: e.target.value },
                })
              }
              className="input max-w-xl"
              placeholder="https://www.youtube.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.6c4.636 0 8.4 3.764 8.4 8.4 0 2.807-1.38 5.29-3.498 6.81-.174-.584-.416-1.162-.732-1.716a6.799 6.799 0 002.63-5.094c0-3.754-3.046-6.8-6.8-6.8S5.2 8.246 5.2 12c0 2.027.892 3.848 2.302 5.094-.316.554-.558 1.132-.732 1.716A8.376 8.376 0 013.6 12c0-4.636 3.764-8.4 8.4-8.4zm0 3.6a4.8 4.8 0 00-4.8 4.8c0 1.564.75 2.952 1.91 3.826.17-.486.39-.956.66-1.396A3.195 3.195 0 018.8 12c0-1.767 1.433-3.2 3.2-3.2s3.2 1.433 3.2 3.2c0 .964-.428 1.828-1.104 2.416.27.44.49.91.66 1.396A4.785 4.785 0 0016.8 12a4.8 4.8 0 00-4.8-4.8zm0 6c-.884 0-1.6.716-1.6 1.6 0 .273.07.53.192.754l-.992 4.77c-.09.434.255.876.7.876h3.4c.445 0 .79-.442.7-.876l-.992-4.77c.122-.224.192-.481.192-.754 0-.884-.716-1.6-1.6-1.6z" />
                </svg>
                Podcast
              </span>
            </label>
            <input
              type="url"
              value={settings.socialLinks.podcast}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, podcast: e.target.value },
                })
              }
              className="input max-w-xl"
              placeholder="https://podcasts.apple.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.193 0-.378-.09-.503-.234l-1.749-2.028v1.635c0 .349-.282.63-.63.63-.345 0-.627-.281-.627-.63V8.108c0-.27.174-.51.432-.596.064-.021.133-.031.199-.031.193 0 .378.09.503.234l1.749 2.028V8.108c0-.349.282-.63.63-.63.345 0 .627.281.627.63v4.771zm-5.741 0c0 .349-.282.63-.631.63-.345 0-.627-.281-.627-.63V8.108c0-.349.282-.63.63-.63.346 0 .628.281.628.63v4.771zm-2.466.63H4.917c-.345 0-.63-.281-.63-.63V8.108c0-.349.285-.63.63-.63.348 0 .63.281.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                LINE
              </span>
            </label>
            <input
              type="url"
              value={settings.socialLinks.line}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, line: e.target.value },
                })
              }
              className="input max-w-xl"
              placeholder="https://line.me/R/ti/p/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </span>
            </label>
            <input
              type="email"
              value={settings.socialLinks.email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, email: e.target.value },
                })
              }
              className="input max-w-xl"
              placeholder="lkk@l-kk.tw"
            />
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="card border border-gray-200 p-6 space-y-6">
          {/* 功能說明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">通知功能說明</h3>
            <p className="text-sm text-blue-700">
              當網站有新的表單提交（預約體驗、加盟洽詢、合作洽詢）時，系統會自動發送郵件通知。
            </p>
            <p className="text-sm text-blue-700 mt-2">
              您可以在下方設定需要收到通知的管理者信箱（如業務、客服等），讓相關同仁即時收到新名單通知。
            </p>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="emailOnNewLead"
              checked={settings.notifications.emailOnNewLead}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, emailOnNewLead: e.target.checked },
                })
              }
              className="w-4 h-4 mt-1 text-navy-700 rounded"
            />
            <div>
              <label htmlFor="emailOnNewLead" className="font-medium">
                啟用新名單 Email 通知
              </label>
              <p className="text-sm text-gray-500">開啟後，新表單提交時會發送通知信</p>
            </div>
          </div>

          {settings.notifications.emailOnNewLead && (
            <div className="ml-7">
              <label className="block text-sm font-medium mb-1">管理者信箱</label>
              <input
                type="text"
                value={settings.notifications.emailRecipients}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailRecipients: e.target.value },
                  })
                }
                className="input max-w-xl"
                placeholder="service@l-kk.tw, manager@l-kk.tw"
              />
              <p className="text-xs text-gray-500 mt-1">多個收件人請用逗號分隔。新表單通知會寄送到這些信箱。</p>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="font-medium mb-3">通知測試</h3>
            <p className="text-sm text-gray-500 mb-3">
              發送測試郵件到上方設定的管理者信箱，確認通知功能正常。請先儲存設定後再測試。
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleTestNotification}
              disabled={testingSend}
            >
              {testingSend ? '發送中...' : '發送測試通知'}
            </button>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
          {saving ? '儲存中...' : '儲存設定'}
        </button>
      </div>
    </div>
  );
}
