require('dotenv').config();
const app = require('./app');
const knex = require('knex');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const { PORT, DATABASE_URL } = require('./config');
const GameServices = require('./game/game-services');
const GameHelpers = require('./game/game-helpers');


const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.set('db', db);

io
  .on('connection', (socket) => {
    socket.on('sendRoom', (room) => {

      socket.join(room);
      io.to(room).emit('chat message', `joined room ${room}`);

      // when a player submits a guess
      socket.on('guess', (guess) => {
        console.log('guess here: ', guess);
        io.to(room).emit('chat response', { player: guess.player, message: guess.message });
        //function to check guess?
        socket.emit('announcement', `got it correct. it's a ${guess}`);
      });

      // updating canvas
      socket.on('sketch', (data) => {
        console.log(data.objects);
        socket.to(room).broadcast.emit('sketch return', data);
      });

      // send a game when client requests
      socket.on('get game', async () => {
        const game = await GameHelpers.startGame(db, room);
        io.to(room).emit('send game', game);
      });

      // starting the game
      socket.on('start check', async () => {
        const players = await GameServices.getPlayers(db, room);
        const numPlayers = players.length;
        if (numPlayers === 2) {
          io.to(room).emit('send game', game);
          const game = await GameHelpers.startGame(db, room);
        }
      });
    });

    // submitting chat without being able to guess the answer
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });

  });

module.exports = io;

server.listen(PORT, function() {
  console.log(`Server listening at http://localhost:${PORT}`);
});
  