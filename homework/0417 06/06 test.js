// 手寫一個類似 filter 的函數，函數名稱叫做 myFilter
function myFilter(arr, callback) { // arr 代表要被篩選的陣列，callback 代表篩選條件函數

  let result = []; // 建立一個空陣列 result，用來存放符合條件的資料

  for (let item of arr) { // 使用 for...of 迴圈，把 arr 陣列裡面的每一個元素依序取出來，暫時叫做 item

    if (callback(item)) { // 把 item 傳進 callback 函數，如果 callback 回傳 true，就代表這個 item 符合條件

      result.push(item); // 把符合條件的 item 加入 result 陣列中

    } // if 判斷結束

  } // for...of 迴圈結束，代表陣列裡的每個元素都檢查完了

  return result; // 回傳 result，也就是所有符合條件的資料

} // myFilter 函數結束


// 建立一個陣列 numbers，裡面放了 4 個數字
const numbers = [1, 5, 8, 12]; // numbers 目前的內容是 [1, 5, 8, 12]

// 呼叫 myFilter，傳入 numbers 陣列，還有一個篩選條件：item 要大於 7
const filteredNumbers = myFilter(numbers, item => item > 7); // 只有大於 7 的數字會被留下來

// 把篩選後的結果印在控制台上
console.log(filteredNumbers); // 輸出結果會是 [8, 12]