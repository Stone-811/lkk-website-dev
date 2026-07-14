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
        │   ├─ /team-intro          → 團隊介紹          │
        │   ├─ /team-intro/coaches  → 全體教練          │
        │   ├─ /lkk-lecturer        → 練健康授權講師    │
        │   ├─ /co-lecturer         → 合作講師          │
        │   ├─ /oversea-lecturer    → 海外授權講師      │
        │   ├─ /franchise           → 加盟說明          │
        │   ├─ /lkk-academy         → 練健康學院        │
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
| `l-kk.tw/team-intro` | Next.js | 團隊介紹（經營團隊） |
| `l-kk.tw/team-intro/coaches` | Next.js | 全體教練 |
| `l-kk.tw/lkk-lecturer` | Next.js | 練健康授權講師 |
| `l-kk.tw/co-lecturer` | Next.js | 合作講師 |
| `l-kk.tw/oversea-lecturer` | Next.js | 海外授權講師 |
| `l-kk.tw/lkk-academy` | Next.js | 練健康學院（課程培訓） |
| `l-kk.tw/lkk4` | Next.js | LKK4 中高齡四項體能挑戰賽 |
| `l-kk.tw/personal-record` | Next.js | LKK4 參賽成績查詢 |
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

### 圖示設計原則

**不使用 Emoji，改用 SVG 圖示**

為確保跨平台一致性與專業視覺效果，所有頁面圖示皆使用 SVG 而非 Emoji。

| 類型 | 做法 |
|------|------|
| 單一圖示 | 直接使用 inline SVG |
| 多個相關圖示 | 建立 Icon 元件（如 `ServiceIcon`、`EventIcon`） |
| 共用圖示 | 放置於 `components/icons/` |

範例：
```tsx
// 建立 Icon 元件
function ServiceIcon({ type }: { type: string }) {
  const iconClass = "w-12 h-12 text-orange";
  switch (type) {
    case 'personal':
      return <svg className={iconClass} ...>...</svg>;
    case 'rehab':
      return <svg className={iconClass} ...>...</svg>;
    default:
      return null;
  }
}
```

### Logo 與 Favicon

| 項目 | 檔案位置 | 說明 |
|------|---------|------|
| Header Logo | `/public/lkklogo.png` | 響應式大小（h-8 / h-10 / h-12） |
| Favicon | `/public/lkklogo.png` | 瀏覽器分頁圖示 |
| PWA Icons | `/public/icons/` | 192x192、512x512 等尺寸 |

### 手機版固定按鈕

手機版底部有固定的「立即預約體驗」按鈕：

| 項目 | 說明 |
|------|------|
| 元件 | `components/layout/MobileBookingButton.tsx` |
| 顯示條件 | 僅手機版（`md:hidden`） |
| 隱藏頁面 | `/booking` 頁面自動隱藏 |
| 連結 | `/booking#form` |

---

## 專案結構

本專案採用 **Turborepo Monorepo** 架構：

```
lkk-website/                    # 根目錄（Monorepo）
├── package.json                # workspaces: ["apps/*"]
├── package-lock.json           # 統一管理所有依賴（唯一的 lock file）
├── turbo.json                  # Turborepo 設定
├── firebase.json               # Firebase 設定（含 apphosting 區塊）
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
│
├── apps/
│   └── web/                    # Next.js 應用
│       ├── package.json        # @lkk/web
│       ├── apphosting.yaml     # Firebase App Hosting 設定
│       ├── next.config.js      # output: 'standalone'
│       │
│       ├── app/
│       │   ├── [locale]/       # 多語系頁面
│       │   │   ├── page.tsx              # 首頁
│       │   │   ├── booking/page.tsx      # 預約體驗
│       │   │   ├── locations/page.tsx    # 門店總覽
│       │   │   ├── team-intro/           # 團隊介紹
│       │   │   │   ├── page.tsx          # 經營團隊
│       │   │   │   └── coaches/page.tsx  # 全體教練
│       │   │   ├── lkk-lecturer/page.tsx # 練健康授權講師
│       │   │   ├── co-lecturer/page.tsx  # 合作講師
│       │   │   ├── oversea-lecturer/page.tsx # 海外授權講師
│       │   │   ├── lkk-academy/page.tsx  # 練健康學院
│       │   │   ├── franchise/page.tsx    # 加盟說明
│       │   │   ├── lkk4/page.tsx         # LKK4 賽事
│       │   │   ├── personal-record/page.tsx # LKK4 參賽成績查詢
│       │   │   ├── cooperation/page.tsx  # 合作洽詢
│       │   │   └── shop/page.tsx         # 商品導購
│       │   │
│       │   ├── admin/          # CMS 後台
│       │   │   ├── login/page.tsx
│       │   │   ├── dashboard/page.tsx
│       │   │   ├── stores/page.tsx       # 門店管理（含照片）
│       │   │   ├── coaches/page.tsx      # 教練管理
│       │   │   ├── lecturers/page.tsx    # 講師管理（新增）
│       │   │   ├── faqs/page.tsx
│       │   │   ├── leads/page.tsx
│       │   │   └── settings/page.tsx
│       │   │
│       │   └── api/            # API Routes
│       │       ├── public/
│       │       └── admin/
│       │
│       ├── components/
│       ├── lib/
│       └── messages/
│
└── lkk-website/                # HTML Mockup 參考
```

### 重要：Monorepo 注意事項

1. **只在根目錄執行 `npm install`**，不要在 apps/web 執行
2. **只有根目錄有 `package-lock.json`**，子目錄不應該有
3. **使用 `turbo` 執行 build**：`npm run build` 會自動使用 turbo
4. **根目錄 package.json 必須有 `packageManager` 欄位**：Turbo 2.x 需要此欄位來解析 workspaces

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
  businessHours?: string | { weekday: string, saturday: string, sunday: string, holiday: string }
  transport?: {
    mrt: { station: string, desc: string }
    bus: { stop: string, desc: string }
    car: { desc: string }
    parking: { desc: string }
  }
  images?: {
    env1?: string  // 環境照片 1
    env2?: string  // 環境照片 2
    env3?: string  // 環境照片 3
    env4?: string  // 環境照片 4
    env5?: string  // 環境照片 5
  }
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

### lecturers

```typescript
{
  id: string
  name: string
  slug: string
  photo?: string
  title?: string              // 職稱 (e.g., 首席講師、資深講師)
  organization?: string       // 所屬機構
  region?: string             // 地區 (海外講師用)
  countries?: string[]        // 授權國家 (海外講師用)
  type: 'lkk' | 'partner' | 'overseas'  // 講師類型
  description?: string
  specialties: string[]       // 專長領域
  courses?: string[]          // 授課項目
  certifications?: string[]   // 專業認證
  sortOrder: number
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### team

```typescript
{
  id: string
  name: string
  slug: string
  photo?: string
  title?: string              // 職稱 (e.g., 創辦人、執行長)
  description?: string
  specialties: string[]       // 專長領域
  certifications?: string[]   // 專業認證
  sortOrder: number
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
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
  passwordHash: string  // bcrypt hashed password
  role: 'admin' | 'editor' | 'store_staff'
  storeId?: string
  isActive: boolean
  createdAt: Timestamp
}
```

**重要：密碼欄位**
- 欄位名稱必須是 `passwordHash`（不是 `password`）
- 使用 bcrypt 雜湊後的密碼
- 建立新使用者時，可在 Firestore Console 直接建立文件，並使用線上 bcrypt 工具產生 hash

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
GET    /api/admin/lecturers
POST   /api/admin/lecturers
PATCH  /api/admin/lecturers/:id
DELETE /api/admin/lecturers/:id
GET    /api/admin/leads
PATCH  /api/admin/leads/:id/status
PATCH  /api/admin/leads/:id/note
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
| 首頁 | `/` | Hero、數據條（DataStrip）、曾受報導（PressStrip）、服務內容、案例導流、FAQ、CTA、Footer |

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

| 類型 | 名稱 | 目標受眾 | 前端頁面 | API 路徑 |
|------|------|----------|----------|----------|
| `booking` | 預約體驗 | B2C（一般民眾） | `/booking` | `/api/leads/booking` |
| `franchise` | 加盟洽詢 | B2B（潛在加盟主） | `/franchise` | `/api/leads/franchise` |
| `cooperation` | 合作洽詢 | B2B（企業/機構） | `/cooperation` | `/api/leads/cooperation` |
| `recruitment` | 教練徵才 | B2C（求職者） | 待建立 | 待建立 |

#### 表單欄位說明

**booking（預約體驗）**
- name, phone, email, gender, age, goal
- storeId（門店）, preferredTime（偏好時段）
- source, message

**cooperation（合作洽詢）**
- cooperationType（講座邀約 / 企業健康促進邀請 / 媒體採訪與異業合作）
- organization（公司/單位名稱）
- name, phone, lineId, email
- companySize（規模人數，選填）
- budgetRange（預算區間，選填）
- message

**franchise（加盟洽詢）**
- name, organization, email, phone
- region（目標區域）, cooperationType（合作類型）
- message

**recruitment（教練徵才）**
- 待定義

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

## 郵件通知系統

### 架構概述

表單提交後會觸發兩種郵件通知：

1. **管理者通知信** - 通知相關管理者有新的表單提交
2. **客戶確認信** - 向填表者發送收到確認信

### 設定分離原則

| 設定層面 | 設定位置 | 說明 |
|---------|---------|------|
| **SMTP 設定**（如何寄信） | `.env.local` | 寄件帳號、密碼、SMTP 伺服器 |
| **收件人設定**（誰收到通知） | 後台系統設定 | 管理者信箱列表 |

**SMTP 環境變數（.env.local）**
```env
SMTP_HOST=smtp.gmail.com
SMTP_USER=tingo8320@gmail.com    # 寄件人信箱
SMTP_PASS=your-app-password      # Gmail App Password
```

**後台管理者信箱設定**
- 位置：`/admin/settings`（系統設定 → 通知設定）
- 用途：設定需要收到表單通知的管理者信箱
- 可設定多個信箱（逗號分隔）

### 支援的表單類型

| 表單類型 | API 路徑 | 管理者通知 | 客戶確認 |
|---------|---------|-----------|---------|
| `booking` | `/api/leads/booking` | ✅ | ✅ |
| `cooperation` | `/api/leads/cooperation` | ✅ | ✅ |
| `franchise` | `/api/leads/franchise` | ✅ | ✅ |

### 郵件模組架構

郵件功能集中於 `apps/web/lib/email.ts`：

```typescript
// 核心函式
sendLeadNotification(lead)           // 管理者通知信
sendFormConfirmation(type, data)     // 客戶確認信（模組化）

// 便利包裝函式
sendBookingConfirmation(data)        // 預約體驗確認信
sendCooperationConfirmation(data)    // 合作洽詢確認信
sendFranchiseConfirmation(data)      // 加盟洽詢確認信
```

### 郵件流程

```
使用者提交表單
    ↓
API Route 驗證資料
    ↓
寫入 Firestore leads collection
    ↓
sendLeadNotification() → 寄給後台設定的管理者信箱
    ↓
sendXxxConfirmation() → 寄給填表者信箱
    ↓
回傳成功回應
```

### 新增表單類型

若需新增表單類型，需：

1. 在 `email.ts` 的 `formTypeConfigs` 新增設定：
```typescript
formTypeConfigs['new_type'] = {
  subject: '主旨',
  title: '標題',
  description: '描述',
  ctaText: 'CTA 文字',
  ctaUrl: '連結',
};
```

2. 新增便利包裝函式：
```typescript
export async function sendNewTypeConfirmation(data: { name: string; email: string }) {
  return sendFormConfirmation('new_type', data);
}
```

3. 在對應的 API Route 呼叫通知函式

---

## 分析追蹤

### 追蹤未登入使用者

本站使用以下方式追蹤訪客行為（不需登入）：

| 工具 | 用途 | 優先級 |
|------|------|--------|
| Google Analytics 4 (GA4) | 基礎流量分析、轉換追蹤 | 必要 |
| Google Tag Manager (GTM) | 統一管理追蹤碼 | 建議 |
| Facebook Pixel | 廣告受眾、轉換追蹤 | 視廣告需求 |
| LINE Tag | LINE 廣告追蹤 | 視廣告需求 |

### GA4 建議追蹤事件

| 事件名稱 | 觸發時機 | 參數 |
|----------|----------|------|
| `page_view` | 頁面載入 | `page_title`, `page_location` |
| `form_start` | 開始填寫表單 | `form_type` |
| `form_submit` | 表單送出成功 | `form_type`, `store_id` |
| `click_cta` | 點擊 CTA 按鈕 | `button_text`, `destination` |
| `click_phone` | 點擊電話連結 | `store_name` |
| `view_store` | 檢視門店詳情 | `store_name`, `store_id` |
| `view_coach` | 檢視教練頁面 | `coach_name` |

### 實作方式

建議使用 GTM 搭配 `next/script` 載入追蹤碼：

```tsx
// app/layout.tsx
import Script from 'next/script';

// GTM
<Script id="gtm" strategy="afterInteractive">
  {`(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXXX');`}
</Script>

// GA4 (若不用 GTM)
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"
  strategy="afterInteractive"
/>
```

### 轉換追蹤

重要轉換點：

1. **預約表單送出** - 主要轉換目標
2. **加盟表單送出** - 商業開發轉換
3. **合作洽詢送出** - B2B 轉換
4. **門店電話點擊** - 微轉換

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

### 本地開發（.env.local）

```env
NEXT_PUBLIC_SITE_URL=https://l-kk.tw
WORDPRESS_BACKEND_URL=https://wp-backend.l-kk.tw
WORDPRESS_API_URL=https://wp-backend.l-kk.tw/wp-json/wp/v2
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_PRIVATE_KEY=xxx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=xxx@gmail.com
SMTP_PASS=xxx              # Gmail App Password
SMTP_FROM=xxx@gmail.com
RECAPTCHA_SECRET=xxx
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=xxx
```

### Firebase App Hosting（apphosting.yaml）

生產環境的環境變數設定在 `apps/web/apphosting.yaml`：

```yaml
env:
  - variable: NEXT_PUBLIC_SITE_URL
    value: https://lkk-website-dev.web.app
  - variable: FIREBASE_PROJECT_ID
    value: lkk-website-dev
  - variable: SMTP_HOST
    value: smtp.gmail.com
  - variable: SMTP_PORT
    value: "465"
  - variable: SMTP_USER
    value: xxx@gmail.com
  - variable: SMTP_FROM
    value: xxx@gmail.com
  # 機密資料使用 Firebase Secret
  - variable: SMTP_PASS
    secret: smtp-pass
```

**設定 Firebase Secret：**
```bash
# 建立 SMTP 密碼 secret
firebase apphosting:secrets:set smtp-pass --project lkk-website-dev
```

---

## 開發指令

```bash
# 安裝依賴（在根目錄執行）
npm install

# 本地開發（使用 Turbo）
npm run dev

# Firebase Emulator
npx firebase-tools emulators:start

# 建置（使用 Turbo）
npm run build

# 手動觸發部署
npx firebase-tools apphosting:rollouts:create lkk-web --project lkk-website-dev

# 查看部署狀態
npx firebase-tools apphosting:backends:list --project lkk-website-dev

# 部署 Firestore 索引（首次或更新時必須執行）
npx firebase-tools deploy --only firestore:indexes --project lkk-website-dev

# 部署 Firestore 規則
npx firebase-tools deploy --only firestore:rules --project lkk-website-dev

# 預覽 HTML mockup
cd lkk-website && python3 -m http.server 8080
```

### 部署流程

Firebase App Hosting 會自動監聽 GitHub push，自動部署：

1. Push 到 `main` branch
2. Firebase 自動觸發 Cloud Build
3. 使用 Turborepo buildpack 建置
4. 部署到 Cloud Run（由 Firebase 管理）

---

## 部署方式

### Firebase App Hosting

使用 Firebase App Hosting 部署 Turborepo Monorepo。

**Backend 設定**：
- Backend ID: `lkk-web`
- Region: `asia-east1`
- Root Directory: `apps/web`
- GitHub Repo: `Stone-811/lkk-website-dev`
- Branch: `main`

**關鍵設定檔**：

```yaml
# apps/web/apphosting.yaml
runConfig:
  minInstances: 0
  maxInstances: 10
  concurrency: 80
  cpu: 1
  memoryMiB: 512

env:
  - variable: NEXT_PUBLIC_SITE_URL
    value: https://lkk-website-dev.web.app
  - variable: FIREBASE_PROJECT_ID
    value: lkk-website-dev
```

```json
// firebase.json
{
  "apphosting": [
    {
      "backendId": "web",
      "rootDir": "./apps/web"
    }
  ]
}
```

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

**Next.js 設定**：
- `output: 'standalone'`（必須）
- WordPress Rewrites 設定

單一 Next.js 應用，負責：
- 前台頁面（SSR）
- WordPress 路徑代理（Rewrites）
- `/admin/*` CMS 後台
- `/api/*` API Routes

### Firestore

- CMS 資料
- 表單名單
- 管理員帳號

**重要：Firestore 索引部署**

查詢需要複合索引，必須執行：
```bash
npx firebase-tools deploy --only firestore:indexes --project lkk-website-dev
```

### Firebase Admin SDK

使用 Application Default Credentials (ADC) 連接 Firestore，在 Firebase App Hosting 環境自動運作。

關鍵設定（`apps/web/lib/firebase.ts`）：
- 優先使用明確的 service account 憑證（若有設定）
- 否則使用 `applicationDefault()` 自動取得 ADC
- 需要設定 `FIREBASE_PROJECT_ID` 環境變數

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
