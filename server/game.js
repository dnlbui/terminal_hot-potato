// this file is for the game logic. It will be imported into server.js and used there.
// The game logic will be implemented in the startGame function, which will be called when two players have connected to the server.
// The startGame function will take in the socket.io server as an argument, and will add event listeners to the server.
// The event listeners will be responsible for handling the game logic. 


let players = [];
let currentPlayerIndex = 0;

function startGame(io) {
  // io.on is an event listener. It listens for the 'connection' event, which is emitted when a client connects to the server.
  // q: what's the different between io.on and socket.on?
  // a: io.on is an event listener for the server. socket.on is an event listener for the socket.
  io.on('connection', (socket) => {
    if(players.length > 2) {
      socket.emit('message', 'Sorry, the game is full.');
      socket.disconnect();
      return;
    }

    players.push(socket);
    
    if (players.length === 2) {
      io.emit('start');
      playRound(io);
    }

    socket.on('disconnect', () => {
      console.log( 'Player disconnected: ', socket.id);
      const playerIndex = players.findIndex((player) => player.id === socket.id);
      if(playerIndex !== -1) {
        players.splice(playerIndex, 1);
      }
    });
  });
};

function playRound(io) {
  const currentPlayer = players[currentPlayerIndex];
  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
  const nextPlayer = players[nextPlayerIndex];

  // currentPlayer.emit is an event emitter. It emits the 'message' event to the current player.
  currentPlayer.emit('message', 'You have the potato! Pass it by typing a player ID');
  nextPlayer.emit('message', 'You do not have the potato. Wait for your turn.');
  // currentPlayer is an event listener. It listens for the 'pass' event, which is emitted when a player passes the potato.
  currentPlayer.on('pass', (playerId) => {
    if (playerId === nextPlayer.id) {
      io.emit('message', `Hot potato passed from ${currentPlayer.id} to ${nextPlayer.id}!`);
      currentPlayerIndex = nextPlayerIndex;
      playRound(io);
    } else {
      currentPlayer.emit('message', `You can't pass to ${playerId}! Try again.`);
    }
  });
};

module.exports = { startGame, playRound };