// ДЗ часть 2

const EventEmitter = require('events');
const colors = require("colors/safe");


class MyEmitter extends EventEmitter {};
const emitterObject = new MyEmitter();





// сгенерить интервал в несколько минут
const generateMinsRange = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};



// установить время до окончания таймера
const setTimeAhead = (interval) => {
    return newTime = +new Date() + 60000 * interval;
}





class Handler {
    static make(timerIndex, tilTime) {

        setInterval(() => {

            let diff = +new Date(tilTime) - +new Date();

            // console.log(diff);

            let colorer = null;
            switch(timerIndex){
                case 0:
                    colorer = colors.red;
                    break;
                case 1:
                    colorer = colors.yellow;
                    break;
                case 2:
                    colorer = colors.blue;
                    break;
                default:
                    break;    
            }
            
            console.log( colorer( `Таймер ${timerIndex}, осталось ${ new Date(diff).getMinutes() }:${ new Date(diff).getSeconds() } секунд` ) );

            if( new Date(diff).getMinutes() == 0 && new Date(diff).getSeconds() == 0 ) {
                emitterObject.emit('error', new Error(`Таймер ${timerIndex} окончен`));
            }
        }, 1000);
    }
}


emitterObject.on('make', Handler.make);



for (let j = 0; j < 3; j++) {
    let timer = setTimeAhead(generateMinsRange(1,5));
    emitterObject.emit(Handler.make(j, timer))    
}


emitterObject.removeAllListeners()