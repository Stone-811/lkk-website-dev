'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface LecturerForm {
  name: string;
  slug: string;
  photo: string;
  title: string;
  organization: string;
  region: string;
  countries: string[];
  type: 'lkk' | 'partner' | 'overseas';
  description: string;
  specialties: string[];
  courses: string[];
  certifications: string[];
  sortOrder: number;
  isActive: boolean;
}

const initialForm: LecturerForm = {
  name: '',
  slug: '',
  photo: '',
  title: '',
  organization: '',
  region: '',
  countries: [],
  type: 'lkk',
  description: '',
  specialties: [],
  courses: [],
  certifications: [],
  sortOrder: 0,
  isActive: true,
};

export default function LecturerEditPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';

  const [form, setForm] = useState<LecturerForm>(initialForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Temp inputs for array fields
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [courseInput, setCourseInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [countryInput, setCountryInput] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchLecturer();
    }
  }, [isNew, params.id]);

  async function fetchLecturer() {
    try {
      const res = await fetch(`/api/admin/lecturers/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.data.name || '',
          slug: data.data.slug || '',
          photo: data.data.photo || '',
          title: data.data.title || '',
          organization: data.data.organization || '',
          region: data.data.region || '',
          countries: data.data.countries || [],
          type: data.data.type || 'lkk',
          description: data.data.description || '',
          specialties: data.data.specialties || [],
          courses: data.data.courses || [],
          certifications: data.data.certifications || [],
          sortOrder: data.data.sortOrder || 0,
          isActive: data.data.isActive ?? true,
        });
      } else {
        setError('找不到此講師');
      }
    } catch (err) {
      setError('載入失敗');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isNew ? '/api/admin/lecturers' : `/api/admin/lecturers/${params.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/lecturers');
      } else {
        setError(data.error || '儲存失敗');
      }
    } catch (err) {
      setError('儲存失敗');
    } finally {
      setSaving(false);
    }
  }

  const addToArray = (field: keyof LecturerForm, value: string, setValue: (v: string) => void) => {
    if (value.trim()) {
      setForm((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }));
      setValue('');
    }
  };

  const removeFromArray = (field: keyof LecturerForm, index: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/lecturers" className="btn btn-ghost">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-sans">
            {isNew ? '新增講師' : '編輯講師'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isNew ? '建立新的講師資料' : `編輯「${form.name}」的資料`}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">基本資料</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                網址代稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                className="input"
                placeholder="例如: wang-xiaoming"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                講師類型 <span className="text-red-500">*</span>
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as any }))}
                className="input"
              >
                <option value="lkk">練健康授權講師</option>
                <option value="partner">合作講師</option>
                <option value="overseas">海外授權講師</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">職稱</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="input"
                placeholder="例如: 首席講師"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所屬機構</label>
              <input
                type="text"
                value={form.organization}
                onChange={(e) => setForm((prev) => ({ ...prev, organization: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">照片網址</label>
              <input
                type="text"
                value={form.photo}
                onChange={(e) => setForm((prev) => ({ ...prev, photo: e.target.value }))}
                className="input"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Photo Preview */}
          {form.photo && (
            <div className="mt-4">
              <img src={form.photo} alt="預覽" className="w-24 h-24 object-cover rounded-full border" />
            </div>
          )}

          {/* Overseas specific fields */}
          {form.type === 'overseas' && (
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地區</label>
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value }))}
                  className="input"
                  placeholder="例如: 東南亞"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">授權國家</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={countryInput}
                    onChange={(e) => setCountryInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('countries', countryInput, setCountryInput))}
                    className="input flex-1"
                    placeholder="輸入後按 Enter"
                  />
                  <button type="button" onClick={() => addToArray('countries', countryInput, setCountryInput)} className="btn btn-secondary">
                    新增
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.countries.map((c, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                      {c}
                      <button type="button" onClick={() => removeFromArray('countries', i)} className="hover:text-green-900">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="card border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">簡介</h2>
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="input min-h-[100px]"
            placeholder="講師簡介..."
          />
        </div>

        {/* Specialties */}
        <div className="card border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">專長領域</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('specialties', specialtyInput, setSpecialtyInput))}
              className="input flex-1"
              placeholder="輸入專長後按 Enter"
            />
            <button type="button" onClick={() => addToArray('specialties', specialtyInput, setSpecialtyInput)} className="btn btn-secondary">
              新增
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {form.specialties.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                {s}
                <button type="button" onClick={() => removeFromArray('specialties', i)} className="hover:text-orange-900">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div className="card border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">授課項目</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('courses', courseInput, setCourseInput))}
              className="input flex-1"
              placeholder="輸入課程後按 Enter"
            />
            <button type="button" onClick={() => addToArray('courses', courseInput, setCourseInput)} className="btn btn-secondary">
              新增
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {form.courses.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {c}
                <button type="button" onClick={() => removeFromArray('courses', i)} className="hover:text-blue-900">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="card border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">專業認證</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('certifications', certInput, setCertInput))}
              className="input flex-1"
              placeholder="輸入認證後按 Enter"
            />
            <button type="button" onClick={() => addToArray('certifications', certInput, setCertInput)} className="btn btn-secondary">
              新增
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {form.certifications.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {c}
                <button type="button" onClick={() => removeFromArray('certifications', i)} className="hover:text-gray-900">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="card border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">設定</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排序順序</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                className="input"
              />
              <p className="text-xs text-gray-500 mt-1">數字越小越前面</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">狀態</label>
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span>上架顯示</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/lecturers" className="btn btn-ghost">
            取消
          </Link>
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? '儲存中...' : isNew ? '建立講師' : '儲存變更'}
          </button>
        </div>
      </form>
    </div>
  );
}
