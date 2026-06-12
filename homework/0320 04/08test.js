/* 用 for 讀取 array 裡面的資料 */ // 這是一段註解，說明這個程式會用 for 迴圈讀取陣列裡的每一個水果

let fruits = ["蘋果", "香蕉", "芭樂", "西瓜"]; // 宣告一個陣列 fruits，裡面放了 4 個水果名稱

for (let i = 0; i < fruits.length; i++) { // 建立 for 迴圈：i 從 0 開始，只要 i 小於陣列長度，就重複執行，每次結束後 i 加 1
    console.log("水果：" + fruits[i]); // 輸出「水果：」加上目前 i 位置的水果名稱
} // for 迴圈結束