// 撰寫一個名為 cleanData 的函數，這個函數會接收一個陣列 arr
function cleanData(arr) { // arr 代表傳進來的陣列資料

  arr.pop(); // 移除 arr 陣列中的最後一個元素

  arr.unshift("Start"); // 在 arr 陣列的最前面加入字串 "Start"

} // cleanData 函數結束


// 建立一個陣列 myData，裡面有三個數字 1、2、3
let myData = [1, 2, 3]; // myData 目前的內容是 [1, 2, 3]

// 呼叫 cleanData 函數，並把 myData 這個陣列傳進去
cleanData(myData); // cleanData 會直接修改 myData 這個陣列本身

// 把修改後的 myData 印在控制台上
console.log(myData); // 輸出結果會是 ["Start", 1, 2]