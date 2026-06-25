# 練健康官網 - LKK Website

> **現有網站**：https://l-kk.tw/（WordPress @ Cloudways）
> **目標**：統一使用 `l-kk.tw`，新頁面用 Next.js，文章透過代理保留 WordPress

---

## 架構總覽

```
                    所有請求進入 l-kk.tw
                            │
                            ▼
              ┌─────────────────────────────┐
              │   Firebase App Hosting      │
              │   (Next.js)                 │
              └──────────────┬──────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
   Next.js 處理        Next.js 代理         Firestore
   ┌───────────┐      ┌───────────┐      ┌───────────┐
   │ • 首頁    │      │ • /知識分享│      │ • stores  │
   │ • /booking│      │ • /案例分享│      │ • coaches │
   │ • /admin  │      │ • /wp-admin│      │ • leads   │
   │ • /api    │      │     ↓     │      │ • faqs    │
   └───────────┘      │ WordPress │      └───────────┘
                      │ (內部)    │
                      └───────────┘
```

**特點**：
- 對外只有 `l-kk.tw` 一個網域
- WordPress 文章網址不變（`l-kk.tw/知識分享/...`）
- SEO 零影響，不需要 301 redirect

---

## 技術棧

| 項目 | 技術 |
|------|------|
| 前端 | Next.js 14 (App Router) + Tailwind CSS |
| 部署 | Firebase App Hosting |
| WordPress 代理 | Next.js Rewrites |
| 資料庫 | Firestore |
| 儲存 | Firebase Storage |
| 驗證 | Firebase Auth |
| 多語言 | next-intl |

---

## 快速開始

### 環境需求

- Node.js 18+
- npm 9+
- Firebase CLI

### 安裝

```bash
# 安裝依賴
npm install

# 安裝 Firebase CLI（如未安裝）
npm install -g firebase-tools

# 登入 Firebase
firebase login
```

### 本地開發

```bash
# 啟動開發伺服器
npm run dev

# 啟動 Firebase Emulator（Firestore、Auth、Storage）
firebase emulators:start
```

開啟 http://localhost:3000

### 建置與部署

```bash
# 建置
npm run build

# 部署至 Firebase
firebase deploy
```

---

## 專案結構

```
lkk-website/
├── apps/web/                    # Next.js 應用
│   ├── app/
│   │   ├── [locale]/            # 前台頁面（多語言）
│   │   │   ├── page.tsx         # 首頁
│   │   │   ├── booking/         # 預約體驗
│   │   │   ├── locations/       # 門店
│   │   │   ├── franchise/       # 加盟
│   │   │   ├── lkk4/            # LKK4 賽事
│   │   │   ├── cooperation/     # 合作洽詢
│   │   │   └── shop/            # 商品導購
│   │   │
│   │   ├── admin/               # CMS 後台
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── stores/
│   │   │   ├── coaches/
│   │   │   └── leads/
│   │   │
│   │   └── api/                 # API Routes
│   │       ├── public/
│   │       └── admin/
│   │
│   ├── components/
│   ├── lib/
│   │   ├── firebase.ts          # Firebase Admin SDK
│   │   └── auth.ts
│   │
│   ├── next.config.js           # 含 WordPress rewrites 設定
│   └── messages/
│       ├── zh-TW.json
│       └── en.json
│
├── lkk-website/                 # HTML Mockup 參考
│   ├── index.html
│   ├── booking.html
│   └── ...
│
├── firebase.json                # Firebase 設定
├── apphosting.yaml              # App Hosting 設定
├── CLAUDE.md                    # 完整專案規格
└── docs/
```

---

## 網址路由

### Next.js 處理

| 路徑 | 說明 | Mockup |
|------|------|--------|
| `/` | 首頁 | index.html |
| `/booking` | 預約體驗 | booking.html |
| `/locations` | 門店總覽 | locations.html |
| `/franchise` | 加盟說明 | franchise.html |
| `/lkk4` | LKK4 賽事 | lkk4.html |
| `/cooperation` | 合作洽詢 | cooperation.html |
| `/shop` | 商品導購 | shop.html |
| `/en` | 英文版 | en.html |
| `/admin/*` | CMS 後台 | - |
| `/api/*` | API Routes | - |

### WordPress 代理（透過 Next.js Rewrites）

| 路徑 | 說明 |
|------|------|
| `/知識分享/*` | WordPress 文章 |
| `/案例分享/*` | WordPress 文章 |
| `/新聞報導/*` | WordPress 文章 |
| `/活動資訊/*` | WordPress 文章 |
| `/wp-admin/*` | WordPress 後台 |
| `/wp-content/*` | WordPress 媒體 |

---

## DNS 設定

| 網域 | 類型 | 指向 | 用途 |
|------|------|------|------|
| `l-kk.tw` | A | Firebase IP | 主站（公開） |
| `wp-backend.l-kk.tw` | A | Cloudways IP | WordPress（內部） |

> `wp-backend.l-kk.tw` 僅供 Next.js 內部代理，不對外公開。

---

## 設計樣式

網站視覺以 `lkk-website/` 目錄的 HTML mockup 為準：

| 色彩 | 色碼 | 用途 |
|------|------|------|
| Navy | #2A5269 | Header、Footer、標題 |
| Orange | #FB720A | CTA 按鈕、強調色 |
| Cream | #F5EFE4 | 背景色 |
| Ink | #1a1a1a | 內文字 |

**預覽 mockup**：
```bash
cd lkk-website && python3 -m http.server 8080
```

---

## 環境變數

建立 `.env.local`：

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
WORDPRESS_BACKEND_URL=https://wp-backend.l-kk.tw
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET=your-secret-key
```

---

## 成本估算

| 項目 | 月費 |
|------|------|
| Firebase App Hosting | $0-5 |
| Firestore | $0-3 |
| Firebase Storage | $0-1 |
| Cloudways（WordPress） | $30-50 |
| **總計** | **$30-60** |

相較 GCP Load Balancer 方案省約 $20/月。

---

## 相關文件

- [CLAUDE.md](./CLAUDE.md) - 完整專案規格與架構說明
- [lkk-website/](./lkk-website/) - HTML Mockup 設計稿

---

## 注意事項

1. **統一網域 `l-kk.tw`**：不使用子網域分流
2. **WordPress 透過 Next.js Rewrites 代理**：對外 URL 不變
3. **`wp-backend.l-kk.tw` 僅供內部使用**：建議設定防火牆
4. **Admin 使用 `/admin/*` 路徑**：不是獨立子網域
5. **表單資料進自建 Lead 系統（Firestore）**
6. **本版本不使用 GCP Load Balancer / Cloud SQL**

---

## 授權

Private - 練健康版權所有
