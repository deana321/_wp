//手寫一個類似 filter 的函數，名為 myFilter(arr, callback)。

function myFilter(arr, callback) {
  let result = [];

  for (let item of arr) {
    if (callback(item)) {
      result.push(item);
    }
  }

  return result;
}

const numbers = [1, 5, 8, 12];
const filteredNumbers = myFilter(numbers, item => item > 7);

console.log(filteredNumbers);