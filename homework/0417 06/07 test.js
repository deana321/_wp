//給定一個包含物件的陣列 const users = [{name: "Alice", age: 25}, {name: "Bob", age: 17}]。

const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 17 }
];

const adults = users.filter((user) => {
  return user.age >= 18;
});

console.log(adults);