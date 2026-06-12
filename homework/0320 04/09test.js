/* 用 object 物件儲存一個人的資料 */ // 這是一段註解，說明這個程式會用物件儲存一位學生的資料

let student = { // 宣告一個物件 student，物件可以把同一個人的多個資料放在一起
    name: "小美", // 設定 student 的 name 屬性，值是「小美」
    age: 20, // 設定 student 的 age 屬性，值是 20
    department: "資工系" // 設定 student 的 department 屬性，值是「資工系」
}; // student 物件宣告結束，分號表示這行指令結束

console.log("姓名：" + student.name); // 輸出「姓名：」加上 student 物件裡的 name，也就是「小美」
console.log("年齡：" + student.age); // 輸出「年齡：」加上 student 物件裡的 age，也就是 20
console.log("科系：" + student.department); // 輸出「科系：」加上 student 物件裡的 department，也就是「資工系」