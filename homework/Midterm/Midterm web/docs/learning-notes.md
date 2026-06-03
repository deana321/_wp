# 學習筆記

## 1. Server 與 API

本專案使用 Next.js 的 App Router，所有頁面與 API 都在同一個專案中管理：

- **API Routes**：在 `src/app/api/` 下建立 `route.js` 檔案，Next.js 會自動將其對應到 RESTful 端點
- **Serverless Functions**：每個 API Route 都是獨立的伺服器函數，處理請求和回應
- **動態路由**：使用 `[id]` 語法處理動態參數，例如 `/api/posts/[id]/likes`

```javascript
// GET /api/posts
export async function GET() {
  const db = readDB();
  return Response.json(db.posts);
}
```

## 2. 資料儲存

使用 JSON 檔案作為資料庫，優點是簡單、不需安裝額外軟體：

- **讀取**：`fs.readFileSync` 讀取 JSON 檔案
- **寫入**：`JSON.stringify` + `fs.writeFileSync`
- **快取機制**：記憶體快取避免每次讀取都存取硬碟

這種方式適合小型專案，未來可擴展為 SQLite 或 PostgreSQL。

## 3. 前端元件與狀態管理

- **Client Components**：使用 `'use client'` 標記，在瀏覽器端執行
- **useState**：管理元件內部狀態（表單資料、列表、載入狀態）
- **useEffect**：在元件掛載時 fetch API 資料

## 4. CSS 設計

- **CSS 變數**：定義主題色系（粉色、薄荷綠、奶油黃等）
- **自訂類別**：卡片、按鈕、標籤、表格等共用樣式
- **響應式設計**：使用 media query 處理小螢幕裝置

## 5. AI 整合

使用本地模擬的 AI 功能（Fallback 版本）：

- **摘要**：隨機選取預設摘要文字
- **商品描述**：隨機選取商品介紹
- **回信草稿**：隨機選取回覆範本

未來可替換為 Ollama Cloud 或 NVIDIA API。

## 6. 搜尋功能

全站搜尋實作：

- 遍歷多個資料集合（貼文、商品、信件、課程、專案）
- 不區分大小寫的關鍵字比對
- 分類過濾

```javascript
results.push(
  ...db.posts.filter(p =>
    p.title.includes(q) || p.content.includes(q)
  ).map(p => ({ type: '貼文', ... }))
);
```
