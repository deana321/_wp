// 第 4 題：字典與動態參數 URL Params / Dictionary
// 目標：理解 req.params.id 的來源

// 建立一個空物件，模擬 Express 裡的 req.params
let params = {};

// 動態新增一個鍵為 "id"，值為 99 的屬性
params["id"] = 99;

// 印出整個 params 物件
console.log(params);

// 也可以單獨印出 id
console.log(params.id);