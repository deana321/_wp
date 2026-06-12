/* JSON + object + array 綜合練習 */ // 這是一段註解，說明這個程式會同時用到 JSON、物件、陣列和 if 判斷

let jsonText = ` // 宣告一個變數 jsonText，用來存放 JSON 格式的文字資料，這裡使用反引號 ` 可以寫多行文字
[
    {"name":"小明","score":85}, // 第一筆學生資料，是一個物件，name 是小明，score 是 85
    {"name":"小華","score":58}, // 第二筆學生資料，是一個物件，name 是小華，score 是 58
    {"name":"小美","score":92} // 第三筆學生資料，是一個物件，name 是小美，score 是 92
]
`; // JSON 文字結束

let students = JSON.parse(jsonText); // 使用 JSON.parse() 把 JSON 文字轉成 JavaScript 可以操作的陣列資料

for (let i = 0; i < students.length; i++) { // 建立 for 迴圈，從第 0 筆學生開始，一直跑到最後一筆學生
    if (students[i].score >= 60) { // 判斷目前這位學生的 score 是否大於或等於 60，如果是，就代表及格
        console.log(students[i].name + " 及格"); // 如果及格，就輸出學生姓名加上「及格」
    } else { // 如果上面的條件不成立，也就是分數小於 60
        console.log(students[i].name + " 不及格"); // 如果不及格，就輸出學生姓名加上「不及格」
    } // if else 判斷結束
} // for 迴圈結束