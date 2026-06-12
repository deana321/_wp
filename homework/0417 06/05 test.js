// 寫一個名為 multiplier 的函數，這個函數會接收一個參數 factor
function multiplier(factor) { // factor 代表「要乘上的倍數」

  return n => n * factor; // 回傳一個箭頭函數，這個箭頭函數會接收 n，並回傳 n * factor 的結果

} // multiplier 函數結束


// 呼叫 multiplier 函數，並傳入 2
const double = multiplier(2); // multiplier(2) 會回傳一個「把數字乘以 2」的函數，並存到 double 裡面

// 呼叫 double 函數，並傳入 10
console.log(double(10)); // double(10) 等於 10 * 2，所以輸出結果是 20