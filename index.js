const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var users = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {  

  socket.on('entrar', (nickname) => {
    console.log(nickname + ' Conectou-se!');
    var userObj = {id: socket.id, nickname: nickname, typing: false}
    users.push(userObj)    
    socket.broadcast.emit('user-connected', nickname + ' Conectou-se!');
    console.log(users)
  }); 

  socket.on('chat message', (msg) => {
    console.log(msg.nick + ": " + msg.msg);
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('typing', (isTyping) =>{   
    users.map(user => {
      console.log(user)      
      if(user.id === socket.id){
        user.typing = isTyping
      }      
    })
    console.log(users)  
    usersTyping = users.filter(user => user.typing === true)
    socket.broadcast.emit('users typing', (usersTyping))
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    users = users.filter(user => user.id !== socket.id)
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});