// 第 3 題：陣列的遍歷與字串拼接
// Array forEach & Template Literals
// 目標：理解部落格首頁如何產生文章列表

// 給定一個文章陣列
const posts = [
  { id: 1, t: "A" },
  { id: 2, t: "B" }
];

// 宣告一個空字串，用來存放產生出來的 HTML
let html = "";

// 使用 forEach 遍歷 posts 陣列
posts.forEach(function(post) {
  // 每跑一次，就把一篇文章轉成 <div>文章標題</div> 的格式
  html += `<div>${post.t}</div>`;
});

// 印出最後拼接好的 HTML
console.log(html);