const io = require('socket.io-client');
const read = require('readcommand');
const { SERVER_URL } = require('./constants');
// io is the server with an argument of the server URL.This establishes the connection between the server and the client.
const socket = io(SERVER_URL);

socket.on('start', () => {
  console.log('Game started!');
});
// q: when does the server emit the 'message' event?
// a: The server emits the 'message' event when the player passes the potato to another player.
socket.on('message', (message) => {
  console.log(message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
  // read.close() closes the readcommand module.
  // q: what happens when read.close() is called?
  // a: The readcommand module is closed.
  read.close();
});

read.on('line', (input) => {
  socket.emit('pass', input);
});

read.on('close', () => {
  socket.close();
});

read.start();

socket.on('connect', () => {
  console.log('Connected to server.');
  read.prompt('> ');
});

socket.on('playerIdPrompt', () => {
  read.prompt('Enter your player ID: ');
});

socket.on('invalidPlayerId', () => {
  console.log('Invalid player ID. Try again.');
  read.prompt('Enter your player ID: ');
});
// q: when is 'line' emitted?
// a: 'line' is emitted when the user presses the enter key.
// q: what is the difference between 'line' and 'close'?
// a: 'line' is emitted when the user presses the enter key. 'close' is emitted when the user presses ctrl + c.
read.on('line', (input) => {
  if(!socket.playerId) {
    socket.emit('playerId', input);
    socket.playerId = input;
    console.log('Your player ID is: ', input);
    read.prompt('> ');
  } else {
    socket.emit('pass', input);
  }
});


const playerId = 'Player1';
socket.emit('playerId', playerId);