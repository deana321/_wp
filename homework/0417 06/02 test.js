//寫出一個立即執行函數 (IIFE)，該函數內部定義一個區域變數 count = 100，並在執行時直接在控制台印出 "Count is: 100"。

(function () {
  let count = 100;
  console.log("Count is: " + count);
})();