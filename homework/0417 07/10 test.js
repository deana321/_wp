// 第 10 題：錯誤優先回呼模式
// Error-First Callback Pattern
// 目標：理解 if (err) return ... 的寫法

// 定義 checkAdmin 函數
// role：代表使用者角色
// callback：檢查完成後要執行的函數
function checkAdmin(role, callback) {

  // 如果 role 不是 "admin"，代表沒有權限
  if (role !== "admin") {

    // 第一個參數放錯誤訊息，代表發生錯誤
    callback("Access Denied");
  } 
  
  // 如果 role 是 "admin"，代表有權限
  else {

    // 第一個參數 null，代表沒有錯誤
    // 第二個參數 "Welcome"，代表成功訊息
    callback(null, "Welcome");
  }
}

// 測試 1：不是 admin 的情況
checkAdmin("user", function(err, message) {

  // 如果 err 有值，代表發生錯誤
  if (err) {
    console.log("錯誤：", err);
    return;
  }

  // 如果沒有錯誤，才會執行這裡
  console.log("成功：", message);
});

// 測試 2：是 admin 的情況
checkAdmin("admin", function(err, message) {

  // 如果 err 有值，代表發生錯誤
  if (err) {
    console.log("錯誤：", err);
    return;
  }

  // 如果沒有錯誤，印出成功訊息
  console.log("成功：", message);
});