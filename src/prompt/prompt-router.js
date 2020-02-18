const express = require('express');
const PromptServices = require('./prompt-services');

const PromptRouter = express.Router();

PromptRouter
  .get('/', async (req, res, next) => {
    try {
      const prompt = await PromptServices.getRandomPrompt(req.app.get('db'));
      res.send(prompt[0]);
    } catch(error) {
      next(error);
    }
  });

module.exports = PromptRouter;