let players = [];
let currentPlayerIndex = 0;
let potatoTimer;

function emitPlayerList(io) {
  const playerList = players.map((player) => player.id);
  io.emit('players', playerList);
  // emit to only the player who just joined
  players[players.length - 1].emit('playersNumberInPlayers', players.indexOf(players[players.length - 1]) + 1);
}

function startGame(io) {
  io.on('connection', (socket) => {
    console.log('A player connected: ', socket.id);

    // Emit the current player's socket ID to the client
    socket.emit('playerId', socket.id);
   

    // Add the player to the players array
    players.push(socket);
    emitPlayerList(io);

    if (players.length > 4) {
      socket.emit('message', 'There are already four players connected. Please wait for the next game.');
      socket.disconnect();
      return;
    }

    if (players.length === 4) {
      // Start the game once four players have joined
      io.emit('start');
      startRound(io);
    }

    socket.on('pass', (playerId) => {
      const currentPlayer = players[currentPlayerIndex] || {} ;

      if (playerId === currentPlayer.id) {
        // The player passed the potato to themselves
        socket.emit('message', 'You cannot pass the potato to yourself! Try again.');
        socket.emit('playersTurn', true);
        socket.emit('passPrompt');
      } else if (players.map((player) => player.id).includes(playerId)) {
        // The player passed the potato to another player
        io.emit('message', `${socket.id} passed the potato to ${playerId}!`);
        currentPlayerIndex = players.findIndex((player) => player.id === playerId);
        nextPlayerTurn();
      } else {
        // The player passed the potato to an invalid player
        socket.emit('message', 'Invalid player ID! Try again.');
        socket.emit('passPrompt');
      }
    });

    socket.on('disconnect', () => {
      console.log('A player disconnected: ', socket.id);
      // broadcast to all players that a player disconnected
      socket.broadcast.emit('message', `${socket.id} disconnected!`);

      // Remove the player from the players array
      players = players.filter((player) => player.id !== socket.id);
      emitPlayerList(io);

      if (players.length < 2) {
        // Stop the game if there are less than two players remaining
        stopGame(io);
      } else if (socket.id === players[currentPlayerIndex].id) {
        // The disconnected player loses
        io.emit('message', `${socket.id} disconnected! ${players[(currentPlayerIndex + 1) % players.length].id} wins!`);
        stopGame(io);
      }
    });
  });
}

function startRound(io) {
  // Pick a random player to start the round
  currentPlayerIndex = Math.floor(Math.random() * players.length);
  const currentPlayer = players[currentPlayerIndex];

  io.emit('message', `Game started! ${currentPlayer.id} has the potato. Pass it by typing a player ID.`);
  currentPlayer.emit('message', 'You have the potato!');
  currentPlayer.emit('passPrompt');
  startPotatoTimer(io);
}

function nextPlayerTurn() {
  const currentPlayer = players[currentPlayerIndex];
  
  currentPlayer.emit('playersTurn', true);
  currentPlayer.emit('message', 'You have the potato! Pass it by typing a player ID.');
  currentPlayer.emit('passPrompt');
}

function startPotatoTimer(io) {
  // Start a timer for passing the potato
  potatoTimer = setTimeout(() => {
    stopGame(io);
  }, 30000);
}

function stopGame(io) {
  const currentPlayer = players[currentPlayerIndex];
  const currentPlayerId = currentPlayer.id;

  io.emit('message', `Time's up! ${currentPlayerId} dropped the potato and lost!`);
  players.forEach((player) => {
    if (player.id === currentPlayerId) {
      player.emit('message', 'You lost!');
    } else {
      player.emit('message', 'You won!');
    }
  });

  players = [];
  currentPlayerIndex = 0;
  clearTimeout(potatoTimer);

  io.emit('stop');
}

module.exports = { startGame };

