/* 用 function 做加法函式 */ // 這是一段註解，說明這個程式會用 function 建立一個加法函式

function add(a, b) { // 建立一個叫做 add 的函式，這個函式需要接收兩個資料：a 和 b
    return a + b; // 把 a 加 b 的結果回傳出去
} // add 函式結束

let result = add(10, 20); // 呼叫 add 函式，把 10 放進 a、20 放進 b，算出來的結果存到 result 裡

console.log("答案是：" + result); // 在主控台輸出「答案是：」加上 result 的值