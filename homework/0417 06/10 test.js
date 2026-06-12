// 寫一個名為 calculateTotal 的函數，這個函數會計算購物車總金額，並套用折扣
function calculateTotal(cart, discountFunc) { // cart 代表購物車價格陣列，discountFunc 代表折扣函數

  let total = 0; // 建立變數 total，用來累加購物車裡所有商品的價格，初始值是 0

  for (let price of cart) { // 使用 for...of 迴圈，把 cart 陣列裡的每一個價格依序取出來，暫時叫做 price

    total += price; // 把目前取出的 price 加到 total 裡面

  } // for...of 迴圈結束，代表所有商品價格都加完了

  return discountFunc(total); // 把總金額 total 傳進 discountFunc 折扣函數，並回傳折扣後的結果

} // calculateTotal 函數結束


// 呼叫 calculateTotal 函數
const result = calculateTotal([100, 200, 300], function (total) { // 傳入購物車價格陣列，以及一個折扣函數

  return total - 50; // 折扣函數會把總金額減掉 50

}); // calculateTotal 執行結束，結果會存進 result


// 把 result 印在控制台上
console.log(result); // 輸出結果會是 550