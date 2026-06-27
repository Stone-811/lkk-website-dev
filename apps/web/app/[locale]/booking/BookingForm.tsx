'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

// 門店資料（對齊分店資訊）
const stores = [
  { id: 'nanjing', name: '南京店', address: '台北市中山區南京東路三段 29 號 B1', phone: '(02) 2507-4196' },
  { id: 'songjiang', name: '松江店', address: '台北市中山區松江路 122 號 B1', phone: '(02) 2537-1055' },
  { id: 'ximending', name: '西門店', address: '台北市中正區寶慶路 39 號', phone: '(02) 2370-3245' },
  { id: 'xindian', name: '新店七張店', address: '新北市新店區北新路二段 252 號 B1-2', phone: '(02) 8914-6428' },
];

const timeSlots = [
  '平日上午 (10:00-12:00)',
  '平日下午 (14:00-17:00)',
  '平日晚間 (18:00-21:00)',
  '週末上午 (09:00-12:00)',
  '週末下午 (14:00-18:00)',
];

const sources = [
  'Google 搜尋',
  'Facebook',
  'Instagram',
  'LINE',
  'YouTube',
  '朋友推薦',
  '路過門店',
  '其他',
];

const goals = [
  '減重減脂',
  '增肌塑身',
  '體能提升',
  '復健訓練',
  '運動表現',
  '維持健康',
  '其他',
];

type FormData = {
  name: string;
  phone: string;
  email: string;
  gender: string;
  age: string;
  goal: string;
  storeId: string;
  preferredTime: string[];
  source: string;
  message: string;
};

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  gender: '',
  age: '',
  goal: '',
  storeId: '',
  preferredTime: [],
  source: '',
  message: '',
};

export default function BookingForm() {
  const t = useTranslations('booking');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = '請輸入姓名';
      if (!formData.phone.trim()) newErrors.phone = '請輸入手機號碼';
      if (formData.phone && !/^09\d{8}$/.test(formData.phone)) {
        newErrors.phone = '請輸入有效的手機號碼';
      }
      if (!formData.email.trim()) {
        newErrors.email = '請輸入 Email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = '請輸入有效的 Email';
      }
      if (!formData.gender) newErrors.gender = '請選擇性別';
      if (!formData.age) newErrors.age = '請選擇年齡';
    }

    if (currentStep === 2) {
      if (!formData.storeId) newErrors.storeId = '請選擇門店';
    }

    if (currentStep === 3) {
      if (formData.preferredTime.length === 0) {
        newErrors.preferredTime = '請至少選擇一個時段' as any;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
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

  const togglePreferredTime = (time: string) => {
    const current = formData.preferredTime;
    const updated = current.includes(time)
      ? current.filter((t) => t !== time)
      : [...current, time];
    updateFormData('preferredTime', updated);
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

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-medium text-sm sm:text-base transition-colors ${
                s === step
                  ? 'bg-orange text-white'
                  : s < step
                  ? 'bg-orange/20 text-orange'
                  : 'bg-cream-200 text-ink-400'
              }`}
            >
              {s < step ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s
              )}
            </div>
            {s < 4 && <div className={`w-6 sm:w-12 h-1 mx-1 sm:mx-2 ${s < step ? 'bg-orange/30' : 'bg-cream-200'}`} />}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4 text-navy-700">{t('steps.info')}</h2>

            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">
                {t('form.name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange ${
                  errors.name ? 'border-red-500' : 'border-cream-200'
                }`}
                placeholder="請輸入您的姓名"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">
                {t('form.phone')} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange ${
                  errors.phone ? 'border-red-500' : 'border-cream-200'
                }`}
                placeholder="0912345678"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">
                {t('form.email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange focus:border-orange ${
                  errors.email ? 'border-red-500' : 'border-cream-200'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-navy-700">
                  {t('form.gender')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateFormData('gender', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange ${
                    errors.gender ? 'border-red-500' : 'border-cream-200'
                  }`}
                >
                  <option value="">請選擇</option>
                  <option value="male">{t('form.male')}</option>
                  <option value="female">{t('form.female')}</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-navy-700">
                  {t('form.age')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange ${
                    errors.age ? 'border-red-500' : 'border-cream-200'
                  }`}
                >
                  <option value="">請選擇</option>
                  <option value="18-25">18-25 歲</option>
                  <option value="26-35">26-35 歲</option>
                  <option value="36-45">36-45 歲</option>
                  <option value="46-55">46-55 歲</option>
                  <option value="56-65">56-65 歲</option>
                  <option value="65+">65 歲以上</option>
                </select>
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">{t('form.goal')}</label>
              <div className="flex flex-wrap gap-2">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => updateFormData('goal', goal)}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      formData.goal === goal
                        ? 'bg-orange text-white border-orange'
                        : 'border-cream-200 hover:border-orange/50'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Store Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4 text-navy-700">{t('steps.store')}</h2>

            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">
                {t('form.store')} <span className="text-red-500">*</span>
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
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4 text-navy-700">{t('steps.time')}</h2>

            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">
                {t('form.preferredTime')} <span className="text-red-500">*</span>
                <span className="text-ink-500 font-normal">（可複選）</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => togglePreferredTime(time)}
                    className={`p-3 sm:p-4 rounded-lg border text-left transition-all flex items-center gap-2 sm:gap-3 ${
                      formData.preferredTime.includes(time)
                        ? 'border-orange bg-orange/10'
                        : 'border-cream-200 hover:border-orange/50'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        formData.preferredTime.includes(time)
                          ? 'border-orange bg-orange'
                          : 'border-ink-300'
                      }`}
                    >
                      {formData.preferredTime.includes(time) && (
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm sm:text-base">{time}</span>
                  </button>
                ))}
              </div>
              {errors.preferredTime && <p className="text-red-500 text-sm mt-2">{errors.preferredTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">{t('form.source')}</label>
              <select
                value={formData.source}
                onChange={(e) => updateFormData('source', e.target.value)}
                className="w-full px-4 py-3 border border-cream-200 rounded-lg focus:ring-2 focus:ring-orange"
              >
                <option value="">請選擇</option>
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-navy-700">{t('form.message')}</label>
              <textarea
                value={formData.message}
                onChange={(e) => updateFormData('message', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-cream-200 rounded-lg focus:ring-2 focus:ring-orange"
                placeholder="有任何問題或特殊需求，請在此告訴我們"
              />
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4 text-navy-700">{t('steps.confirm')}</h2>

            <div className="bg-cream-100 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-ink-600">姓名</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">手機</span>
                <span className="font-medium">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Email</span>
                <span className="font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">門店</span>
                <span className="font-medium">{stores.find((s) => s.id === formData.storeId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">方便時段</span>
                <span className="font-medium text-right">{formData.preferredTime.join('、')}</span>
              </div>
              {formData.goal && (
                <div className="flex justify-between">
                  <span className="text-ink-600">運動目標</span>
                  <span className="font-medium">{formData.goal}</span>
                </div>
              )}
              {formData.message && (
                <div>
                  <span className="text-ink-600 block mb-1">備註</span>
                  <span className="text-sm">{formData.message}</span>
                </div>
              )}
            </div>

            <p className="text-sm text-ink-500">
              送出後，我們將於 24 小時內與您聯繫確認體驗時間。
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-cream-200">
          {step > 1 ? (
            <button type="button" onClick={handlePrev} className="btn btn-secondary">
              {t('form.prev')}
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button type="button" onClick={handleNext} className="btn btn-primary">
              {t('form.next')}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-primary disabled:opacity-50"
            >
              {isSubmitting ? t('form.submitting') : t('form.submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
