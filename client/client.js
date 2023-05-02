const io = require('socket.io-client');
const readcommand = require('readcommand');

const socket = io('http://localhost:3000');

let playerList = [];

socket.on('connect', () => {
  console.log('Connected to the server!');

  // Emit the player's socket ID to the server
  socket.emit('playerId', socket.id);
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

socket.on('stop', () =>
console.log('Game stopped!'));

socket.on('players', (playerList) => {
  console.log('Connected players:', playerList);
});

socket.on('playerId', (playerId) => {
  console.log(`Your player ID is: ${playerId}`);
});

socket.on('passPrompt', (list) => {
  console.log('Choose a player to pass the potato to:');
  console.log(list?.join(', '));

  readcommand.read((err, args) => {
    if (err) {
      console.error('Error reading command: ', err);
      return;
    }

    const playerId = args[0];

    // Emit the 'pass' event to the server with the selected player ID
    socket.emit('pass', playerId);
  });
});


// const io = require('socket.io-client');
// const readline = require('readline');
// const _ = require('underscore');

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

// socket.on('stop', () => console.log('Game stopped!'));

// socket.on('players', (list) => {
//   playerList = list;
//   console.log('Connected players:', playerList);
// });

// socket.on('playerId', (playerId) => {
//   console.log(`Your player ID is: ${playerId}`);
// });

// socket.on('passPrompt', (list) => {
//   console.log('Choose a player to pass the potato to:');
//   if (list) {
//     console.log(list.join(', '));

//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });

//     rl.question('> ', (playerId) => {
//       rl.close();
//       // Emit the 'pass' event to the server with the selected player ID
//       socket.emit('pass', playerId);
//     });
//   }
// });

// function _autocomplete(args, callback) {
//   if (_.isEmpty(args)) {
//     return callback(null, playerList);
//   }

//   let replacements = [];
//   const lastArg = _.last(args);
//   if (args.length === 1) {
//     replacements = _.filter(playerList, function (player) {
//       return player.indexOf(lastArg) === 0;
//     });
//   }

//   return callback(null, replacements);
// }