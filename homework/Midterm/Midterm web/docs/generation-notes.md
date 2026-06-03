# 生成紀錄

## 規劃階段

1. 確認專案主題：CampusHub Notes 粉色馬卡龍校園社群整合平台
2. 列出 8 大功能：社群、商店、信箱、校務、搜尋、專案、排行榜、AI
3. 選擇技術架構：Next.js 16 (App Router) + JSON 資料庫
4. 設計配色方案與 UI 風格

## 建立架構

1. 使用 `create-next-app` 初始化專案
2. 建立目錄結構：`src/lib/`、`src/components/`、`src/app/api/`、`data/`、`docs/`
3. 建立資料庫層：`src/lib/db.js` — JSON 檔案讀寫
4. 建立 AI 層：`src/lib/ai.js` — 本地模擬 AI 回覆
5. 建立種子資料：`data/db.json` — 包含所有展示用資料

## 實作功能

### 基礎建設
- 全域 CSS（粉色馬卡龍主題）
- 側邊選單 + 使用者切換
- 首頁 Dashboard

### 社群功能
- 貼文 CRUD API + 頁面
- 留言系統
- 按讚切換
- AI 摘要

### 商店功能
- 商品 API + 頁面
- 購物車 API
- 模擬結帳
- AI 商品描述

### 信箱功能
- 信件 API + 頁面
- 信件詳細頁
- 撰寫信件
- AI 回信草稿

### 校務功能
- 課程 API + 頁面（課表/成績/公告/清單）

### 搜尋功能
- 全站搜尋 API + 頁面
- 分類過濾

### 專案功能
- 專案 API + 頁面
- 星號收藏
- Issue 留言

### 排行榜功能
- 分數 API + 頁面
- 提交分數表單
- 前三名徽章

## 美編階段

1. 統一所有頁面的 CSS 樣式
2. 修復 layout 嵌套問題
3. 確保響應式設計

## 測試階段

1. `npm run build` — 編譯成功
2. 所有路由正常註冊（5 頁面 + 22 API）
3. 資料一致性驗證
4. 修復 build 錯誤

## 文件階段

- README.md — 專案介紹、安裝執行
- docs/report.md — 正式報告
- docs/learning-notes.md — 學習筆記
- docs/design-notes.md — 設計筆記
- docs/generation-notes.md — 生成紀錄
