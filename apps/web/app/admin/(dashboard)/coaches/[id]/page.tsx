'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Coach {
  id: string;
  name: string;
  slug: string;
  roleTitle: string;
  storeId: string;
  photo: string;
  specialties: string[];
  certifications: string[];
  experiences: string[];
  education: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

interface StoreOption {
  value: string;
  label: string;
}

export default function CoachEditPage() {
  const router = useRouter();
  const params = useParams();
  const coachId = params.id as string;
  const isNew = coachId === 'new';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeOptions, setStoreOptions] = useState<StoreOption[]>([]);
  const [formData, setFormData] = useState<Coach>({
    id: '',
    name: '',
    slug: '',
    roleTitle: '',
    storeId: '',
    photo: '',
    specialties: [],
    certifications: [],
    experiences: [],
    education: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  });

  // 陣列欄位的臨時輸入值
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newExperience, setNewExperience] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // 取得門店列表
        const storesRes = await fetch('/api/admin/stores');
        if (storesRes.ok) {
          const storesData = await storesRes.json();
          setStoreOptions(
            storesData.data.map((s: any) => ({ value: s.id, label: s.name }))
          );
        }

        // 如果是編輯模式，取得教練資料
        if (!isNew && coachId) {
          const coachRes = await fetch(`/api/admin/coaches/${coachId}`);
          if (coachRes.ok) {
            const coachData = await coachRes.json();
            if (coachData.success && coachData.data) {
              const edu = coachData.data.education;
              setFormData({
                ...coachData.data,
                education: Array.isArray(edu) ? edu.join(', ') : (edu || ''),
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [coachId, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');
      const payload = {
        name: formData.name,
        slug,
        roleTitle: formData.roleTitle,
        storeId: formData.storeId,
        photo: formData.photo,
        specialties: formData.specialties,
        certifications: formData.certifications,
        experiences: formData.experiences,
        education: formData.education ? formData.education.split(',').map(s => s.trim()).filter(Boolean) : [],
        description: formData.description,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
      };

      const url = isNew ? '/api/admin/coaches' : `/api/admin/coaches/${coachId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/coaches');
      } else {
        alert(data.error || '儲存失敗');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('儲存失敗，請稍後再試');
    } finally {
      setSaving(false);
    }
  };

  const addToArray = (field: 'specialties' | 'certifications' | 'experiences', value: string) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const removeFromArray = (field: 'specialties' | 'certifications' | 'experiences', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/coaches" className="text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold font-sans">{isNew ? '新增教練' : '編輯教練'}</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg font-sans border-b pb-2">基本資訊</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                職稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.roleTitle}
                onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                className="input"
                placeholder="例如：資深教練、物理治療師"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                所屬門店 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.storeId}
                onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                className="input"
                required
              >
                <option value="">請選擇門店</option>
                {storeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">排序</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="input"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">學歷</label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="input"
              placeholder="例如：台北體育大學運動科學系"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">個人簡介</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={3}
              placeholder="簡短介紹教練的專業背景和教學理念"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-navy-700 rounded"
            />
            <label htmlFor="isActive" className="text-sm">
              上架顯示
            </label>
          </div>
        </div>

        {/* Photo */}
        <div className="card border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg font-sans border-b pb-2">照片</h2>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
              {formData.photo ? (
                <img src={formData.photo} alt={formData.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div>
              <button type="button" className="btn btn-secondary text-sm">
                上傳照片
              </button>
              <p className="text-xs text-gray-500 mt-1">建議尺寸 400x400，JPG 或 PNG</p>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="card border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg font-sans border-b pb-2">專長</h2>
          <div className="flex flex-wrap gap-2">
            {formData.specialties.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-navy-700/10 text-navy-700 px-3 py-1 rounded-full text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeFromArray('specialties', index)}
                  className="hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              className="input flex-1"
              placeholder="輸入專長，例如：肌力訓練"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('specialties', newSpecialty);
                  setNewSpecialty('');
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                addToArray('specialties', newSpecialty);
                setNewSpecialty('');
              }}
              className="btn btn-secondary"
            >
              新增
            </button>
          </div>
        </div>

        {/* Certifications */}
        <div className="card border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg font-sans border-b pb-2">證照</h2>
          <div className="flex flex-wrap gap-2">
            {formData.certifications.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeFromArray('certifications', index)}
                  className="hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              className="input flex-1"
              placeholder="輸入證照，例如：ACE-CPT"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('certifications', newCertification);
                  setNewCertification('');
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                addToArray('certifications', newCertification);
                setNewCertification('');
              }}
              className="btn btn-secondary"
            >
              新增
            </button>
          </div>
        </div>

        {/* Experiences */}
        <div className="card border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg font-sans border-b pb-2">經歷</h2>
          <div className="space-y-2">
            {formData.experiences.map((item, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                <span className="flex-1">{item}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray('experiences', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newExperience}
              onChange={(e) => setNewExperience(e.target.value)}
              className="input flex-1"
              placeholder="輸入經歷，例如：5年健身教練經驗"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('experiences', newExperience);
                  setNewExperience('');
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                addToArray('experiences', newExperience);
                setNewExperience('');
              }}
              className="btn btn-secondary"
            >
              新增
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/coaches" className="btn btn-ghost">
            取消
          </Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? '儲存中...' : '儲存'}
          </button>
        </div>
      </form>
    </div>
  );
}
