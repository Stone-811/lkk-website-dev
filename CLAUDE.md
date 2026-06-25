# 練健康官網架構分離專案 - Firebase 低維運成本版

## 專案定位

本專案採用「Next.js + Firebase + WordPress 內部代理」的低維運成本架構。

目標是用較低維運成本完成階段性網站改版，並讓業主可透過後台自行管理新官網頁面的照片、文案、CTA、連結、門店、教練與表單名單。

**核心特點：統一網域 `l-kk.tw`**
- 新官網頁面由 Next.js 處理
- WordPress 文章透過 Next.js rewrites 代理，對外網址不變
- 使用者與搜尋引擎只看到 `l-kk.tw`，SEO 零影響

本版本不使用：

- Strapi
- GCP External HTTPS Load Balancer
- Cloudflare Workers 路徑分流
- GCP Secret Manager
- Cloud SQL PostgreSQL
- 多個 Cloud Run 服務拆分
- 子網域分流（如 `wp.l-kk.tw` 對外）

本版本使用：

- Firebase App Hosting
- Next.js 14 App Router
- Next.js Rewrites（代理 WordPress）
- Firestore
- Firebase Storage
- Firebase Auth
- Next.js Route Handlers
- Firebase 環境變數
- WordPress 保留文章與舊內容（內部存取）

---

## 系統架構圖

```
使用者 / Google Bot / 瀏覽器
    │
    ▼
GoDaddy DNS
    │
    └─ l-kk.tw ─────────────────────────────────────────┐
                                                         │
        Firebase App Hosting（Next.js 應用）             │
        │                                                │
        ├─ Next.js 自行處理                              │
        │   ├─ /                    → 首頁              │
        │   ├─ /booking             → 預約體驗          │
        │   ├─ /locations           → 門店總覽          │
        │   ├─ /franchise           → 加盟說明          │
        │   ├─ /lkk4                → LKK4 賽事         │
        │   ├─ /cooperation         → 合作洽詢          │
        │   ├─ /shop                → 商品導購          │
        │   ├─ /en                  → 英文版            │
        │   ├─ /admin/*             → 自建 CMS 後台     │
        │   └─ /api/*               → API Routes        │
        │                                                │
        └─ Next.js Rewrites 代理到 WordPress            │
            ├─ /知識分享/*          → WordPress         │
            ├─ /案例分享/*          → WordPress         │
            ├─ /新聞報導/*          → WordPress         │
            ├─ /活動資訊/*          → WordPress         │
            ├─ /wp-admin/*          → WordPress         │
            ├─ /wp-content/*        → WordPress         │
            └─ /wp-json/*           → WordPress         │
                    │                                    │
                    ▼                                    │
            wp-backend.l-kk.tw（內部）                   │
            WordPress / Cloudways                        │
                                                         │
        ─────────────────────────────────────────────────┘
        │
        └─ Firebase 資料層 ──────────────────────────────┐
            ├─ Firestore          → CMS 資料 / 表單名單  │
            ├─ Firebase Storage   → 圖片 / 附件          │
            ├─ Firebase Auth      → 後台登入             │
            └─ 環境變數           → 機密設定             │
            ─────────────────────────────────────────────┘
```

---

## 網址規劃

| 網址 / 路徑 | 處理方式 | 說明 |
|---|---|---|
| `l-kk.tw` | Next.js | 新官網主站 |
| `l-kk.tw/booking` | Next.js | 預約體驗 |
| `l-kk.tw/locations` | Next.js | 門店總覽 |
| `l-kk.tw/admin/*` | Next.js | 自建 CMS 後台 |
| `l-kk.tw/api/*` | Next.js | API Routes |
| `l-kk.tw/知識分享/*` | Next.js → WordPress | 代理到 WordPress |
| `l-kk.tw/案例分享/*` | Next.js → WordPress | 代理到 WordPress |
| `l-kk.tw/wp-admin/*` | Next.js → WordPress | 代理到 WordPress |
| `wp-backend.l-kk.tw` | WordPress | 內部用，不對外公開 |

---

## DNS 設定

| 網域 | 類型 | 指向 | 用途 |
|------|------|------|------|
| `l-kk.tw` | A | Firebase App Hosting IP | 主站（公開） |
| `www.l-kk.tw` | CNAME | `l-kk.tw` | WWW 導向 |
| `wp-backend.l-kk.tw` | A | Cloudways IP | WordPress（內部） |

> `wp-backend.l-kk.tw` 僅供 Next.js 內部代理使用，可設定防火牆限制存取。

---

## Next.js Rewrites 設定

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      // WordPress 文章路徑
      {
        source: '/知識分享/:path*',
        destination: 'https://wp-backend.l-kk.tw/知識分享/:path*',
      },
      {
        source: '/案例分享/:path*',
        destination: 'https://wp-backend.l-kk.tw/案例分享/:path*',
      },
      {
        source: '/新聞報導/:path*',
        destination: 'https://wp-backend.l-kk.tw/新聞報導/:path*',
      },
      {
        source: '/活動資訊/:path*',
        destination: 'https://wp-backend.l-kk.tw/活動資訊/:path*',
      },
      // WordPress 系統路徑
      {
        source: '/wp-admin/:path*',
        destination: 'https://wp-backend.l-kk.tw/wp-admin/:path*',
      },
      {
        source: '/wp-content/:path*',
        destination: 'https://wp-backend.l-kk.tw/wp-content/:path*',
      },
      {
        source: '/wp-json/:path*',
        destination: 'https://wp-backend.l-kk.tw/wp-json/:path*',
      },
      {
        source: '/wp-includes/:path*',
        destination: 'https://wp-backend.l-kk.tw/wp-includes/:path*',
      },
    ];
  },
};
```

---

## WordPress 設定

WordPress 需調整網址設定：

```
WordPress Address (URL): https://wp-backend.l-kk.tw
Site Address (URL):      https://l-kk.tw
```

這樣 WordPress 產生的連結都會是 `l-kk.tw/知識分享/...`，對外網址統一。

---

## 技術選型

| 項目 | 技術 |
|------|------|
| 前台 | Next.js 14 App Router + Tailwind CSS |
| 部署 | Firebase App Hosting |
| WordPress 代理 | Next.js Rewrites |
| CMS 後台 | Next.js `/admin/*` |
| API | Next.js Route Handlers |
| 資料庫 | Firestore |
| 圖片 / 附件 | Firebase Storage |
| 後台登入 | Firebase Auth |
| 多語言 | next-intl |
| 表單防護 | reCAPTCHA / Turnstile |
| 機密設定 | Firebase 環境變數 |
| 文章系統 | WordPress / Cloudways（內部代理） |
| DNS | GoDaddy / CyberDNS |

---

## 設計樣式

網站視覺以 `lkk-website/` 目錄的 HTML mockup 為準。

### 色彩系統

| 名稱 | 色碼 | 用途 |
|------|------|------|
| Navy | #2A5269 | Header、Footer、標題、深色區塊 |
| Navy Dark | #1a3545 | Hover 狀態 |
| Orange | #FB720A | CTA 按鈕、強調色、連結 |
| Orange Light | #fc8c35 | Hover 狀態 |
| Cream | #F5EFE4 | 頁面背景色 |
| Cream Dark | #e8dfd0 | 區塊背景 |
| Ink | #1a1a1a | 內文字 |

### 字型

| 字型 | 用途 |
|------|------|
| Noto Serif TC | 標題（h1-h6） |
| Noto Sans TC | 內文 |

---

## 專案結構

```
lkk-website/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx              # 首頁
│   │   ├── booking/page.tsx      # 預約體驗
│   │   ├── locations/page.tsx    # 門店總覽
│   │   ├── franchise/page.tsx    # 加盟說明
│   │   ├── lkk4/page.tsx         # LKK4 賽事
│   │   ├── cooperation/page.tsx  # 合作洽詢
│   │   └── shop/page.tsx         # 商品導購
│   │
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── home/page.tsx         # 首頁內容管理
│   │   ├── stores/page.tsx       # 門店管理
│   │   ├── coaches/page.tsx      # 教練管理
│   │   ├── links/page.tsx        # 連結管理
│   │   ├── leads/page.tsx        # 表單名單
│   │   └── settings/page.tsx
│   │
│   └── api/
│       ├── public/
│       │   ├── home/route.ts
│       │   ├── stores/route.ts
│       │   ├── coaches/route.ts
│       │   └── leads/booking/route.ts
│       │
│       └── admin/
│           ├── home/route.ts
│           ├── stores/route.ts
│           ├── coaches/route.ts
│           ├── leads/route.ts
│           └── auth/route.ts
│
├── components/
│   ├── layout/
│   ├── ui/
│   ├── sections/
│   └── admin/
│
├── lib/
│   ├── firebase.ts        # Firebase Admin SDK
│   ├── firebase-client.ts # Firebase Client SDK
│   ├── auth.ts            # Firebase Auth 整合
│   ├── storage.ts         # Firebase Storage
│   ├── mail.ts
│   └── wordpress.ts
│
├── messages/
│   ├── zh-TW.json
│   └── en.json
│
├── lkk-website/           # HTML Mockup 參考
│   ├── index.html
│   ├── booking.html
│   ├── locations.html
│   ├── franchise.html
│   ├── lkk4.html
│   ├── cooperation.html
│   ├── shop.html
│   └── en.html
│
├── next.config.js         # 含 WordPress rewrites 設定
├── firebase.json          # Firebase 設定
├── apphosting.yaml        # App Hosting 設定
└── docs/
```

---

## Firestore Collections

### stores

```typescript
{
  id: string
  name: string
  slug: string
  phone?: string
  address?: string
  city?: string
  district?: string
  googleMapUrl?: string
  businessHours?: string
  transportation?: string
  images: string[]
  sortOrder: number
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### coaches

```typescript
{
  id: string
  name: string
  slug: string
  photo?: string
  roleTitle?: string
  storeId?: string
  specialties: string[]
  certifications: string[]
  experiences: string[]
  education: string[]
  description?: string
  sortOrder: number
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### leads

```typescript
{
  id: string
  type: 'booking' | 'franchise' | 'cooperation'
  name: string
  phone: string
  email?: string
  storeId?: string
  sourcePage: string
  sourceChannel?: string
  message?: string
  payload: Record<string, unknown>
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
  internalNote?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### faqs

```typescript
{
  id: string
  question: string
  answer: string
  category?: string
  sortOrder: number
  isActive: boolean
}
```

### homePage

```typescript
{
  hero: {
    title: string
    subtitle: string
    image: string
    cta: { text: string, url: string }
  }
  sections: Array<{
    type: string
    title: string
    content: any
    sortOrder: number
    isActive: boolean
  }>
}
```

### users

```typescript
{
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'store_staff'
  storeId?: string
  isActive: boolean
  createdAt: Timestamp
}
```

---

## API 設計

### Public API

```
GET  /api/public/home
GET  /api/public/stores
GET  /api/public/stores/:slug
GET  /api/public/coaches
GET  /api/public/coaches?store=slug
GET  /api/public/faqs
POST /api/public/leads/booking
POST /api/public/leads/franchise
POST /api/public/leads/cooperation
```

### Admin API

```
POST   /api/admin/auth/login
POST   /api/admin/auth/logout
GET    /api/admin/stores
POST   /api/admin/stores
PATCH  /api/admin/stores/:id
DELETE /api/admin/stores/:id
GET    /api/admin/coaches
POST   /api/admin/coaches
PATCH  /api/admin/coaches/:id
DELETE /api/admin/coaches/:id
GET    /api/admin/leads
PATCH  /api/admin/leads/:id/status
PATCH  /api/admin/leads/:id/note
GET    /api/admin/leads/export
```

---

## 頁面開發清單

### Phase 1：最高優先（預估 30 天）

| 頁面 | 路徑 | 內容 |
|------|------|------|
| 預約體驗 | `/booking` | 預約表單、門店選擇、FAQ、門店通知 |
| 門店 | `/locations` | 門店總覽、門店資訊、交通、照片、教練連結 |
| 首頁 | `/` | Hero、服務內容、案例導流、FAQ、CTA、Footer |

### Phase 2：次高優先（預估 30 天）

| 頁面 | 路徑 | 內容 |
|------|------|------|
| 加盟 | `/franchise` | 加盟說明、CTA、加盟表單 |
| LKK4 | `/lkk4` | 賽事動態故事、服務、合作導流 |
| 合作洽詢 | `/cooperation` | 講座、採訪、合作洽詢表單 |

### Phase 3：風格一致性（預估 60 天）

| 頁面 / 範圍 | 路徑 | 內容 |
|-------------|------|------|
| 英文 | `/en` | 英文主頁、加盟 / 合夥機會導引 |
| 商品導購 | `/shop` | 導購頁（連至外部電商或保留展示） |
| 其他舊頁 | 視盤點結果 | 調整 Header / Footer / 風格樣式 |

---

## 表單系統

### 表單類型

- `booking`：預約體驗
- `franchise`：加盟洽詢
- `cooperation`：合作洽詢

### 表單流程

```
使用者填寫表單
    ↓
reCAPTCHA / Turnstile 驗證
    ↓
API Route 接收資料
    ↓
寫入 Firestore leads collection
    ↓
寄發管理者通知信
    ↓
（可選）寄發使用者確認信
    ↓
CMS 後台查詢與處理名單
```

### Lead 狀態

| 狀態 | 說明 |
|------|------|
| new | 新名單 |
| contacted | 已聯繫 |
| scheduled | 已預約 |
| completed | 已完成 |
| cancelled | 已取消 |

---

## WordPress 整合

### WordPress 保留（透過代理存取）

- 現有 900+ 篇文章
- 知識分享
- 案例分享
- 新聞報導
- 活動資訊
- 練健康學院 / 課程報名外連
- 舊教練介紹外連
- WordPress Media Library
- WordPress SEO 設定
- WordPress 後台（/wp-admin）

### WordPress 不再負責

- 新官網首頁
- 預約體驗頁
- 門店頁
- 加盟頁
- LKK4 頁
- 合作洽詢頁
- 新版 CMS 後台
- 新版表單名單管理

### SEO 優勢

| 項目 | 說明 |
|------|------|
| URL 不變 | 文章網址還是 `l-kk.tw/知識分享/...` |
| 無 redirect | 不需要 301，SEO 零影響 |
| 統一網域 | 對 Google 來說都是同一個網站 |

---

## 環境變數

低維運成本不使用 GCP Secret Manager，改以 Firebase 環境變數管理。

```env
NEXT_PUBLIC_SITE_URL=https://l-kk.tw
WORDPRESS_BACKEND_URL=https://wp-backend.l-kk.tw
WORDPRESS_API_URL=https://wp-backend.l-kk.tw/wp-json/wp/v2
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_PRIVATE_KEY=xxx
SMTP_HOST=xxx
SMTP_USER=xxx
SMTP_PASS=xxx
RECAPTCHA_SECRET=xxx
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=xxx
```

---

## 開發指令

```bash
# 安裝依賴
npm install

# 本地開發（使用 Firebase Emulator）
npm run dev

# Firebase Emulator
firebase emulators:start

# 建置
npm run build

# 部署至 Firebase
firebase deploy

# 預覽 HTML mockup
cd lkk-website && python3 -m http.server 8080
```

---

## 部署方式

### Firebase App Hosting

單一 Next.js 應用，負責：
- 前台頁面（SSR）
- WordPress 路徑代理（Rewrites）
- `/admin/*` CMS 後台
- `/api/*` API Routes

### Firestore

- CMS 資料
- 表單名單
- 管理員帳號

### Firebase Storage

- Banner 圖片
- 教練照片
- 門店照片
- 表單附件

### WordPress (Cloudways)

- 內部網址：`wp-backend.l-kk.tw`
- 對外網址：透過 Next.js 代理為 `l-kk.tw/*`
- 建議設定防火牆，僅允許 Firebase IP 存取

---

## 成本估算

| 服務 | 預估月費 |
|------|----------|
| Firebase App Hosting | $0-5（低流量免費） |
| Firestore | $0-3（免費額度內） |
| Firebase Storage | $0-1 |
| Cloudways WordPress | $30-50（現有） |
| **總計** | **$30-60/月** |

相較 Load Balancer 方案省約 $20/月。

---

## 開發階段

### Phase 1：核心 MVP

- [ ] Firebase 專案設定
- [ ] Firestore collections 建立
- [ ] Firebase Auth 後台登入
- [ ] `/admin/*` CMS 後台改用 Firestore
- [ ] `/api/*` API 改用 Firestore
- [ ] 前台頁面串接 Firestore
- [ ] 表單提交寫入 Firestore
- [ ] Firebase Storage 圖片上傳
- [ ] Next.js Rewrites 代理 WordPress
- [ ] 部署至 Firebase App Hosting

### Phase 2：功能強化

- [ ] 分店權限
- [ ] 操作紀錄
- [ ] 多語內容管理
- [ ] 表單進階後台強化
- [ ] CRM 串接
- [ ] 報表統計

### Phase 3：架構升級（若需要）

- [ ] 進階監控與告警
- [ ] CDN 快取優化
- [ ] WordPress 效能調校

---

## 驗收標準

### 前台

- [ ] RWD 正常（桌機、平板、手機）
- [ ] 首頁、預約、門店、加盟、合作、LKK4、商品導購頁正常
- [ ] CTA 連結正確
- [ ] 多語切換正常

### WordPress 代理

- [ ] `l-kk.tw/知識分享/*` 可正常顯示文章
- [ ] `l-kk.tw/wp-admin/*` 可正常登入 WordPress
- [ ] 文章內圖片正常顯示
- [ ] WordPress 內部連結正確（顯示為 `l-kk.tw`）

### CMS

- [ ] `/admin/*` 可登入（Firebase Auth）
- [ ] 可管理首頁內容、門店、教練、FAQ、CTA
- [ ] 可查詢表單名單
- [ ] 可更新名單狀態與備註
- [ ] 可匯出 CSV

### API

- [ ] `/api/public/*` 正常回應
- [ ] `/api/admin/*` 需登入權限
- [ ] 表單遞交需驗證碼、進後台與通知信

### 安全

- [ ] Admin 路由需驗證
- [ ] API 需權限檢查
- [ ] 表單需防呆驗證碼
- [ ] 上傳檔案需檢查 MIME type
- [ ] 不得在前端暴露秘密環境變數
- [ ] WordPress 後台僅限內部存取

---

## 注意事項

1. **不使用 Strapi / WordPress ACF 作為主要 CMS**
2. **WordPress 透過 Next.js Rewrites 代理，對外統一使用 `l-kk.tw`**
3. **`wp-backend.l-kk.tw` 僅供內部使用，建議設定防火牆**
4. **Admin 使用 `/admin/*` 路徑，不是獨立子網域**
5. **表單資料必須進自建 Lead 系統**
6. **前台版型由 Next.js 控制，後台只開放內容調整**
7. **第一階段不做完整 CRM、電商、課程付款系統**
8. **本版本不使用 Load Balancer / Cloudflare Workers / Secret Manager / Cloud SQL**
9. **機密設定統一由 Firebase 環境變數管理**
10. **WordPress 需設定 Site Address 為 `https://l-kk.tw` 以確保連結正確**
