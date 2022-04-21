const colors = require("colors/safe");

// простые делятся на 1 и на себя 3 , 5, 7, 11, 13
// Ещё одно улучшение возникает благодаря следующему утверждению: наименьший делитель (k) составного числа (n) не превосходит sqrt(n). 
// Всё это означает, что, перебирая потенциальные делители, можно оборвать перебор, когда (k) достигнет sqrt(n): если до этого момента делителей не найдено, то их нет вообще.


const from = parseInt(process.argv[2]); 
const to = parseInt(process.argv[3]);
let colorer = colors.red;
let err = '';


// console.log(`Typeof from ${from} is ${typeof(from)}`);
// console.log(`Typeof to ${to} is ${typeof(to)}`);




if (isNaN(from)){
    err += `\nError in first number ${from}. Typeof is ${typeof(from)}`;
}

if (isNaN(to)){
    err += `\nError in second number ${to}. Typeof is ${typeof(to)}`;
}

if (from > 1000000){
    err += `\nFirst number it is too big`;
}

if (to > 1000000){
    err += `\nSecond number it is too big`;
}



if (err.length > 0){
    console.log(colorer(err));
    // window.stop();
}

if (err.length < 1){
    colorer = colors.green;
    console.log(colorer(`\nnumbers are good\n`));
}

let simples = [];
for (let i = from; i < to; i++) {
    
    if (i > 2 && i % 2 > 0) {
        for (let j = 3; j <= i; j++ ){

            // console.log(`\ni - ${i}, j - ${j}, i/j = ${i/j}`);
            if ( i % j === 0 && i !== j) {
                break;
            }

            if ( i % j === 0 && i === j) {

                // console.log(`\ni - ${i}, j - ${j}`);
                simples.push(i);
            }
        }
    }
}

if(err.length < 1) {
    if(simples.length < 1){
        colorer = colors.red;
        console.log(colorer(`No simples between ${from} and ${to}\n`))
    }
    else {
        console.log(colorer(`Simples between ${from} and ${to} are:\n` + simples + '\n'));
    }
}