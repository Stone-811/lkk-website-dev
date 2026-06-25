'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// 暫用假資料
const storesData: Record<string, Store> = {
  'taipei-nanjing': {
    id: 'taipei-nanjing',
    name: '台北南京店',
    slug: 'taipei-nanjing',
    city: '台北市',
    district: '松山區',
    address: '南京東路四段 123 號 2 樓',
    phone: '02-2712-3456',
    googleMapUrl: 'https://maps.google.com/?q=台北市松山區南京東路四段123號',
    businessHours: {
      weekday: '10:00 - 22:00',
      weekend: '09:00 - 20:00',
    },
    transportation: '捷運南京三民站 2 號出口步行 3 分鐘',
    heroImage: '',
    galleryImages: [],
    sortOrder: 1,
    isActive: true,
  },
  'taipei-minsheng': {
    id: 'taipei-minsheng',
    name: '台北民生店',
    slug: 'taipei-minsheng',
    city: '台北市',
    district: '松山區',
    address: '民生東路三段 456 號 3 樓',
    phone: '02-2718-9012',
    googleMapUrl: 'https://maps.google.com/?q=台北市松山區民生東路三段456號',
    businessHours: {
      weekday: '10:00 - 22:00',
      weekend: '09:00 - 20:00',
    },
    transportation: '捷運中山國中站步行 5 分鐘',
    heroImage: '',
    galleryImages: [],
    sortOrder: 2,
    isActive: true,
  },
  'hsinchu': {
    id: 'hsinchu',
    name: '新竹店',
    slug: 'hsinchu',
    city: '新竹市',
    district: '東區',
    address: '光復路一段 789 號',
    phone: '03-572-3456',
    googleMapUrl: 'https://maps.google.com/?q=新竹市東區光復路一段789號',
    businessHours: {
      weekday: '10:00 - 22:00',
      weekend: '09:00 - 20:00',
    },
    transportation: '近新竹火車站，步行約 10 分鐘',
    heroImage: '',
    galleryImages: [],
    sortOrder: 3,
    isActive: true,
  },
  'taichung': {
    id: 'taichung',
    name: '台中店',
    slug: 'taichung',
    city: '台中市',
    district: '西屯區',
    address: '台灣大道三段 567 號',
    phone: '04-2345-6789',
    googleMapUrl: 'https://maps.google.com/?q=台中市西屯區台灣大道三段567號',
    businessHours: {
      weekday: '10:00 - 22:00',
      weekend: '09:00 - 20:00',
    },
    transportation: '近台中高鐵站，搭乘接駁車約 15 分鐘',
    heroImage: '',
    galleryImages: [],
    sortOrder: 4,
    isActive: true,
  },
  'kaohsiung': {
    id: 'kaohsiung',
    name: '高雄店',
    slug: 'kaohsiung',
    city: '高雄市',
    district: '前鎮區',
    address: '中山二路 321 號',
    phone: '07-334-5678',
    googleMapUrl: 'https://maps.google.com/?q=高雄市前鎮區中山二路321號',
    businessHours: {
      weekday: '10:00 - 22:00',
      weekend: '09:00 - 20:00',
    },
    transportation: '捷運三多商圈站 2 號出口步行 5 分鐘',
    heroImage: '',
    galleryImages: [],
    sortOrder: 5,
    isActive: false,
  },
};

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
    weekend: string;
  };
  transportation: string;
  heroImage: string;
  galleryImages: string[];
  sortOrder: number;
  isActive: boolean;
}

const cityOptions = ['台北市', '新北市', '桃園市', '新竹市', '新竹縣', '台中市', '台南市', '高雄市'];

export default function StoreEditPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;
  const isNew = storeId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
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
      weekday: '10:00 - 22:00',
      weekend: '09:00 - 20:00',
    },
    transportation: '',
    heroImage: '',
    galleryImages: [],
    sortOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!isNew && storeId) {
      // 模擬 API 呼叫
      setTimeout(() => {
        const store = storesData[storeId];
        if (store) {
          setFormData(store);
        }
        setLoading(false);
      }, 300);
    }
  }, [storeId, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // TODO: API 呼叫儲存
    console.log('Saving store:', formData);

    // 模擬儲存
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    router.push('/admin/stores');
  };

  const generateSlug = (name: string) => {
    // 簡單的中文轉拼音邏輯（實際應使用 pinyin 套件）
    const mapping: Record<string, string> = {
      '台北': 'taipei',
      '新竹': 'hsinchu',
      '台中': 'taichung',
      '台南': 'tainan',
      '高雄': 'kaohsiung',
      '南京': 'nanjing',
      '民生': 'minsheng',
      '店': '',
    };

    let slug = name.toLowerCase();
    Object.entries(mapping).forEach(([zh, en]) => {
      slug = slug.replace(zh, en);
    });
    return slug.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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
        <h1 className="text-2xl font-bold font-sans">{isNew ? '新增門店' : '編輯門店'}</h1>
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
                }}
                className="input"
                placeholder="例如：台北南京店"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                網址代稱 (Slug) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="input"
                placeholder="taipei-nanjing"
                pattern="[a-z0-9-]+"
                required
              />
              <p className="text-xs text-gray-500 mt-1">僅限小寫英文、數字、連字號</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                縣市 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="input"
                required
              >
                <option value="">請選擇</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                區域 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="input"
                placeholder="例如：松山區"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              詳細地址 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input"
              placeholder="例如：南京東路四段 123 號 2 樓"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                電話 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                placeholder="02-2712-3456"
                required
              />
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
              <label className="block text-sm font-medium mb-1">平日（週一至週五）</label>
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
                placeholder="10:00 - 22:00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">假日（週六日）</label>
              <input
                type="text"
                value={formData.businessHours.weekend}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessHours: { ...formData.businessHours, weekend: e.target.value },
                  })
                }
                className="input"
                placeholder="09:00 - 20:00"
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

          <div>
            <label className="block text-sm font-medium mb-1">交通方式說明</label>
            <textarea
              value={formData.transportation}
              onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
              className="input"
              rows={2}
              placeholder="例如：捷運南京三民站 2 號出口步行 3 分鐘"
            />
          </div>
        </div>

        {/* Images */}
        <div className="card border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-lg font-sans border-b pb-2">門店照片</h2>

          <div>
            <label className="block text-sm font-medium mb-2">主圖</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              {formData.heroImage ? (
                <div className="relative">
                  <img
                    src={formData.heroImage}
                    alt="門店主圖"
                    className="max-h-48 mx-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, heroImage: '' })}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <button type="button" className="btn btn-secondary text-sm">
                    上傳主圖
                  </button>
                  <p className="text-xs text-gray-500 mt-2">建議尺寸 1200x800，JPG 或 PNG</p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">相簿照片</label>
            <div className="grid grid-cols-3 gap-4">
              {formData.galleryImages.map((img, index) => (
                <div key={index} className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                  <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        galleryImages: formData.galleryImages.filter((_, i) => i !== index),
                      })
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="aspect-video border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-500"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/stores" className="btn btn-ghost">
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
