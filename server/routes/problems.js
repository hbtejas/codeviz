const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const { ALL_SEED_PROBLEMS: SEED_PROBLEMS } = require('../data/seedProblems');

// Helper to check if mongoose is connected
function isDbConnected() {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
}

// GET all problems
router.get('/', async (req, res) => {
  try {
    const { pattern, topic, difficulty } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (pattern) query.patterns = pattern;
      if (topic) query.topicSlug = topic;
      if (difficulty) query.difficulty = difficulty;

      const problems = await Problem.find(query).sort({ leetcodeNumber: 1 });
      return res.json(problems);
    } else {
      // Memory fallback
      let list = [...SEED_PROBLEMS];
      if (pattern) {
        list = list.filter(p => p.patterns.includes(pattern));
      }
      if (topic) {
        list = list.filter(p => p.topicSlug === topic);
      }
      if (difficulty) {
        list = list.filter(p => p.difficulty === difficulty);
      }
      return res.json(list);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single problem
router.get('/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;

    if (isDbConnected()) {
      const problem = await Problem.findOne({ problemId });
      if (!problem) return res.status(404).json({ error: 'Problem not found' });
      return res.json(problem);
    } else {
      // Memory fallback
      const problem = SEED_PROBLEMS.find(p => p.problemId === problemId);
      if (!problem) return res.status(404).json({ error: 'Problem not found' });
      return res.json(problem);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
