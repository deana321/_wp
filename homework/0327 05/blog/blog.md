# 網易網誌系統 (netease-blog)

一個使用 Node.js + Express + SQLite 建構的簡單部落格系統，採用類似中國網易部落格的紅色簡約設計風格。

## 專案概述

此專案是一個輕量級的個人部落格系統，提供完整的文章發布、分類、封存及留言功能。

## 技術架構

### 後端技術
- **Node.js + Express**：Web 應用框架
- **EJS**：模板引擎
- **SQLite (better-sqlite3)**：輕量級資料庫
- **bcryptjs**：密碼雜湊加密
- **express-session**：Session 管理
- **marked**：Markdown 渲染

### 前端技術
- 純 CSS 手寫樣式（響應式設計）
- 無需任何前端框架

## 資料庫結構

### users 資料表
| 欄位 | 說明 |
|------|------|
| id | 主鍵 |
| username | 使用者名稱（唯一） |
| password | 密碼（bcrypt 加密） |
| nickname | 暱稱 |
| bio | 自我介紹 |
| created_at | 註冊時間 |

### posts 資料表
| 欄位 | 說明 |
|------|------|
| id | 主鍵 |
| user_id | 作者 ID（外鍵） |
| title | 文章標題 |
| content | 文章內容（Markdown） |
| summary | 摘要 |
| category | 分類 |
| created_at | 發布時間 |
| updated_at | 最後更新時間 |

### comments 資料表
| 欄位 | 說明 |
|------|------|
| id | 主鍵 |
| post_id | 所属文章 ID（外鍵，级联删除） |
| author | 留言者暱稱 |
| content | 留言內容 |
| created_at | 留言時間 |

## 功能特色

### 文章管理
- 撰寫新文章（支援 Markdown 格式）
- 編輯已發布的文章
- 刪除文章
- 查看單篇文章詳情

### 分類與封存
- 自訂文章分類
- 按分類篩選文章
- 按月份封存檢視

### 留言系統
- 對文章發表留言
- 顯示最新留言側邊欄

### 使用者系統
- 會員註冊（需填寫帳號、密碼、暱稱）
- 會員登入（bcrypt 密碼驗證）
- Session 狀態管理
- 文章編輯/刪除僅限作者操作

### 內建測試帳號

| 欄位 | 內容 |
|------|------|
| 帳號 | `tester` |
| 密碼 | `test1234` |
| 暱稱 | 測試用戶 |

**說明**：系統啟動時自動檢查，若 `tester` 帳號不存在，則自動建立一個供測試使用。

## 頁面說明

| 頁面 | 路由 | 說明 |
|------|------|------|
| 首頁 | `/` | 文章列表 + 側邊欄 |
| 登入 | `/login` | 會員登入 |
| 註冊 | `/register` | 新會員註冊 |
| 寫文章 | `/post/new` | 發布新文章（需登入） |
| 文章詳情 | `/post/:id` | 查看文章 + 留言 |
| 編輯文章 | `/post/:id/edit` | 修改文章（需登入） |

## 啟動方式

```bash
npm install
npm start
```

伺服器將在 `http://localhost:3000` 啟動。

## 專案結構

```
blog/
├── app.js           # 主應用程式（路由與中介層）
├── db.js            # 資料庫操作模組
├── package.json     # 專案設定
├── public/
│   └── style.css    # 樣式表
├── views/
│   ├── index.ejs    # 首頁模板
│   ├── post.ejs     # 文章詳情模板
│   ├── new.ejs      # 寫文章模板
│   ├── edit.ejs     # 編輯文章模板
│   ├── login.ejs    # 登入模板
│   └── register.ejs # 註冊模板
└── blog.db          # SQLite 資料庫檔案
```

## 設計風格

採用網易紅（#d43c33）作為主色調，搭配白色卡片式版面與灰色文字，呈現簡潔舒適的閱讀體驗。響應式設計支援手機與平板裝置。
