'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

// Fallback 門店資料（當 API 失敗時使用）
const fallbackStores = [
  { id: 'nanjing', name: '南京店', address: '台北市中山區南京東路三段 29 號 B1', phone: '(02) 2507-4196' },
  { id: 'songjiang', name: '松江店', address: '台北市中山區松江路 122 號 B1', phone: '(02) 2537-1055' },
  { id: 'ximending', name: '西門店', address: '台北市中正區寶慶路 39 號', phone: '(02) 2370-3245' },
  { id: 'xindian', name: '新店七張店', address: '新北市新店區北新路二段 252 號 B1-2', phone: '(02) 8914-6428' },
];

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
}

// 方便聯繫時段選項（多選）
const contactTimeOptions = [
  '不限',
  '平日白天 (10:00-17:00)',
  '平日晚上 (18:00-21:00)',
  '假日白天',
  '假日晚上',
  '其他',
];

// 從哪裡得知選項（多選）
const sourceOptions = [
  'Google 搜尋',
  'Facebook',
  'Instagram',
  'LINE',
  'YouTube',
  'Podcast',
  '朋友推薦',
  '路過門店',
  '醫療院所轉介',
  '其他',
];

// 與學員關係選項
const relationshipOptions = [
  '配偶',
  '子女',
  '父母',
  '兄弟姊妹',
  '朋友',
  '其他',
];

type FormData = {
  // 學員資料
  name: string;
  phone: string;
  gender: string;
  birthDate: string;
  email: string;
  line: string;
  // 填寫者資料
  filledBySelf: string;
  relationship: string;
  bookerName: string;
  contactPhone: string;
  // 健康狀況
  hasMedicalCondition: string;
  medicalConditionNote: string;
  // 預約資訊
  storeId: string;
  preferredTimes: string[];
  preferredTimeOther: string;
  sources: string[];
  sourceOther: string;
  // 付款方式
  paymentMethod: string;
  // 備註
  message: string;
};

const initialFormData: FormData = {
  name: '',
  phone: '',
  gender: '',
  birthDate: '',
  email: '',
  line: '',
  filledBySelf: '本人填寫',
  relationship: '',
  bookerName: '',
  contactPhone: '',
  hasMedicalCondition: '',
  medicalConditionNote: '',
  storeId: '',
  preferredTimes: [],
  preferredTimeOther: '',
  sources: [],
  sourceOther: '',
  paymentMethod: '',
  message: '',
};

export default function BookingForm() {
  const t = useTranslations('booking');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [stores, setStores] = useState<Store[]>(fallbackStores);

  // 從 API 取得門店資料
  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch('/api/public/stores');
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            setStores(
              data.data.map((s: any) => ({
                id: s.id,
                name: s.name,
                address: `${s.city || ''}${s.district || ''}${s.address || ''}`,
                phone: s.phone || '',
              }))
            );
          }
        }
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      }
    }
    fetchStores();
  }, []);

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleSource = (source: string) => {
    const current = formData.sources;
    const updated = current.includes(source)
      ? current.filter((s) => s !== source)
      : [...current, source];
    updateFormData('sources', updated);
  };

  const togglePreferredTime = (time: string) => {
    const current = formData.preferredTimes;
    const updated = current.includes(time)
      ? current.filter((t) => t !== time)
      : [...current, time];
    updateFormData('preferredTimes', updated);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // 學員基本資料驗證
    if (!formData.name.trim()) newErrors.name = '請輸入學員姓名';
    if (!formData.phone.trim()) newErrors.phone = '請輸入手機號碼';
    if (formData.phone && !/^09\d{8}$/.test(formData.phone)) {
      newErrors.phone = '請輸入有效的手機號碼';
    }
    if (!formData.gender) newErrors.gender = '請選擇性別';
    if (!formData.birthDate) newErrors.birthDate = '請選擇出生年月日';
    if (!formData.email.trim()) {
      newErrors.email = '請輸入 Email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '請輸入有效的 Email';
    }

    // 填寫者資料驗證
    if (formData.filledBySelf === '親友代填') {
      if (!formData.relationship) newErrors.relationship = '請選擇與學員的關係';
      if (!formData.bookerName.trim()) newErrors.bookerName = '請輸入預約者姓名';
      if (!formData.contactPhone.trim()) newErrors.contactPhone = '請輸入方便聯繫的電話';
      if (formData.contactPhone && !/^09\d{8}$/.test(formData.contactPhone)) {
        newErrors.contactPhone = '請輸入有效的手機號碼';
      }
    }

    // 健康狀況驗證
    if (!formData.hasMedicalCondition) newErrors.hasMedicalCondition = '請選擇健康狀況';

    // 預約資訊驗證
    if (!formData.storeId) newErrors.storeId = '請選擇門店';
    if (formData.preferredTimes.length === 0) newErrors.preferredTimes = '請至少選擇一個時段';
    if (!formData.paymentMethod) newErrors.paymentMethod = '請選擇付款方式';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // 滾動到第一個錯誤欄位
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.querySelector(`[name="${firstErrorKey}"]`) ||
                       document.getElementById(firstErrorKey);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // 組合來源
      let finalSources = [...formData.sources];
      if (formData.sources.includes('其他') && formData.sourceOther.trim()) {
        finalSources = finalSources.filter(s => s !== '其他');
        finalSources.push(`其他: ${formData.sourceOther}`);
      }

      // 組合聯繫時段
      let finalPreferredTimes = [...formData.preferredTimes];
      if (formData.preferredTimes.includes('其他') && formData.preferredTimeOther.trim()) {
        finalPreferredTimes = finalPreferredTimes.filter(t => t !== '其他');
        finalPreferredTimes.push(`其他: ${formData.preferredTimeOther}`);
      }

      const response = await fetch('/api/leads/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // 學員資料
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          gender: formData.gender,
          birthDate: formData.birthDate,
          line: formData.line || null,
          // 填寫者資料
          filledBySelf: formData.filledBySelf === '本人填寫',
          relationship: formData.filledBySelf === '親友代填' ? formData.relationship : null,
          bookerName: formData.filledBySelf === '親友代填' ? formData.bookerName : null,
          contactPhone: formData.filledBySelf === '親友代填' ? formData.contactPhone : formData.phone,
          // 健康狀況
          hasMedicalCondition: formData.hasMedicalCondition === '是',
          medicalConditionNote: formData.hasMedicalCondition === '是' ? formData.medicalConditionNote : null,
          // 預約資訊
          storeId: formData.storeId,
          preferredTime: finalPreferredTimes,
          sources: finalSources,
          paymentMethod: formData.paymentMethod,
          message: formData.message,
          sourcePage: '/booking',
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert('送出失敗，請稍後再試');
      }
    } catch (error) {
      alert('網路錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-navy-700 font-serif">{t('success.title')}</h2>
        <p className="text-ink-600 mb-8">{t('success.message')}</p>
        <Link href="/" className="btn btn-primary">
          {t('success.backHome')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-navy-700 font-serif">{t('title')}</h1>
        <p className="text-ink-600 text-sm sm:text-base">{t('subtitle')}</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        {/* Section 1: 學員基本資料 */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-navy-700 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-orange text-white text-sm flex items-center justify-center">1</span>
            學員基本資料
          </h2>

          {/* Row 1: 學員姓名 | 學員手機 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">
                學員姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange ${
                  errors.name ? 'border-red-500' : 'border-cream-200'
                }`}
                placeholder="要來上課的人"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">
                學員手機 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange ${
                  errors.phone ? 'border-red-500' : 'border-cream-200'
                }`}
                placeholder="0912345678"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Row 2: 性別（下拉） | 出生年月日（日曆） */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">
                性別 <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={(e) => updateFormData('gender', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange ${
                  errors.gender ? 'border-red-500' : 'border-cream-200'
                }`}
              >
                <option value="">請選擇</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">
                出生年月日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={(e) => updateFormData('birthDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange ${
                  errors.birthDate ? 'border-red-500' : 'border-cream-200'
                }`}
                max={new Date().toISOString().split('T')[0]}
                min="1920-01-01"
              />
              {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
            </div>
          </div>

          {/* Row 3: Email | Line */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange ${
                  errors.email ? 'border-red-500' : 'border-cream-200'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">
                Line ID <span className="text-ink-500 font-normal">（選填）</span>
              </label>
              <input
                type="text"
                name="line"
                value={formData.line}
                onChange={(e) => updateFormData('line', e.target.value)}
                className="w-full px-4 py-3 border border-cream-200 rounded-lg focus:ring-2 focus:ring-orange focus:border-orange"
                placeholder="方便我們聯繫您"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-cream-200" />

        {/* Section 2: 填寫者資料 & 健康狀況 */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-navy-700 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-orange text-white text-sm flex items-center justify-center">2</span>
            填寫者資料 & 健康狀況
          </h2>

          <div>
            <label className="block text-sm font-medium mb-2 text-navy-700">
              是否為本人填寫 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {['本人填寫', '親友代填'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateFormData('filledBySelf', opt)}
                  className={`flex-1 py-3 rounded-lg border text-center transition-all ${
                    formData.filledBySelf === opt
                      ? 'border-orange bg-orange/10 text-orange font-medium'
                      : 'border-cream-200 hover:border-orange/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {formData.filledBySelf === '親友代填' && (
            <div className="bg-cream-50 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-navy-700">
                  與學員的關係 <span className="text-red-500">*</span>
                </label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={(e) => updateFormData('relationship', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange ${
                    errors.relationship ? 'border-red-500' : 'border-cream-200'
                  }`}
                >
                  <option value="">請選擇</option>
                  {relationshipOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.relationship && <p className="text-red-500 text-sm mt-1">{errors.relationship}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-navy-700">
                    預約者姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bookerName"
                    value={formData.bookerName}
                    onChange={(e) => updateFormData('bookerName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange ${
                      errors.bookerName ? 'border-red-500' : 'border-cream-200'
                    }`}
                    placeholder="請輸入您的姓名"
                  />
                  {errors.bookerName && <p className="text-red-500 text-sm mt-1">{errors.bookerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-navy-700">
                    方便聯繫的電話 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData('contactPhone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange ${
                      errors.contactPhone ? 'border-red-500' : 'border-cream-200'
                    }`}
                    placeholder="0912345678"
                  />
                  {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <label className="block text-sm font-medium mb-2 text-navy-700">
              是否有疾病，或 3 年內曾開過刀或住院？ <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {['是', '否'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateFormData('hasMedicalCondition', opt)}
                  className={`flex-1 py-3 rounded-lg border text-center transition-all ${
                    formData.hasMedicalCondition === opt
                      ? 'border-orange bg-orange/10 text-orange font-medium'
                      : 'border-cream-200 hover:border-orange/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {errors.hasMedicalCondition && <p className="text-red-500 text-sm mt-1">{errors.hasMedicalCondition}</p>}
          </div>

          {formData.hasMedicalCondition === '是' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">
                請簡述情況 <span className="text-ink-500 font-normal">（選填）</span>
              </label>
              <textarea
                name="medicalConditionNote"
                value={formData.medicalConditionNote}
                onChange={(e) => updateFormData('medicalConditionNote', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-cream-200 rounded-lg focus:ring-2 focus:ring-orange"
                placeholder="例如：膝蓋退化、心臟手術等"
              />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-cream-200" />

        {/* Section 3: 預約資訊 */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-navy-700 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-orange text-white text-sm flex items-center justify-center">3</span>
            預約資訊
          </h2>

          <div id="storeId">
            <label className="block text-sm font-medium mb-2 text-navy-700">
              選擇門店 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stores.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => updateFormData('storeId', store.id)}
                  className={`p-3 sm:p-4 rounded-lg border text-left transition-all ${
                    formData.storeId === store.id
                      ? 'border-orange bg-orange/10 ring-2 ring-orange'
                      : 'border-cream-200 hover:border-orange/50'
                  }`}
                >
                  <div className="font-semibold text-navy-700 text-sm sm:text-base">{store.name}</div>
                  <div className="text-xs sm:text-sm text-ink/60 mt-0.5">{store.address}</div>
                  <div className="text-xs sm:text-sm text-navy-700 mt-0.5">{store.phone}</div>
                </button>
              ))}
            </div>
            {errors.storeId && <p className="text-red-500 text-sm mt-2">{errors.storeId}</p>}
          </div>

          <div id="preferredTimes">
            <label className="block text-sm font-medium mb-2 text-navy-700">
              方便聯繫時段 <span className="text-red-500">*</span>
              <span className="text-ink-500 font-normal ml-1">（可複選）</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {contactTimeOptions.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => togglePreferredTime(time)}
                  className={`p-2.5 rounded-lg border text-sm text-center transition-all flex items-center justify-center gap-2 ${
                    formData.preferredTimes.includes(time)
                      ? 'border-orange bg-orange/10 text-orange'
                      : 'border-cream-200 hover:border-orange/50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      formData.preferredTimes.includes(time)
                        ? 'border-orange bg-orange'
                        : 'border-ink-300'
                    }`}
                  >
                    {formData.preferredTimes.includes(time) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {time}
                </button>
              ))}
            </div>
            {formData.preferredTimes.includes('其他') && (
              <input
                type="text"
                value={formData.preferredTimeOther}
                onChange={(e) => updateFormData('preferredTimeOther', e.target.value)}
                className="w-full mt-2 px-4 py-3 border border-cream-200 rounded-lg focus:ring-2 focus:ring-orange"
                placeholder="請說明其他方便時段"
              />
            )}
            {errors.preferredTimes && <p className="text-red-500 text-sm mt-2">{errors.preferredTimes}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-navy-700">
              從哪裡得知練健康？ <span className="text-ink-500 font-normal">（可複選）</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sourceOptions.map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => toggleSource(source)}
                  className={`p-2.5 rounded-lg border text-sm text-center transition-all flex items-center justify-center gap-2 ${
                    formData.sources.includes(source)
                      ? 'border-orange bg-orange/10 text-orange'
                      : 'border-cream-200 hover:border-orange/50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      formData.sources.includes(source)
                        ? 'border-orange bg-orange'
                        : 'border-ink-300'
                    }`}
                  >
                    {formData.sources.includes(source) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {source}
                </button>
              ))}
            </div>
            {formData.sources.includes('其他') && (
              <input
                type="text"
                value={formData.sourceOther}
                onChange={(e) => updateFormData('sourceOther', e.target.value)}
                className="w-full mt-2 px-4 py-3 border border-cream-200 rounded-lg focus:ring-2 focus:ring-orange"
                placeholder="請說明從哪裡得知"
              />
            )}
          </div>

          <div id="paymentMethod">
            <label className="block text-sm font-medium mb-2 text-navy-700">
              付款方式 <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => updateFormData('paymentMethod', '50歲以上免費')}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  formData.paymentMethod === '50歲以上免費'
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-500'
                    : 'border-cream-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMethod === '50歲以上免費' ? 'border-green-500' : 'border-ink-300'
                  }`}>
                    {formData.paymentMethod === '50歲以上免費' && (
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-green-600">50 歲以上免費</span>
                    <span className="text-sm text-ink/60 ml-2">首次體驗完全免費</span>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => updateFormData('paymentMethod', '臨櫃付款')}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  formData.paymentMethod === '臨櫃付款'
                    ? 'border-orange bg-orange/10 ring-2 ring-orange'
                    : 'border-cream-200 hover:border-orange/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.paymentMethod === '臨櫃付款' ? 'border-orange' : 'border-ink-300'
                  }`}>
                    {formData.paymentMethod === '臨櫃付款' && (
                      <div className="w-3 h-3 rounded-full bg-orange" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-navy-700">臨櫃付款</span>
                    <span className="text-sm text-ink/60 ml-2">首次體驗 $500</span>
                  </div>
                </div>
              </button>
            </div>
            {errors.paymentMethod && <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-navy-700">
              想說什麼或想問什麼 <span className="text-ink-500 font-normal">（選填）</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={(e) => updateFormData('message', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-cream-200 rounded-lg focus:ring-2 focus:ring-orange"
              placeholder="有任何問題或特殊需求，請在此告訴我們"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-cream-200">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full btn btn-primary py-4 text-lg disabled:opacity-50"
          >
            {isSubmitting ? t('form.submitting') : '送出預約'}
          </button>
          <p className="text-sm text-ink-500 text-center mt-4">
            送出後，我們將於 1 個工作天內與您聯繫確認體驗時間。
          </p>
        </div>
      </div>
    </div>
  );
}
