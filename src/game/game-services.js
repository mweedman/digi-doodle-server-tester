const uuid = require('uuid');

const GameServices = {
  createGame(db) {
    const game = {
      id: uuid(),
      current_drawer: null,
      current_answer: null,
      time_limit: 6000
    };

    return db
      .insert(game)
      .into('game')
      .returning('*');
  },

  getAllGames(db) {
    return db
      .from('game')
      .select('*');
  },

  getGame(db, gameId) {
    return db
      .from('game')
      .select('*')
      .where('id', gameId);
  },

  getPlayers(db, gameId) {
    return db
      .from('game_players')
      .select('*')
      .where('game_id', gameId);
  },

  getCurrentAnswer(db, gameId) {
    return db
      .from('game')
      .select('current_answer')
      .where('id', gameId);
  },

  async addGamePlayer(db, gameId, playerId, username){
    console.log(gameId, playerId, username);
    const players = await this.getPlayers(db, gameId);
    let gamePlayer;

    if (players.length < 1) {
      gamePlayer = {
        player_id: playerId,
        username: username,
        game_id: gameId,
        score: 0,
        next_player: playerId
      };
    } else {
      gamePlayer = {
        player_id: playerId,
        username: username,
        game_id: gameId,
        score: 0,
        next_player: players[0].next_player
      };

      await db('game_players')
        .where('player_id', players[0].player_id)
        .update({
          next_player: playerId
        });
    }

    return db
      .insert(gamePlayer)
      .into('game_players');
  },

  postGuess(db, gameId, playerId, guess) {
    let guessToPost = {
      guess: guess,
      player_id: playerId,
      game_id: gameId
    };

    return db
      .insert(guessToPost)
      .into('guesses')
      .returning('*');
  },

  deleteGame(db, gameId) {
    return db
      .from('game')
      .where('id', gameId)
      .delete();
  },

  updateGame(db, gameId, data){
    return db('game')
      .where('id', gameId)
      .update(data);
  }
  
};

module.exports = GameServices;