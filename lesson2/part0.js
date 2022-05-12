// Подключается модуль events так же, как и любой другой стандартный модуль
const EventEmitter = require('events');

// для баловства
const colors = require("colors/safe");



// создадим массив
// объектов, описывающих различные типы запросов

const requestTypes = [{
        type: 'send',
        payload: 'to send a document'
    },
    {
        type: 'receive',
        payload: 'to receive a document'
    },
    {
        type: 'sign',
        payload: 'to sign a document'
    }
];



// создадим класс Customer. У него будут свойства type и payload, соответствующие типу запроса
// каждого посетителя

class Customer {
    constructor(params) {
        this.type = params.type;
        this.payload = params.payload;
    }
}


// напишем функцию, генерирующую псевдослучайное число в заданном диапазоне. При
// этом для удобства работы включим границы

const generateIntInRange = (min, max) => {
    min = Math.ceil(min);

    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};



// Для задержки при появлении нового посетителя нам пригодится функция delay. Она резолвит промис
// после истечения таймера

const delay = (ms) => {
    return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
    });
};



// напишем функцию, которая будет эмулировать приход нового посетителя с какой-то случайной
// задержкой

const generateNewCustomer = () => {
    const intervalValue = generateIntInRange(1, 5) * 1000;
    const params = requestTypes[generateIntInRange(0, 2)];
    return delay(intervalValue).then(() => new Customer(params));
}



// создадим класс Handler, который обработает запросы в зависимости от их типа

class Handler {
    static send(payload) {

    let colorer = colors.yellow;

    console.log(colorer('Send request'));
    console.log(`Customer need ${payload}`);
    }
    static receive(payload) {

    let colorer = colors.blue;

    console.log(colorer('Receive request'));
    console.log(`Customer need ${payload}`);
    }
    static sign(payload) {

    let colorer = colors.green;

    console.log(colorer('Sign request'));
    console.log(`Customer need ${payload}`);
    }

    static pay() {
        let colorer = colors.red;
        console.log(colorer(`Customer needs to pay for the services`));
    }
}


// Для генерации событий и создания их
// обработчиков используется специальный объект — эмиттер событий. Для него требуется создать
// класс-наследник класса EventEmitter, затем сделать его экземпляр

class MyEmitter extends EventEmitter {};

const emitterObject = new MyEmitter();



// В качестве
// названий событий мы используем названия соответствующих типов запросов. Для создания одного
// обработчика у объекта-эмиттера событий нужно вызвать метод on. Далее следует передать в него
// название события и функцию, которая будет вызываться каждый раз, когда генерируется
// соответствующее событие. В нашем случае для всех 4 типов запросов это будет выглядеть
// следующим образом
// 
// при появлении события send его будет обрабатывать
// функция send() класса Handler

emitterObject.on('send', Handler.send);
emitterObject.on('receive', Handler.receive);
emitterObject.on('sign', Handler.sign);








// создадим нового пользователя через
// функцию generateNewCustomer и сгенерируем событие

generateNewCustomer().then(
    customer => emitterObject.emit(customer.type, customer.payload)
);



// Для генерации события используем метод emit() объекта-эмиттера событий. Первым аргументом в
// него передадим название события. Второй аргумент (необязательный) — это данные, которые мы
// хотим передать обработчику события. Эти данные поступают в соответствующую
// функцию-обработчик события класса Handler и доступны там в переменной payload.
// функция выполнится один раз


// чтобы больше -- создать специальную функцию для запуска программы и добавить в неё
// рекурсию — когда функция вызывает саму себя

const i = 10;
let j = 0;
const run = async () => {
    
    const customer = await generateNewCustomer();
    emitterObject.emit(customer.type, customer.payload);

    if(j < i){
        run();
        j++;
    }
};

run();



// После первого запуска функции run и генерации нового посетителя эта
// функция вызывает саму себя. Таким образом, создаётся модель бесконечного потока посетителей. В
// терминал будут выводиться данные по каждому посетителю



// посетителям, которые пришли с запросом отправки документа send, после обработки этого
// запроса требуется ещё оплатить отправку документа через кассу. Это реализуется несколькими
// способами. И один из них — добавить дополнительный обработчик

// emitterObject.on('send', Handler.pay);
emitterObject.once('send', Handler.pay);

// Важно не забыть добавить соответствующую функцию в класс Handler
// стр 98


// Класс EventEmitter также даёт возможность выполнить обработчик один раз, а потом автоматически
// снять его с регистрации. Для этого он предоставляет метод once, используемый вместо on
// стр 182



// Зарегистрированный обработчик также удаляется вручную. Для этого класс EventEmitter
// предоставляет метод removeListener. Например, если отправка документов вдруг стала бесплатной, то
// потребуется убрать обработчик Handler.pay
// emitterObject.removeListener('send', Handler.pay);
// Этот метод удаляет за один раз не более одного обработчика




// По умолчанию при создании более 10 обработчиков для одного события класс EventEmitter покажет
// предупреждение. Это количество можно изменить для конкретного экземпляра класса посредством
// метода setMaxListeners. Если в него передать 0, то количество будет неограниченным:
// emitterObject.setMaxListeners(0);


// Для обработки ошибок предусматривается специальное событие error. Оно, как и другие события,
// генерируется самостоятельно. Если для события error не будет ни одного обработчика, программа
// выбросит исключение, покажет stack trace и завершит работу.
// Например, генерирование события без подключённого обработчика:

// emitterObject.emit('error', new Error('Что-то пошло не так!'));





