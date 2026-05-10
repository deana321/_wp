//寫一個函數 calculateTotal(cart, discountFunc)。

function calculateTotal(cart, discountFunc) {
  let total = 0;

  for (let price of cart) {
    total += price;
  }

  return discountFunc(total);
}

const result = calculateTotal([100, 200, 300], function (total) {
  return total - 50;
});

console.log(result);