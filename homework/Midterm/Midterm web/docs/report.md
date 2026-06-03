# CampusHub Notes 專案報告

## 專案動機

本專案旨在打造一個整合校園生活所需功能的平台，以可愛的粉色馬卡龍風格為主題，讓學生在一個網站中即可完成社群交流、購物、收信、查課表、搜尋資訊、管理專案等多項任務。透過此專案，我們學習了現代網頁開發的全端技術與設計思維。

## 系統架構

```
瀏覽器 (React Client)
       ↓
Next.js App Router
  ├── 頁面元件 (Client Components)
  ├── API Routes (Server-side)
  └── JSON Database
```

- **前端**：React 19 Client Components，使用 useState / useEffect 進行狀態管理
- **後端**：Next.js API Routes，處理資料 CRUD 操作
- **資料層**：JSON 檔案資料庫，使用 fs 模組讀寫 `data/db.json`

## 功能介紹

### 1. 社群功能
- 使用者可以發佈貼文、留言互動、按讚
- 貼文支援分類標籤（校園生活、學習、美食等）
- AI 一鍵摘要貼文內容

### 2. 商店功能
- 商品以馬卡龍色系卡片展示
- 加入購物車、調整數量、模擬結帳
- AI 產生商品描述

### 3. 信箱功能
- 收件匣顯示信件列表，區分已讀/未讀
- 點擊查看信件詳細內容
- 撰寫新信件，可選擇收件人
- AI 產生回覆草稿

### 4. 校務功能
- 課表以週曆表格呈現
- 成績查詢（含顏色標記）
- 課程公告
- 課程 checklist 風格清單

### 5. 搜尋功能
- 全站關鍵字搜尋，支援分類過濾
- 結果以索引卡片樣式呈現

### 6. 專案功能
- 類 GitHub 的專案列表
- 專案 README 檢視
- 星號收藏功能
- Issue 留言區

### 7. 排行榜功能
- 提交遊戲分數
- 伺服器儲存排序
- 前三名金銀銅徽章

## API 設計

| 路由 | 方法 | 說明 |
|------|------|------|
| `/api/user` | GET/POST | 取得/切換使用者 |
| `/api/posts` | GET/POST | 貼文列表/新增 |
| `/api/posts/[id]/likes` | POST | 切換按讚 |
| `/api/posts/[id]/comments` | GET/POST | 留言列表/新增 |
| `/api/products` | GET | 商品列表 |
| `/api/cart` | GET/POST/DELETE | 購物車操作 |
| `/api/checkout` | POST | 模擬結帳 |
| `/api/emails` | GET/POST | 信件列表/寄信 |
| `/api/emails/[id]` | GET/PATCH | 信件詳情/更新狀態 |
| `/api/courses` | GET | 課程列表 |
| `/api/announcements` | GET | 公告列表 |
| `/api/search` | GET | 全站搜尋 |
| `/api/projects` | GET/POST | 專案列表/新增 |
| `/api/projects/[id]` | GET | 專案詳情 |
| `/api/projects/[id]/stars` | POST | 星號切換 |
| `/api/projects/[id]/issues` | GET/POST | Issue 列表/新增 |
| `/api/scores` | GET/POST | 排行榜/提交分數 |
| `/api/stats` | GET | 首頁統計 |
| `/api/today-schedule` | GET | 今日課表 |
| `/api/ai/summarize` | POST | AI 摘要貼文 |
| `/api/ai/product-desc` | POST | AI 商品描述 |
| `/api/ai/reply-draft` | POST | AI 回信草稿 |

## 資料設計

使用 JSON 檔案儲存所有資料，結構如下：

- `users` — 使用者資料（id、名稱、頭貼、email）
- `posts` — 貼文（含分類、按讚列表、時間戳）
- `comments` — 留言（關聯貼文 ID）
- `products` — 商品（名稱、價格、分類）
- `cart` — 購物車（以使用者 ID 為鍵）
- `emails` — 信件（寄件人、收件人、主旨、內容、已讀狀態）
- `courses` — 課程（課名、教師、成績、時間、地點）
- `announcements` — 公告
- `projects` — 專案（含 README、星號列表）
- `issues` — Issue（關聯專案 ID）
- `scores` — 遊戲分數

## 成果與心得

透過本專案，我們成功打造了一個功能完整的校園整合平台。從前端 UI 設計到後端 API 開發，再到資料庫設計與 AI 功能整合，涵蓋了現代網頁開發的核心技術。粉色馬卡龍的視覺風格讓平台充滿校園筆記本的溫馨感，提升了使用體驗。
