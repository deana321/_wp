/* 用 if else if 判斷成績等第 */ // 這是一段註解，說明這個程式是用來判斷分數等第

let score = 85; // 宣告一個變數 score，並把分數設定成 85

if (score >= 90) { // 如果 score 大於或等於 90，就代表成績是 A
    console.log("A"); // 條件成立時，在主控台輸出 A
} else if (score >= 80) { // 如果沒有達到 90，但有大於或等於 80，就代表成績是 B
    console.log("B"); // 條件成立時，在主控台輸出 B
} else if (score >= 70) { // 如果沒有達到 80，但有大於或等於 70，就代表成績是 C
    console.log("C"); // 條件成立時，在主控台輸出 C
} else if (score >= 60) { // 如果沒有達到 70，但有大於或等於 60，就代表成績是 D
    console.log("D"); // 條件成立時，在主控台輸出 D
} else { // 如果上面所有條件都不成立，也就是 score 小於 60
    console.log("F"); // 在主控台輸出 F，代表不及格
} // if else if 判斷結束