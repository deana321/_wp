// 建立一個陣列 listA，內容是 [1, 2]
let listA = [1, 2]; // listA 指向一個陣列，陣列內容目前是 [1, 2]

// 建立一個陣列 listB，內容是 [3, 4]
let listB = [3, 4]; // listB 指向另一個陣列，陣列內容目前是 [3, 4]

// 建立一個函數 process，會接收兩個參數 a 和 b
function process(a, b) { // a 會接到 listA，b 會接到 listB

  a.push(99); // 對 a 指向的陣列加入 99，因為 a 和 listA 指向同一個陣列，所以 listA 也會被改到

  b = [100]; // 讓 b 改成指向一個新的陣列 [100]，但這只改到 b 自己，不會改到外面的 listB

} // process 函數結束


// 呼叫 process 函數，並把 listA 和 listB 傳進去
process(listA, listB); // listA 會被 a.push(99) 改到，但 listB 不會被 b = [100] 改到


// 印出 listA 的內容
console.log(listA); // 輸出 [1, 2, 99]

// 印出 listB 的內容
console.log(listB); // 輸出 [3, 4]