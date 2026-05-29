// 第 1 題：物件屬性存取 Object Property Access
// 目標：理解 post.title 的運作

// 宣告一個名為 post 的物件
let post = {
  id: 1,
  title: "Hello World",
  content: "Markdown content"
};

// 方法一：點符號 Dot notation
// 寫法：物件名稱.屬性名稱
console.log(post.title);

// 方法二：中括號 Bracket notation
// 寫法：物件名稱["屬性名稱"]
console.log(post["title"]);