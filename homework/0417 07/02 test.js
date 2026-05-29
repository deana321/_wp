// 第 2 題：物件解構賦值 Object Destructuring
// 目標：理解 const { title, content } = req.body; 的寫法

// 假設 req 是從使用者表單送來的資料
const req = {
  body: {
    title: "JS教學",
    content: "內容在此",
    author: "Gemini"
  }
};

// 用一行程式碼從 req.body 中取出 title 和 content
const { title, content } = req.body;

// 印出結果
console.log(title);
console.log(content);