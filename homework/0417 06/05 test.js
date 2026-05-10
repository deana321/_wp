//寫一個函數 multiplier(factor)，它會「回傳」另一個箭頭函數。這個被回傳的函數接受一個數字參數 n，並回傳 n * factor。

function multiplier(factor) {
  return n => n * factor;
}

const double = multiplier(2);
console.log(double(10));