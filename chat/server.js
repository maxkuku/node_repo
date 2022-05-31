const http = require('http');
const path = require('path');
const fs = require('fs');
const io = require('socket.io');
const { nanoid } = require('nanoid')






const app = http.createServer((request, response) => {


    
    

    
    if (request.method === 'GET') {
        const filePath = path.join(__dirname, 'index.html');
        readStream = fs.createReadStream(filePath, "utf-8");
        readStream.pipe(response);
    } else if (request.method === 'POST') {
        let data = '';
        request.on('data', chunk => {
            data += chunk;
        });
        request.on('end', () => {
            const parsedData = JSON.parse(data);
            console.log(parsedData);
            response.writeHead(200, {
                'Content-Type': 'json'
            });
            response.end(data);
        });
    } else {
        response.statusCode = 405;
        response.end();
    }
});



const socket = io(app);

socket.on('connection', function (socket) {

    const count = socket.adapter.sids.size;

    socket.data.username = 'user_' + nanoid(4);
    
    

    console.log('New connection');
    socket.on('CLIENT_MSG', (data) => {
        socket.emit('SERVER_MSG', {msg: data.msg.split('').join('')}); 
        socket.broadcast.emit('SERVER_MSG', {msg: data.msg.split('').join('')});
    });
    socket.broadcast.emit('NEW_CONN_EVENT', { 
        msg: `${socket.data.username} client connected`,
        countMsg: count 
    });
    

    socket.on("disconnect", (reason) => {
        socket.broadcast.emit('NEW_DISCONN_EVENT', { 
            msg: `${socket.data.username} client disconnected`
        });
    });
    
});



app.listen(8085, 'localhost');