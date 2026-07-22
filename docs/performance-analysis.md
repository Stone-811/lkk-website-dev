# 前端頁面載入效能分析

## 問題頁面
- `/team-intro/coaches` (全體教練)
- `/locations` (門店資訊)

---

## 載入較久的原因分析

### 1. Firebase 初始化延遲（冷啟動）

第一次請求時的執行流程：
```
1. 動態 import firebase-admin 模組
2. 初始化 Firebase App
3. 連接 Firestore
4. 執行實際查詢
```

**影響時間**：1-3 秒

**程式碼位置**：`apps/newweb/server/utils/firebase.ts`

```typescript
// 延遲載入模式
async function getFirebaseAdminModule() {
  if (!_firebaseAdmin) {
    _firebaseAdmin = {
      app: await import('firebase-admin/app'),
      firestore: await import('firebase-admin/firestore'),
      // ...
    };
  }
  return _firebaseAdmin;
}
```

---

### 2. API 端點查詢時間

**coaches.get.ts 執行流程**：
```
1. 連接 Firestore (getDb())
2. 查詢 coaches collection (where isActive == true)
3. 批次查詢 stores collection (取得門店名稱)
4. 組合資料並回傳
```

即使已優化為批次查詢，仍需 2-3 次 Firestore 往返。

**程式碼位置**：`apps/newweb/server/api/public/coaches.get.ts`

---

### 3. Firebase App Hosting 冷啟動

**現行設定**（`apps/newweb/apphosting.yaml`）：
```yaml
runConfig:
  minInstances: 0  # 無流量時關閉實例
  maxInstances: 10
```

**問題**：
- `minInstances: 0` 代表無流量時會關閉實例
- 第一個請求需要啟動容器
- 冷啟動時間：2-5 秒

---

### 4. SSR 執行位置

即使使用 `useLazyFetch`，API 仍在伺服器端執行：
- 伺服器位於 `asia-east1`
- 到 Firestore 有網路延遲
- SSR 水合過程也需要時間

---

## 可能的優化方案

| 方案 | 效果 | 成本/複雜度 | 優先級 |
|-----|------|-----------|-------|
| 設定 `minInstances: 1` | 避免冷啟動 | 月費增加 ~$10-20 | 高 |
| 使用 Firestore 快取 | 減少重複查詢 | 需實作快取邏輯 | 中 |
| 靜態生成 (SSG) | 最快，無 API 延遲 | 資料更新需重新部署 | 低 |
| 使用 fallback 資料優先顯示 | 體感更快 | 資料可能不同步 | 中 |
| 移除 stores 關聯查詢 | 減少一次 DB 查詢 | 需調整資料結構 | 低 |

---

## 方案詳細說明

### 方案 A：設定 minInstances: 1

**修改檔案**：`apps/newweb/apphosting.yaml`

```yaml
runConfig:
  minInstances: 1  # 保持至少一個實例運行
  maxInstances: 10
```

**優點**：
- 消除冷啟動延遲
- 實作簡單，只需改一行

**缺點**：
- 增加月費約 $10-20

---

### 方案 B：實作 Firestore 快取

在 API 端點加入記憶體快取：

```typescript
// 快取教練資料 5 分鐘
let coachesCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default defineEventHandler(async () => {
  const now = Date.now();

  if (coachesCache && (now - coachesCache.timestamp) < CACHE_TTL) {
    return coachesCache.data;
  }

  // ... 原本的查詢邏輯

  coachesCache = { data: result, timestamp: now };
  return result;
});
```

**優點**：
- 大幅減少 Firestore 查詢次數
- 後續請求幾乎即時回應

**缺點**：
- 資料更新有最多 5 分鐘延遲
- 多實例時快取不同步

---

### 方案 C：靜態生成 (SSG)

使用 Nuxt 的 `prerender` 功能：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/team-intro/coaches': { prerender: true },
    '/locations': { prerender: true },
  }
})
```

**優點**：
- 最快的載入速度
- 零 API 延遲

**缺點**：
- 資料更新需要重新部署
- 不適合頻繁變動的內容

---

### 方案 D：優先顯示 Fallback 資料

修改前端先顯示靜態資料，再用 API 資料替換：

```typescript
// 先用 fallback 資料
const coaches = ref(fallbackCoaches);

// 非同步更新
useLazyFetch('/api/public/coaches').then(res => {
  if (res.data.value?.data) {
    coaches.value = res.data.value.data;
  }
});
```

**優點**：
- 體感速度大幅提升
- 頁面立即可見

**缺點**：
- 可能出現資料閃爍
- 需維護 fallback 資料

---

## 已完成的優化

### 2024-07 已實施

1. **API 查詢優化**
   - 將 N+1 查詢改為批次查詢
   - 檔案：`coaches.get.ts`

2. **前端載入優化**
   - 改用 `useLazyFetch` 避免阻塞導航
   - 新增 Skeleton Loader 改善體感
   - 檔案：`coaches.vue`

3. **圖片載入優化**
   - 新增 `loading="lazy"` 屬性
   - 減少首次載入資源

---

## 建議下一步

1. **短期**：設定 `minInstances: 1`（最簡單有效）
2. **中期**：實作 API 快取機制
3. **長期**：考慮 SSG 或 ISR 策略

---

## 相關檔案

| 檔案 | 說明 |
|-----|------|
| `apps/newweb/apphosting.yaml` | Firebase App Hosting 設定 |
| `apps/newweb/server/utils/firebase.ts` | Firebase 初始化邏輯 |
| `apps/newweb/server/api/public/coaches.get.ts` | 教練 API 端點 |
| `apps/newweb/server/api/public/stores.get.ts` | 門店 API 端點 |
| `apps/newweb/pages/team-intro/coaches.vue` | 教練頁面元件 |
| `apps/newweb/pages/locations/index.vue` | 門店頁面元件 |
