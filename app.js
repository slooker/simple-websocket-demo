// app.js
const express = require('express');
const app = express();
const fs = require('fs')
const https = require('https')

const options = {
  key: fs.readFileSync('./cert/localdev.stronghold.space/key.pem'),
  cert: fs.readFileSync('./cert/localdev.stronghold.space/cert.pem'),
  ca: fs.readFileSync('./cert/minica.pem'),
}
const server = https.createServer(options, app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

    client.on('messages', function(data) {
        console.log('client got a message: ', data)
        client.emit('broad', data);
        client.broadcast.emit('broad',data);
    });

});

server.listen(9000);
