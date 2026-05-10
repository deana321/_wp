//使用 setTimeout。要求在 2 秒後，利用箭頭函數印出陣列 ["Task", "Completed"] 中組合起來的字串 "Task Completed"。

const words = ["Task", "Completed"];

setTimeout(() => {
  console.log(words.join(" "));
}, 2000);