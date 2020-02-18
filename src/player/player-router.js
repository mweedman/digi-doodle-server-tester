const express = require('express');
const PlayerServices = require('./player-services');

const PlayerRouter = express.Router();
const BodyParser = express.json();

PlayerRouter
  .use(BodyParser);

PlayerRouter
  .post('/', async (req, res, next) => {
    const userName = req.body.username;
  
    if (!userName){
      return res.status(404).json({
        error: 'Request must include a username'
      });
    }
    try{
      let uniqueCheck = await PlayerServices.checkForUsername(req.app.get('db'), userName);

      if (uniqueCheck[0] !== undefined) {
        return res.status(400).json({ error: 'Duplicate usernames are not allowed' });
      }

      const playerId = await PlayerServices.createPlayer(
        req.app.get('db'),
        userName
      );
      console.log('playerId response: ', playerId);
      res.send(playerId);

    } catch(error) {
      next(error);
    }
  });

module.exports = PlayerRouter;