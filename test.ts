// This is the server-side file of our mobile remote controller app.
// It initializes socket.io and a new express instance.
// Start it by running 'node app.js' from your terminal.
import * as express from "express";
var app = express();
import * as http from "http";
var server = http.createServer(app);
import * as sio from "socket.io";
var io = sio.listen(server);

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html')
});

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        socket.broadcast.emit('message', {pseudo: pseudo, message: message});
    }); 
});
server.listen(8080);