# 網易網誌系統 (blog 目錄) 檔案分析

## 目錄結構

```
blog/
├── package.json          # 專案配置與依賴
├── app.js                # 主應用程式 (Express 伺服器)
├── db.js                 # SQLite 資料庫模組
├── blog.db               # SQLite 資料庫檔案
├── package-lock.json     # 依賴版本鎖定
├── public/
│   └── style.css         # 全站樣式表
└── views/
    ├── index.ejs         # 首頁模板
    ├── post.ejs          # 文章詳情模板
    ├── new.ejs           # 新增文章模板
    ├── edit.ejs          # 編輯文章模板
    ├── login.ejs         # 登入模板
    └── register.ejs      # 註冊模板
```

---

## 1. package.json

**用途**: Node.js 專案配置文件，定義專案名稱、版本及依賴套件

**內容說明**:
- `name`: "netease-blog" - 專案名稱
- `version`: 1.0.0
- `description`: "簡易網易風格網誌系統"
- `main`: "app.js" - 入口檔案
- `scripts`:
  - `start`: `node app.js` - 啟動伺服器
  - `dev`: `node app.js` - 開發模式
- `dependencies` (共 6 個):
  | 套件 | 版本 | 用途 |
  |------|------|------|
  | express | ^4.18.2 | Web 框架 |
  | express-session | ^1.18.0 | 會話管理 |
  | better-sqlite3 | ^11.0.0 | SQLite 資料庫 |
  | ejs | ^3.1.9 | 模板引擎 |
  | marked | ^12.0.0 | Markdown 解析 |
  | bcryptjs | ^2.4.3 | 密碼雜湊 |

---

## 2. app.js

**用途**: Express 伺服器主程式，處理所有路由與請求

**程式碼結構**:
1. **引入模組** (行 1-6):
   - express, path, session, bcrypt, db, marked

2. **伺服器初始化** (行 8-19):
   - 設定 EJS 為視圖引擎
   - 設定靜態檔案目錄 (public/)
   - 啟用 URL 編碼解析
   - 設定 Session 中介軟體 (secret: 'netease-blog-secret-key')

3. **共用中介軟體** (行 23-34):
   - 將 `marked` 渲染函式傳遞至所有視圖
   - 將目前登入使用者資訊傳遞至所有視圖
   - 將分類、封存月份、最新留言傳遞至所有視圖

4. **權限驗證函式** (行 36-39):
   - `requireAuth()`: 檢查 session 是否有 user，無則重導向至 /login

5. **路由清單**:

   | 方法 | 路徑 | 功能 | 權限 |
   |------|------|------|------|
   | GET | / | 首頁，顯示文章列表 | 公開 |
   | GET | /login | 登入頁面 | 公開 |
   | POST | /login | 處理登入驗證 | 公開 |
   | GET | /register | 註冊頁面 | 公開 |
   | POST | /register | 處理新用戶註冊 | 公開 |
   | GET | /logout | 登出並銷毀 session | 需登入 |
   | GET | /post/new | 新增文章頁面 | 需登入 |
   | POST | /post/new | 儲存新文章 | 需登入 |
   | GET | /post/:id | 顯示單篇文章 | 公開 |
   | POST | /post/:id/comment | 發表留言 | 公開 |
   | GET | /post/:id/edit | 編輯文章頁面 | 需登入 |
   | POST | /post/:id/edit | 更新文章 | 需登入 |
   | POST | /post/:id/delete | 刪除文章 | 需登入 |

6. **伺服器啟動** (行 134-136):
   - 監聽 PORT 環境變數或預設 3000

---

## 3. db.js

**用途**: SQLite 資料庫模組，封裝所有資料庫操作

**資料表結構**:

### users 表 (行 10-19)
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | INTEGER | 主鍵，自增 |
| username | TEXT | 使用者帳號，的唯一 |
| password | TEXT | 雜湊後的密碼 |
| nickname | TEXT | 暱稱 |
| bio | TEXT | 個人簡介 |
| created_at | DATETIME | 建立時間 |

### posts 表 (行 21-33)
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | INTEGER | 主鍵，自增 |
| user_id | INTEGER | 關聯 users 表 |
| title | TEXT | 文章標題 |
| content | TEXT | 文章內容 (Markdown) |
| summary | TEXT | 文章摘要 |
| category | TEXT | 分類，預設 "未分類" |
| created_at | DATETIME | 建立時間 |
| updated_at | DATETIME | 更新時間 |

### comments 表 (行 35-44)
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | INTEGER | 主鍵，自增 |
| post_id | INTEGER | 關聯 posts 表 |
| author | TEXT | 留言者暱稱 |
| content | TEXT | 留言內容 |
| created_at | DATETIME | 建立時間 |

**導出函式**:
- `createUser()`, `getUser()`, `getUserById()` - 用戶操作
- `create()`, `getAll()`, `getById()`, `update()`, `delete()` - 文章 CRUD
- `addComment()`, `getComments()`, `getRecentComments()` - 留言操作
- `getCategories()`, `getArchiveMonths()` - 統計查詢
- `getByCategory()`, `getByMonth()` - 篩選查詢
- `close()` - 關閉資料庫連線

---

## 4. public/style.css

**用途**: 全站 CSS 樣式表

**樣式區塊**:
- **基礎樣式** (行 1-30): 重置、容器、Header
- **按鈕樣式** (行 32-42): .btn, .btn-sm, .btn-danger 等
- **側邊欄** (行 44-62): .sidebar, .sidebar-section, .sidebar-list
- **文章內容** (行 64-75): .post-full, .post-content, Markdown 样式
- **留言區塊** (行 77-88): .comments-section, .comment, .comment-form
- **表單樣式** (行 90-97): .blog-form, .form-group, input/textarea
- **認證頁面** (行 99-103): .auth-main, .auth-card, .error-msg
- **響應式** (行 108-117): @media 斷點

**色彩主題**:
- 主色: `#d43c33` (網易紅)
- 背景: `#f5f5f5` (淡灰)
- 文字: `#333` (深灰)
- 連結 hover: `#d43c33`

---

## 5. views/ 視圖檔案

### index.ejs (首頁)
- 顯示文章列表 (依時間倒序)
- 支援分類/月份篩選 (query string)
- 側邊欄顯示: 關於我、文章分類、月份封存、最新留言
- 根據登入狀態顯示不同導航

### post.ejs (文章詳情)
- 顯示完整文章內容 (Markdown 渲染)
- 顯示文章元資料 (分類、日期、作者)
- 顯示所有留言
- 留言表單 (暱稱、內容)
- 登入使用者顯示編輯/刪除按鈕

### new.ejs (新增文章)
- 表單欄位: 標題、分類、摘要、內容 (Markdown)
- 需登入才能存取

### edit.ejs (編輯文章)
- 與 new.ejs 相同結構，但預填現有資料
- 需登入才能存取

### login.ejs (登入)
- 帳號、密碼輸入欄
- 錯誤訊息顯示
- 連結至註冊頁面

### register.ejs (註冊)
- 帳號、暱稱、密碼輸入欄
- 錯誤訊息顯示
- 連結至登入頁面

---

## 資料流示意

```
使用者瀏覽器
     │
     ▼
┌─────────────┐
│   Express   │ ◄── app.js
└─────────────┘
     │
     ├──────┬──────┬──────┐
     ▼      ▼      ▼      ▼
┌───────┐┌───────┐┌───────┐┌───────┐
│  EJS  ││Router ││ Session││  DB   │
│ Views ││Logic  ││Management││db.js  │
└───────┘└───────┘└───────┘└───────┘
                     │         │
                     ▼         ▼
              ┌──────────┐ ┌──────────┐
              │  users   │ │  posts   │
              │          │ │comments  │
              └──────────┘ └──────────┘
                     │
                     ▼
              ┌──────────┐
              │ blog.db  │
              │ (SQLite) │
              └──────────┘
```

---

## 啟動方式

```bash
cd blog
npm start
# 伺服器運行於 http://localhost:3000
```

---

## 功能總覽

| 功能 | 狀態 | 說明 |
|------|------|------|
| 文章發表 | ✅ | 支援 Markdown |
| 文章編輯/刪除 | ✅ | 僅作者可操作 |
| 分類管理 | ✅ | 側邊欄顯示 |
| 月份封存 | ✅ | 側邊欄顯示 |
| 留言系統 | ✅ | 訪客可留言 |
| 用戶註冊/登入 | ✅ | bcrypt 加密 |
| Session 管理 | ✅ | express-session |
| 響應式設計 | ✅ | RWD 支援 |