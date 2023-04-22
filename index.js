const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  
  socket.on('entrar', (nickname) => {
    console.log(nickname + ' Conectou-se!');
    socket.broadcast.emit('user-connected', nickname + ' Conectou-se!');
  }); 

  socket.on('chat message', (msg) => {
    console.log(msg.nick + ": " + msg.msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});