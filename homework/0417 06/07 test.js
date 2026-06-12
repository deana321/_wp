// 建立一個 users 陣列，裡面放的是「物件資料」
const users = [ // users 是一個陣列，裡面可以存放多筆使用者資料

  { name: "Alice", age: 25 }, // 第一筆使用者資料，name 是 Alice，age 是 25

  { name: "Bob", age: 17 } // 第二筆使用者資料，name 是 Bob，age 是 17

]; // users 陣列結束


// 使用 filter 方法，從 users 裡面篩選出符合條件的使用者
const adults = users.filter((user) => { // user 代表目前正在檢查的其中一個使用者物件

  return user.age >= 18; // 如果這個使用者的 age 大於等於 18，就回傳 true，代表保留下來

}); // filter 結束，會產生一個新的陣列 adults


// 把篩選後的 adults 印在控制台上
console.log(adults); // 輸出結果會是 [{ name: "Alice", age: 25 }]