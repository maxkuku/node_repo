// часть 1

console.log('Record 1');
setTimeout(() => {
    console.log('Record 2');
    Promise.resolve().then(() => {
        setTimeout(() => {
            // закомментировано, чтобы не было ошибки при выполнении
            // сonsole.log('Record 3');
            // Promise.resolve().then(() => {
            //     console.log('Record 4');
            // });
        });
    });
});
console.log('Record 5');
Promise.resolve().then(() => Promise.resolve().then(() => console.log('Record 6')));


// 1
// 5
// 6
// 2
// 3
// error сonsole is not defined 4


