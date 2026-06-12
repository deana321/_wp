// 建立一個名為 mathTool 的函數，這個函數可以幫我們做不同的數學運算
function mathTool(num1, num2, action) { // num1 是第一個數字，num2 是第二個數字，action 是等等要執行的「函數」

  return action(num1, num2); // 執行 action 這個函數，並把 num1 和 num2 傳進去，最後把結果回傳出去

} // mathTool 函數結束


console.log( // 把括號裡面的結果印在主控台上

  mathTool(10, 5, function (a, b) { // 呼叫 mathTool，傳入 10、5，還有一個用來做加法的函數

    return a + b; // 回傳 a + b 的結果，也就是 10 + 5

  }) // mathTool 執行結束，會得到 15

); // console.log 結束，所以畫面會印出 15


console.log( // 把括號裡面的結果印在主控台上

  mathTool(10, 5, function (a, b) { // 呼叫 mathTool，傳入 10、5，還有一個用來做減法的函數

    return a - b; // 回傳 a - b 的結果，也就是 10 - 5

  }) // mathTool 執行結束，會得到 5

); // console.log 結束，所以畫面會印出 5