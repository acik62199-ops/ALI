const express = require('express');
const axios = require('axios');
const router = express.Router();

// ============ GET RANDOM JOKE ============
router.get('/random', async (req, res) => {
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    const { setup, punchline, type } = response.data;
    
    res.json({
      joke: `${setup} ${punchline}`,
      setup,
      punchline,
      type,
      msg: '✅ Joke fetched successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET JOKES BY TYPE ============
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const response = await axios.get(`https://official-joke-api.appspot.com/jokes/${type}/random`);
    
    if (Array.isArray(response.data)) {
      const joke = response.data[0];
      res.json({
        joke: `${joke.setup} ${joke.punchline}`,
        setup: joke.setup,
        punchline: joke.punchline,
        type: joke.type,
        msg: '✅ Joke fetched successfully'
      });
    } else {
      res.json({
        joke: `${response.data.setup} ${response.data.punchline}`,
        setup: response.data.setup,
        punchline: response.data.punchline,
        type: response.data.type,
        msg: '✅ Joke fetched successfully'
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch joke of that type' });
  }
});

// ============ GET MULTIPLE JOKES ============
router.get('/multiple/:count', async (req, res) => {
  try {
    const { count } = req.params;
    const numJokes = Math.min(parseInt(count) || 1, 10);
    
    const response = await axios.get(`https://official-joke-api.appspot.com/jokes/random/${numJokes}`);
    
    const jokes = response.data.map(joke => ({
      joke: `${joke.setup} ${joke.punchline}`,
      setup: joke.setup,
      punchline: joke.punchline,
      type: joke.type
    }));
    
    res.json({
      count: jokes.length,
      jokes,
      msg: '✅ Jokes fetched successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ GET ALL JOKE TYPES ============
router.get('/types/list', async (req, res) => {
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/types');
    
    res.json({
      types: response.data,
      count: response.data.length,
      msg: '✅ Joke types fetched successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
