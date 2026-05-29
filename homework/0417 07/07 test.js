// 第 7 題：模擬資料庫查詢
// Simulating Database Query
// 目標：理解 db.get(sql, params, callback) 的運作流程

// 1. 實作模擬資料庫查詢的函數
// sql：代表 SQL 查詢指令
// params：代表 SQL 裡面 ? 要代入的參數
// callback：查詢完成後要執行的函數
function fakeGet(sql, params, callback) {

  // 這裡不是真的查資料庫，而是假裝資料庫查到一筆文章資料
  const fakeRow = {
    id: 1,
    title: "掌握 JavaScript 函數",
    content: "這是一篇關於 Callback 的文章..."
  };

  // 執行 callback，把查詢結果傳出去
  // 第一個參數 null：代表沒有錯誤
  // 第二個參數 fakeRow：代表查到的那一筆資料
  callback(null, fakeRow);
}

// 2. 測試呼叫：模擬在 Express 中抓取文章的場景
const query = "SELECT * FROM posts WHERE id = ?";
const inputParams = [1];

// 呼叫 fakeGet，並用 callback 接收查詢結果
fakeGet(query, inputParams, (err, row) => {

  // 如果 err 有值，代表查詢失敗
  if (err) {
    console.error("查詢失敗");
  } 
  
  // 如果 err 是 null，代表查詢成功
  else {
    // row 就是 fakeGet 裡面傳出來的 fakeRow
    console.log("抓到的文章標題是：", row.title);
  }
});