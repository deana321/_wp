# JavaScript 綜合練習作業

## 專案說明

本作業將 10 個 JavaScript 基礎練習整合成一個完整範例，內容包含：

- if
- for
- while
- function
- JSON
- array
- object

透過這份程式，可以練習 JavaScript 的基本語法與資料處理方式。

---

## 使用到的語法

### 1. if
用來做條件判斷。

### 2. for
用來重複執行程式，常搭配陣列使用。

### 3. while
當條件成立時，重複執行程式。

### 4. function
用來建立可以重複使用的函式。

### 5. JSON
用來儲存與交換資料格式。

### 6. array
用來儲存多筆資料。

### 7. object
用來表示一個完整的資料，例如一位學生。

---

## 程式功能說明

本程式包含以下功能：

1. 建立加法函式
2. 建立學生物件資料
3. 用陣列儲存學生分數
4. 使用 for 逐一讀取成績
5. 計算總分與平均
6. 使用 if 判斷是否及格
7. 使用 if else if 判斷等第
8. 使用 while 顯示迴圈結果
9. 使用 JSON.parse() 解析 JSON 資料
10. 判斷 JSON 資料中的學生是否及格

---

## 程式碼

```javascript
// JavaScript 綜合練習
// 包含：if、for、while、function、JSON、array、object

console.log("=== JavaScript 綜合程式開始 ===");

// 1. function：建立加法函式
function add(a, b) {
    return a + b;
}

// 2. object：建立學生物件
let student = {
    name: "小明",
    age: 20,
    department: "資工系",
    scores: [85, 72, 90, 58, 76]   // 3. array：學生的成績陣列
};

console.log("姓名：" + student.name);
console.log("年齡：" + student.age);
console.log("科系：" + student.department);

console.log("---------------");
console.log("學生各科成績：");

// 4. for：逐一讀取陣列資料
for (let i = 0; i < student.scores.length; i++) {
    console.log("第 " + (i + 1) + " 科成績：" + student.scores[i]);
}

console.log("---------------");

// 5. for：計算總分
let sum = 0;
for (let i = 0; i < student.scores.length; i++) {
    sum = sum + student.scores[i];
}

console.log("總分：" + sum);

// 6. function：呼叫函式算平均
let average = sum / student.scores.length;
console.log("平均：" + average);

// 7. if：判斷是否及格
if (average >= 60) {
    console.log("結果：平均及格");
} else {
    console.log("結果：平均不及格");
}

console.log("---------------");
console.log("成績等第判斷：");

// 8. if else if：判斷平均等第
if (average >= 90) {
    console.log("等第：A");
} else if (average >= 80) {
    console.log("等第：B");
} else if (average >= 70) {
    console.log("等第：C");
} else if (average >= 60) {
    console.log("等第：D");
} else {
    console.log("等第：F");
}

console.log("---------------");
console.log("while 迴圈示範：");

// 9. while：印出 1 到 5
let count = 1;
while (count <= 5) {
    console.log("count = " + count);
    count++;
}

console.log("---------------");
console.log("function 加法測試：");

// 呼叫 add 函式
let result = add(10, 20);
console.log("10 + 20 = " + result);

console.log("---------------");
console.log("JSON 資料處理：");

// 10. JSON：字串轉成 JavaScript 資料
let jsonText = `
[
    {"name":"小華","score":88},
    {"name":"小美","score":54},
    {"name":"小杰","score":91}
]
`;

let students = JSON.parse(jsonText);

// 使用 for + if 判斷 JSON 資料中的學生是否及格
for (let i = 0; i < students.length; i++) {
    if (students[i].score >= 60) {
        console.log(students[i].name + " 的成績是 " + students[i].score + "，及格");
    } else {
        console.log(students[i].name + " 的成績是 " + students[i].score + "，不及格");
    }
}

console.log("=== JavaScript 綜合程式結束 ===");