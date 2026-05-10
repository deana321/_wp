// 請問以下程式碼執行後，listA 與 listB 的內容分別是什麼？為什麼？

let listA = [1, 2];
let listB = [3, 4];

function process(a, b) {
  a.push(99);
  b = [100];
}

process(listA, listB);

console.log(listA); // [1, 2, 99]
console.log(listB); // [3, 4]