// 第 9 題：陣列物件的排序與切片
// Sort & Substring
// 目標：理解 SQL 語法在 JS 端的預習邏輯，例如 substr

// 給定一個陣列，裡面有三段很長的文章內容
const contents = [
  "Very long content here",
  "Another Very long content here",
  "3rd Very long content here"
];

// 使用 forEach 一個一個取出內容
contents.forEach(function(content) {
  // 取出每個字串的前 10 個字元，並在後面加上 ...
  let shortContent = content.substring(0, 10) + "...";

  // 印出截短後的內容
  console.log(shortContent);
});