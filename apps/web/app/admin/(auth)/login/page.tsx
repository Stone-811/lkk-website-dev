'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '登入失敗');
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError('網路錯誤，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy-700">練健康</h1>
          <p className="text-gray-500 mt-1">後台管理系統</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange/50 focus:border-orange outline-none transition-colors"
              placeholder="admin@l-kk.tw"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              密碼
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange/50 focus:border-orange outline-none transition-colors"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange text-white font-bold py-3 rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50"
          >
            {isLoading ? '登入中...' : '登入'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">測試帳號：</p>
          <p className="text-sm text-gray-600">
            Email: <code className="bg-gray-200 px-1 rounded">admin@l-kk.tw</code>
          </p>
          <p className="text-sm text-gray-600">
            密碼: <code className="bg-gray-200 px-1 rounded">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
