// 第 5 題：實作「錯誤優先」的回呼函數
// Error-First Callback
// 目標：理解 getPost(id, (err, post) => { ... }) 的非同步設計

// 1. 定義 fetchData 函數
// id：代表要查詢的資料編號
// callback：代表資料準備好之後，要執行的函數
function fetchData(id, callback) {

  // 在函數內部建立一個假資料，模擬從資料庫抓到的資料
  const fakeData = {
    id: id,
    status: "success"
  };

  // 呼叫 callback，把資料傳出去
  // 第一個參數 null：代表沒有錯誤
  // 第二個參數 fakeData：代表成功取得的資料
  callback(null, fakeData);
}

// 2. 執行 fetchData 並處理回傳的結果
fetchData(101, (err, data) => {

  // 如果 err 有值，代表發生錯誤
  if (err) {
    console.log("發生錯誤：" + err);
  } 
  
  // 如果 err 是 null，代表沒有錯誤，可以使用 data
  else {
    console.log("成功取得資料：", data);
  }
});