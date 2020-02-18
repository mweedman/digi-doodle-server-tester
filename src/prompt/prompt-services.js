const promptServices = {
  getRandomPrompt(db) {
    return db('prompts')
      .select('prompt')
      .orderByRaw('RANDOM()')
      .limit(1);
  }
};

module.exports = promptServices;