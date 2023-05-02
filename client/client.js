const io = require('socket.io-client');
const readcommand = require('readcommand');

const socket = io('http://localhost:3000');

let playerList = [];
let isPlayerTurn = true;

socket.on('connect', () => {
  console.log(`Connected to the server! Your ID is ${socket.id}`);
});

socket.on('playersNumberInPlayers', (playerNumber) => {
  console.log(`You are player number ${playerNumber}`);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server!');
});

socket.on('message', (message) => {
  console.log(message);
});

socket.on('start', () => {
  console.log('Game started!');
});

socket.on('stop', () => console.log('Game stopped!'));

socket.on('players', (list) => {
  playerList = list;
  if (playerList.length === 4) {
    console.log('Connected players:');
    playerList.forEach((player, index) => {
      console.log(`${index + 1}. ${player}`);
    });
  }
});

socket.on('playersTurn', (isTurn) => {
  isPlayerTurn = isTurn;
});

socket.on('passPrompt', (list) => {
  if (!isPlayerTurn) {
    return;
  }

  readcommand.read((err, args) => {
    if (err) {
      console.error('Error reading command: ', err);
      return;
    }

    const playerIndex = parseInt(args[0], 10);
    const playerId = playerList[playerIndex-1] || {};

    socket.emit('pass', playerId);

    // Player's turn has ended
    isPlayerTurn = false;
  });
});
