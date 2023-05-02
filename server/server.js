const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { PORT } = require('../constants');
const { startGame } = require('./game');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
  res.send('Server is running.');
});

io.on('connection', (socket) => {
  console.log('A player connected: ', socket.id);

  socket.on('playerId', (playerId) => {
    console.log(`Player ${playerId} connected.`);
  });

  socket.on('pass', (playerId) => {
    console.log(`Player ${socket.id} passed the potato to ${playerId}.`);
  });

  socket.on('disconnect', () => {
    console.log('A player disconnected: ', socket.id);
  });
});

startGame(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});