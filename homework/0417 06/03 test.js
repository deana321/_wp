//給定一個陣列 const prices = [100, 200, 300, 400]。請使用 map 方法結合箭頭函數，產生一個新陣列，內容是原價格打 8 折後的結果。

const prices = [100, 200, 300, 400];
const discountPrices = prices.map(price => price * 0.8);

console.log(discountPrices);