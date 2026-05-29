// 第 8 題：樣板字串中的邏輯運算
// Template Literals with Logic
// 目標：理解網頁 HTML 模板的產生

// 宣告一個使用者名稱
let user = "Guest";

// 使用反引號 ` 建立 HTML 字串
// ${} 裡面可以放 JavaScript 表達式
let html = `<h1>Welcome, ${user ? user : "Stranger"}</h1>`;

// 印出 HTML 字串
console.log(html);