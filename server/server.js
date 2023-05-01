const io = require('socket.io')();
const { startGame } = require('./game');
const { PORT } = require('../client/constants');

// q: Does 'io.on' emmit the 'connection' event?
// a: Yes, it does. It is an event listener for the 'connection' event.
// a: The 'connection' event is emitted when a client connects to the server.

// q: Where is the server instantiated?
// a: The server is instantiated in the client\client.js file.
// q: What is the difference between the server and the socket?     
// a: The server is the server. The socket is the connection between the server and the client.
io.on('connection', (socket) => {
  console.log('New player connected: ', socket.id);

  socket.on('disconnect', () => {
    console.log('Player disconnected: ', socket.id);
  });
});

startGame(io);

io.listen(PORT);
console.log(`Server listening on port ${PORT}`);