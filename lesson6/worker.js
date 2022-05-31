
const { Worker } = require('worker_threads')


if (window.Worker) {

    onmessage = (data,olList,dirList,str) => {
    return data
        .toString()
        .replace('{{data}}', olList)
        .replace('{{folder}}', dirList)
        .replace('{{code}}', str);
    }
    postMessage(data);
    
}