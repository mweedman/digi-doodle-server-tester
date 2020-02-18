const GameServices = require('./game-services');
const PromptServices = require('../prompt/prompt-services');

const GameHelpers = {
  async startGame(db, gameId) {
    const players = await GameServices.getPlayers(db, gameId);
    
    const index = Math.floor(Math.random() * players.length);
    const firstDrawer = players[index].player_id;
    
    await GameServices.updateGame(db, gameId, {
      status: 'standby',
      current_drawer: firstDrawer
    });

    const updatedGame = await GameServices.getGame(db, gameId);
    return updatedGame;
  },

  async startTurn(db, gameId) {
    const prompt = await PromptServices.getRandomPrompt(db);
    console.log(prompt[0].prompt);
    await GameServices.updateGame(db, gameId, {
      status: 'drawing',
      current_answer: prompt[0].prompt
    });
  },

  async endTurn(db, gameId) {
    const game = await GameServices.getGame(db, gameId);
    const players = await GameServices.getPlayers(db, gameId);
    
    const currentDrawer = players.filter(p => p.player_id === game[0].current_drawer);
    const nextDrawer = currentDrawer[0].next_player;
    
    await GameServices.updateGame(db, gameId, {
      status: 'standby', 
      current_drawer: nextDrawer,
      current_answer: null
    });
  },

  async checkGuess(db, gameId, guess) { 
    let answer = await GameServices.getGame(db, gameId);
    answer = answer[0].current_answer;
    console.log(answer);
    if (guess.toLowerCase().trim() === answer.toLowerCase().trim()) {
      return true;
    } else {
      return false;
    }
  },

  async givePoint(db, gameId, playerId, numOfPoints) {
    const player = 
      await db('game_players')
        .where({
          game_id: gameId,
          player_id: playerId
        })
        .select('score');
    const score = player[0].score;

    await db('game_players')
      .where({
        game_id: gameId,
        player_id: playerId
      })
      .update('score', score + numOfPoints);
  },

  async checkForWinner(db, gameId) {
    const players = await GameServices.getPlayers(db, gameId);
    let highestScore = Math.max(...players.map(p => p.score));
    const winningPlayers = players.filter(p => p.score === highestScore).map(e => e.username);
    console.log(winningPlayers.join('and'));
    if (winningPlayers.length === 0 || highestScore < 15) {
      return false;
    } else {
      return {
        winner: winningPlayers.join(' and '),
        score: highestScore
      };
    }
  }
};

module.exports = GameHelpers;