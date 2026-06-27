'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// 門店環境照片分類定義（共5張）
const imageCategories = [
  { key: 'env1', label: '環境照片 1', description: '主訓練區', required: false },
  { key: 'env2', label: '環境照片 2', description: '一對一訓練空間', required: false },
  { key: 'env3', label: '環境照片 3', description: '團體課教室', required: false },
  { key: 'env4', label: '環境照片 4', description: '接待區', required: false },
  { key: 'env5', label: '環境照片 5', description: '其他空間', required: false },
];

interface StoreImages {
  env1: string;
  env2: string;
  env3: string;
  env4: string;
  env5: string;
}

interface TransportInfo {
  mrt: { station: string; desc: string };
  bus: { stop: string; desc: string };
  car: { desc: string };
  parking: { desc: string };
}

interface Store {
  id: string;
  name: string;
  slug: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  googleMapUrl: string;
  businessHours: {
    weekday: string;
    saturday: string;
    sunday: string;
    holiday: string;
  };
  transport: TransportInfo;
  images: StoreImages;
  sortOrder: number;
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  slug?: string;
  city?: string;
  district?: string;
  address?: string;
  phone?: string;
}

const cityOptions = ['台北市', '新北市', '桃園市', '新竹市', '新竹縣', '台中市', '台南市', '高雄市'];

const defaultImages: StoreImages = {
  env1: '',
  env2: '',
  env3: '',
  env4: '',
  env5: '',
};

const defaultTransport: TransportInfo = {
  mrt: { station: '', desc: '' },
  bus: { stop: '', desc: '' },
  car: { desc: '' },
  parking: { desc: '' },
};

export default function StoreEditPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;
  const isNew = storeId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Store>({
    id: '',
    name: '',
    slug: '',
    city: '',
    district: '',
    address: '',
    phone: '',
    googleMapUrl: '',
    businessHours: {
      weekday: '09:00 - 21:00',
      saturday: '09:00 - 18:00',
      sunday: '公休',
      holiday: '依公告，請來電確認',
    },
    transport: { ...defaultTransport },
    images: { ...defaultImages },
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    const fetchStore = async () => {
      // 新增模式時，取得目前最大排序值 +1
      if (isNew) {
        try {
          const storesRes = await fetch('/api/admin/stores');
          if (storesRes.ok) {
            const storesData = await storesRes.json();
            if (storesData.data && storesData.data.length > 0) {
              const maxSortOrder = Math.max(...storesData.data.map((s: any) => s.sortOrder || 0));
              setFormData(prev => ({ ...prev, sortOrder: maxSortOrder + 1 }));
            } else {
              setFormData(prev => ({ ...prev, sortOrder: 1 }));
            }
          }
        } catch (error) {
          console.error('Failed to fetch stores for sortOrder:', error);
        }
        return;
      }

      if (storeId) {
        try {
          const res = await fetch(`/api/admin/stores/${storeId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data) {
              const storeData = data.data;

              // Parse businessHours if it's a string
              let businessHours = {
                weekday: '09:00 - 21:00',
                saturday: '09:00 - 18:00',
                sunday: '公休',
                holiday: '依公告，請來電確認',
              };
              if (storeData.businessHours) {
                if (typeof storeData.businessHours === 'string') {
                  try {
                    const parsed = JSON.parse(storeData.businessHours);
                    // Handle legacy format with 'weekend' field
                    businessHours = {
                      weekday: parsed.weekday || businessHours.weekday,
                      saturday: parsed.saturday || parsed.weekend || businessHours.saturday,
                      sunday: parsed.sunday || businessHours.sunday,
                      holiday: parsed.holiday || businessHours.holiday,
                    };
                  } catch {
                    businessHours = { ...businessHours, weekday: storeData.businessHours };
                  }
                } else {
                  // Handle legacy format with 'weekend' field
                  businessHours = {
                    weekday: storeData.businessHours.weekday || businessHours.weekday,
                    saturday: storeData.businessHours.saturday || storeData.businessHours.weekend || businessHours.saturday,
                    sunday: storeData.businessHours.sunday || businessHours.sunday,
                    holiday: storeData.businessHours.holiday || businessHours.holiday,
                  };
                }
              }

              // Handle images - convert from array to categorized object
              let images = { ...defaultImages };
              if (storeData.images) {
                if (typeof storeData.images === 'object' && !Array.isArray(storeData.images)) {
                  // Already in new format
                  images = { ...defaultImages, ...storeData.images };
                } else if (Array.isArray(storeData.images)) {
                  // Legacy array format - map to new structure
                  const imageKeys = Object.keys(defaultImages) as (keyof StoreImages)[];
                  storeData.images.forEach((url: string, index: number) => {
                    if (url && imageKeys[index]) {
                      images[imageKeys[index]] = url;
                    }
                  });
                }
              }

              // Handle transport - can be object or legacy string
              let transport = { ...defaultTransport };
              if (storeData.transport) {
                if (typeof storeData.transport === 'object') {
                  transport = {
                    mrt: {
                      station: storeData.transport.mrt?.station || '',
                      desc: storeData.transport.mrt?.desc || '',
                    },
                    bus: {
                      stop: storeData.transport.bus?.stop || '',
                      desc: storeData.transport.bus?.desc || '',
                    },
                    car: {
                      desc: storeData.transport.car?.desc || '',
                    },
                    parking: {
                      desc: storeData.transport.parking?.desc || '',
                    },
                  };
                }
              } else if (storeData.transportation && typeof storeData.transportation === 'string') {
                // Legacy single string format - put in mrt desc
                transport.mrt.desc = storeData.transportation;
              }

              setFormData({
                id: storeData.id || '',
                name: storeData.name || '',
                slug: storeData.slug || '',
                city: storeData.city || '',
                district: storeData.district || '',
                address: storeData.address || '',
                phone: storeData.phone || '',
                googleMapUrl: storeData.googleMapUrl || '',
                businessHours,
                transport,
                images,
                sortOrder: storeData.sortOrder || 0,
                isActive: storeData.isActive ?? true,
              });
            }
          } else {
            alert('找不到此門店');
            router.push('/admin/stores');
          }
        } catch (error) {
          console.error('Failed to fetch store:', error);
          alert('載入門店資料失敗');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStore();
  }, [storeId, isNew, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '請輸入門店名稱';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = '請輸入網址代稱';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = '網址代稱僅限小寫英文、數字、連字號';
    }

    if (!formData.city) {
      newErrors.city = '請選擇縣市';
    }

    if (!formData.district.trim()) {
      newErrors.district = '請輸入區域';
    }

    if (!formData.address.trim()) {
      newErrors.address = '請輸入詳細地址';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '請輸入電話';
    } else if (!/^[\d\-()+ ]+$/.test(formData.phone)) {
      newErrors.phone = '電話格式不正確';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        city: formData.city,
        district: formData.district.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        googleMapUrl: formData.googleMapUrl.trim(),
        businessHours: JSON.stringify(formData.businessHours),
        transport: formData.transport,
        images: formData.images,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
      };

      const url = isNew ? '/api/admin/stores' : `/api/admin/stores/${storeId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/stores');
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

  const generateSlug = (name: string) => {
    const mapping: Record<string, string> = {
      '台北': 'taipei',
      '新北': 'newtaipei',
      '新竹': 'hsinchu',
      '台中': 'taichung',
      '台南': 'tainan',
      '高雄': 'kaohsiung',
      '南京': 'nanjing',
      '松江': 'songjiang',
      '西門': 'ximending',
      '新店': 'xindian',
      '七張': 'qizhang',
      '民生': 'minsheng',
      '店': '',
    };

    let slug = name.toLowerCase();
    Object.entries(mapping).forEach(([zh, en]) => {
      slug = slug.replace(zh, en);
    });
    return slug.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const updateImage = (key: keyof StoreImages, value: string) => {
    setFormData({
      ...formData,
      images: { ...formData.images, [key]: value },
    });
  };

  const handleImageUpload = async (key: keyof StoreImages, file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('僅支援 JPG、PNG、WebP、GIF 格式');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('檔案大小不可超過 5MB');
      return;
    }

    setUploadingImages((prev) => ({ ...prev, [key]: true }));

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', `stores/${formData.slug || 'temp'}`);
      formDataUpload.append('filename', key);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        updateImage(key, data.data.url);
      } else {
        alert(data.error || '上傳失敗');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('上傳失敗，請稍後再試');
    } finally {
      setUploadingImages((prev) => ({ ...prev, [key]: false }));
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/stores" className="text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-sans">{isNew ? '新增門店' : '編輯門店'}</h1>
          {!isNew && formData.name && (
            <p className="text-gray-500 text-sm mt-1">編輯「{formData.name}」的資料</p>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg font-sans border-b pb-2">基本資訊</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                門店名稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: isNew ? generateSlug(name) : formData.slug,
                  });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={`input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="例如：台北南京店"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                網址代稱 (Slug) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setFormData({ ...formData, slug: e.target.value.toLowerCase() });
                  if (errors.slug) setErrors({ ...errors, slug: undefined });
                }}
                className={`input ${errors.slug ? 'border-red-500' : ''}`}
                placeholder="taipei-nanjing"
              />
              {errors.slug ? (
                <p className="text-red-500 text-xs mt-1">{errors.slug}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">僅限小寫英文、數字、連字號</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                縣市 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: undefined });
                }}
                className={`input ${errors.city ? 'border-red-500' : ''}`}
              >
                <option value="">請選擇</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                區域 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => {
                  setFormData({ ...formData, district: e.target.value });
                  if (errors.district) setErrors({ ...errors, district: undefined });
                }}
                className={`input ${errors.district ? 'border-red-500' : ''}`}
                placeholder="例如：松山區"
              />
              {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              詳細地址 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value });
                if (errors.address) setErrors({ ...errors, address: undefined });
              }}
              className={`input ${errors.address ? 'border-red-500' : ''}`}
              placeholder="例如：南京東路四段 123 號 2 樓"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                電話 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                className={`input ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="(02) 2712-3456"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
              <p className="text-xs text-gray-500 mt-1">數字越小越前面</p>
            </div>
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

        {/* Business Hours */}
        <div className="card border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg font-sans border-b pb-2">營業時間</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">週一至週五</label>
              <input
                type="text"
                value={formData.businessHours.weekday}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessHours: { ...formData.businessHours, weekday: e.target.value },
                  })
                }
                className="input"
                placeholder="09:00 - 21:00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">週六</label>
              <input
                type="text"
                value={formData.businessHours.saturday}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessHours: { ...formData.businessHours, saturday: e.target.value },
                  })
                }
                className="input"
                placeholder="09:00 - 18:00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">週日</label>
              <input
                type="text"
                value={formData.businessHours.sunday}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessHours: { ...formData.businessHours, sunday: e.target.value },
                  })
                }
                className="input"
                placeholder="公休"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">國定假日</label>
              <input
                type="text"
                value={formData.businessHours.holiday}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessHours: { ...formData.businessHours, holiday: e.target.value },
                  })
                }
                className="input"
                placeholder="依公告，請來電確認"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg font-sans border-b pb-2">交通資訊</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Google Maps 連結</label>
            <input
              type="url"
              value={formData.googleMapUrl}
              onChange={(e) => setFormData({ ...formData, googleMapUrl: e.target.value })}
              className="input"
              placeholder="https://maps.google.com/..."
            />
          </div>

          {/* 捷運 */}
          <div className="bg-green-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-600 text-white">捷運</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">站名與出口</label>
                <input
                  type="text"
                  value={formData.transport.mrt.station}
                  onChange={(e) => setFormData({
                    ...formData,
                    transport: {
                      ...formData.transport,
                      mrt: { ...formData.transport.mrt, station: e.target.value }
                    }
                  })}
                  className="input"
                  placeholder="例：南京復興站 2 號出口"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">步行說明</label>
                <input
                  type="text"
                  value={formData.transport.mrt.desc}
                  onChange={(e) => setFormData({
                    ...formData,
                    transport: {
                      ...formData.transport,
                      mrt: { ...formData.transport.mrt, desc: e.target.value }
                    }
                  })}
                  className="input"
                  placeholder="例：出站後沿南京東路方向步行約 3 分鐘"
                />
              </div>
            </div>
          </div>

          {/* 公車 */}
          <div className="bg-orange-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange text-white">公車</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">站牌名稱</label>
                <input
                  type="text"
                  value={formData.transport.bus.stop}
                  onChange={(e) => setFormData({
                    ...formData,
                    transport: {
                      ...formData.transport,
                      bus: { ...formData.transport.bus, stop: e.target.value }
                    }
                  })}
                  className="input"
                  placeholder="例：南京復興站"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">路線說明</label>
                <input
                  type="text"
                  value={formData.transport.bus.desc}
                  onChange={(e) => setFormData({
                    ...formData,
                    transport: {
                      ...formData.transport,
                      bus: { ...formData.transport.bus, desc: e.target.value }
                    }
                  })}
                  className="input"
                  placeholder="例：多條公車路線可達"
                />
              </div>
            </div>
          </div>

          {/* 開車 */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-navy-700 text-white">開車</span>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">開車路線說明</label>
              <textarea
                value={formData.transport.car.desc}
                onChange={(e) => setFormData({
                  ...formData,
                  transport: {
                    ...formData.transport,
                    car: { desc: e.target.value }
                  }
                })}
                className="input"
                rows={2}
                placeholder="例：沿北新路往新店方向，過七張路口後即可見到"
              />
            </div>
          </div>

          {/* 停車 */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-500 text-white">停車</span>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">停車資訊</label>
              <textarea
                value={formData.transport.parking.desc}
                onChange={(e) => setFormData({
                  ...formData,
                  transport: {
                    ...formData.transport,
                    parking: { desc: e.target.value }
                  }
                })}
                className="input"
                rows={2}
                placeholder="例：附近有公共停車場，或路邊停車格"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card border border-gray-200 p-6 space-y-6">
          <div>
            <h2 className="font-bold text-lg font-sans border-b pb-2">門店照片</h2>
            <p className="text-sm text-gray-500 mt-2">
              請依照各區域上傳對應的照片（支援 JPG、PNG、WebP、GIF，最大 5MB）
            </p>
          </div>

          {imageCategories.map((category) => {
            const imageValue = formData.images[category.key as keyof StoreImages];
            const isUploading = uploadingImages[category.key];

            return (
              <div key={category.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">
                    {category.label}
                  </label>
                  <span className="text-xs text-gray-400">{category.description}</span>
                </div>

                {/* Image preview or upload area */}
                {imageValue ? (
                  <div className="relative rounded-lg overflow-hidden border bg-gray-50 group">
                    <img
                      src={imageValue}
                      alt={`${category.label}預覽`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"%3E%3Cpath stroke="%239ca3af" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/%3E%3C/svg%3E';
                      }}
                    />
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="cursor-pointer bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                        更換圖片
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(category.key as keyof StoreImages, file);
                          }}
                          disabled={isUploading}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => updateImage(category.key as keyof StoreImages, '')}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    isUploading
                      ? 'border-orange bg-orange/5'
                      : 'border-gray-300 hover:border-orange hover:bg-orange/5'
                  }`}>
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <svg className="animate-spin h-8 w-8 text-orange mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-orange">上傳中...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-500 mb-1">點擊上傳{category.description}照片</span>
                        <span className="text-xs text-gray-400">JPG、PNG、WebP、GIF（最大 5MB）</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(category.key as keyof StoreImages, file);
                      }}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>
            );
          })}

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">上傳提示</p>
                <ul className="text-xs space-y-0.5">
                  <li>• 建議使用橫向照片（比例約 4:3 或 16:9）</li>
                  <li>• 照片會自動儲存至 Firebase Storage</li>
                  <li>• 儲存路徑：stores/{formData.slug || '[門店代稱]'}/</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> 為必填欄位
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/stores" className="btn btn-ghost">
              取消
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '儲存中...' : '儲存'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
