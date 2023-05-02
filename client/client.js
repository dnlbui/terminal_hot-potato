const io = require('socket.io-client');
const readcommand = require('readcommand');

const socket = io('http://localhost:3000');

let playerList = [];
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

socket.on('passPrompt', (list) => {
  readcommand.read((err, args) => {
    if (err) {
      console.error('Error reading command: ', err);
      return;
    }

    const playerIndex = parseInt(args[0], 10);
    if (isNaN(playerIndex) || playerIndex < 1 || playerIndex > playerList.length) {
      console.error('Invalid player index!');
      return;
    }

    const playerId = playerList[playerIndex-1];

    // Emit the 'pass' event to the server with the selected player ID
    socket.emit('pass', playerId);
  });
});

// const io = require('socket.io-client');
// const readcommand = require('readcommand');

// const socket = io('http://localhost:3000');

// let playerList = [];

// socket.on('connect', () => {
//   console.log('Connected to the server!');

//   // Emit the player's socket ID to the server
//   socket.emit('playerId', socket.id);
// });

// socket.on('disconnect', () => {
//   console.log('Disconnected from the server!');
// });

// socket.on('message', (message) => {
//   console.log(message);
// });

// socket.on('start', () => {
//   console.log('Game started!');
// });

// socket.on('stop', () =>
// console.log('Game stopped!'));

// socket.on('players', (playerList) => {
//   console.log('Connected players:', playerList);
// });

// socket.on('playerId', (playerId) => {
//   console.log(`Your player ID is: ${playerId}`);
// });

// socket.on('passPrompt', (list) => {

//   readcommand.read((err, args) => {
//     if (err) {
//       console.error('Error reading command: ', err);
//       return;
//     }

//     const playerId = args[0];

//     // Emit the 'pass' event to the server with the selected player ID
//     socket.emit('pass', playerId);
//   });
// });