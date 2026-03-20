/*JSON + object + array 綜合練習*/
let jsonText = `
[
    {"name":"小明","score":85},
    {"name":"小華","score":58},
    {"name":"小美","score":92}
]
`;

let students = JSON.parse(jsonText);

for (let i = 0; i < students.length; i++) {
    if (students[i].score >= 60) {
        console.log(students[i].name + " 及格");
    } else {
        console.log(students[i].name + " 不及格");
    }
}