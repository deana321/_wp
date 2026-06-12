// 建立一個陣列 words，裡面放兩個字串
const words = ["Task", "Completed"]; // words 的內容是 ["Task", "Completed"]


// 使用 setTimeout，讓程式延遲一段時間後再執行
setTimeout(() => { // 這裡使用箭頭函數，代表 2 秒後要執行的程式內容

  console.log(words.join(" ")); // 使用 join(" ") 把陣列元素用空白接起來，印出 "Task Completed"

}, 2000); // 2000 代表 2000 毫秒，也就是 2 秒