const cluster = require('cluster');
const os = require('os');
const http = require('http');
const url = require('url');
const fs = require('fs');
const { Transform } = require('stream')
const path = require('path');
const src = '/';
// const { Worker } = require('worker_threads')
// const myWorker = new Worker("./worker.js");


let currentDirectory = process.cwd();



const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
}


const leaveSearchStrings = (textFile, search) => {
    const chunkLines = textFile.split('\n');
    const newChunkArray = chunkLines.filter( line => (line.indexOf(search) > -1) ? line : '' ); 
    return newChunkArray.join('\n');
}




const numCPUs = os.cpus().length;
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        console.log(`Forking process number ${i}...`);
        cluster.fork();
    }
} else {
    console.log(`Worker ${process.pid} started...`);
    http.createServer((request, response) => {
        console.log(`Worker ${process.pid} handle this request...`);
        setTimeout(() => {
            if (request.method === 'GET') {
                // Создаем строку, описывающую путь к файлу
                const filePath = path.join(__dirname, 'index.html');
                // Создаем объект потока на чтение файла
                readStream = fs.createReadStream(filePath);
                // В заголовке указываем тип контента html
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });


                


                const queryObject = url.parse(request.url, true).query;
                if(queryObject.currentDirectory){
                    currentDirectory = `${queryObject.currentDirectory}`;
                }

                let pathAddition = '';
                if(currentDirectory !== process.cwd()){
                    pathAddition = __dirname + '/';
                }

                
                const list = fs.readdirSync(path.join(`${pathAddition}${currentDirectory}`), {withFileTypes: true})
                    .filter(item => !item.isDirectory())
                    .map(item => item.name)

                const dList = fs.readdirSync(path.join(`${pathAddition}${currentDirectory}`), {withFileTypes: true})
                    .filter(item => item.isDirectory())
                    .map(item => item.name)

                 

                let dirList = '<option>Select folder</option><option value="..">Up level</option><option value=".">Back</option>';
                dList.forEach((elt) => {
                    if(elt !== undefined)
                    dirList += `<option name="currentDirectory" value="../${elt}">${elt}/</option>`
                })

                
                
                let olList = '';
                list.forEach((elt) => {
                    if(elt !== undefined)
                        olList += `<li><a class="files" href="index.html?currentDirectory=${currentDirectory}&fileName=${elt}">${elt}</a></li>`
                })


                let str = '';
                if (queryObject.fileName){

                    
                    str = fs.readFileSync(`${pathAddition}${currentDirectory}/${queryObject.fileName}`).toString();

                    if (queryObject.search){
                        str = leaveSearchStrings(str, queryObject.search);
                    } 

                    str = str.replace(/[\r\n]+/g, "<br>")

                }


                

                
                readStream.on('data', function(data) { 

                    

                    if (queryObject.fileName){


                        // myWorker.postMessage(data, olList, dirList, str);
                        
                        data = data
                            .toString()
                            .replace('{{data}}', olList)
                            .replace('{{folder}}', dirList)
                            .replace('{{code}}', str);

                        // myWorker.onmessage = function(e) {
                        //     data = e.data;
                        //     console.log('Message received from worker');
                        //   }
 

                    }
                    else {

                        data = data
                            .toString()
                            .replace('{{data}}', olList)
                            .replace('{{folder}}', dirList)
                            .replace('{{code}}', str);
                    }
                    
                    response.write(data);
                });
                readStream.on('end', function(data) {
                    response.end();
                });



            } else if (request.method === 'POST') {
                let data = '';
                request.on('data', chunk => {
                    data += chunk;
                });
                request.on('end', () => {
                    const parsedData = JSON.parse(data);
                    // console.log(parsedData);
                    response.writeHead(200, {
                        'Content-Type': 'json'
                    });
                    response.end(data);
                });
            } else {
                response.statusCode = 405;
                response.end();
            }
        }, 1000);


    }).listen(8085, 'localhost');
}