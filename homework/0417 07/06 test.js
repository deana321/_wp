// 第 6 題：JSON 處理 Parsing JSON
// 目標：理解 app.use(express.json()) 在處理什麼

// 給定一個 JSON 字串
const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}';

// 使用 JSON.parse() 把 JSON 字串轉成 JavaScript 物件
let obj = JSON.parse(jsonStr);

// 印出整個物件
console.log(obj);

// 印出 tags 陣列中的第二個元素
console.log(obj.tags[1]);