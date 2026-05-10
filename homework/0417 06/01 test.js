//建立一個名為 mathTool 的函數。它接受三個參數：num1, num2 以及一個 action（回呼函數）。

function mathTool(num1, num2, action) {
  return action(num1, num2);
}

console.log(
  mathTool(10, 5, function (a, b) {
    return a + b;
  })
);

console.log(
  mathTool(10, 5, function (a, b) {
    return a - b;
  })
);