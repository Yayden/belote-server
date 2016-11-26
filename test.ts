import * as express from "express";
import * as http from "http";
import * as sio from "socket.io";

var app = express();
var server = http.createServer(app);
var io = sio.listen(server);

//Todo handle an array of socket

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html')
});

io.sockets.on('connection', function (socket, pseudo) {
    console.log('connection');
    
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveauClient', function(data) {
        console.log('nouveauClient ', data );
        socket['pseudo'] = data.pseudo;
        socket.emit('nouveauClient', {pseudo:pseudo});
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (data) {
        console.log('message ' , data.message);
        socket['message'] = data.message;
        socket.emit('message', {pseudo: socket['pseudo'], message: socket['message']});
    }); 
});

server.listen(8080);