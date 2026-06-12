// 建立一個陣列 prices，用來存放原本的價格
const prices = [100, 200, 300, 400]; // prices 裡面有 4 個價格，分別是 100、200、300、400

// 使用 map 方法，把 prices 陣列裡的每一個價格都拿出來處理
const discountPrices = prices.map(price => price * 0.8); // price 代表目前取出的價格，price * 0.8 代表打 8 折

// 把打折後的新陣列印出來
console.log(discountPrices); // 輸出結果會是 [80, 160, 240, 320]