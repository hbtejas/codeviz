const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const Snippet = require('../models/Snippet');

// In-memory fallback when MongoDB is unavailable
const memStore = new Map();

function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

// POST /api/snippets — save snippet, return slug
router.post('/', async (req, res) => {
  const { code, language, title, sessionId } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'code and language are required.' });
  }

  const slug = nanoid(8); // e.g. "x7k2p9ab"

  const data = {
    slug,
    code: code.slice(0, 100000),
    language,
    title: (title || 'Untitled Snippet').slice(0, 200),
    sessionId: sessionId || null,
  };

  if (isMongoReady()) {
    try {
      await Snippet.create(data);
    } catch (err) {
      console.error('[Snippets] DB write error:', err.message);
      return res.status(500).json({ error: 'Failed to save snippet.' });
    }
  } else {
    memStore.set(slug, { ...data, createdAt: new Date() });
    if (memStore.size > 500) {
      // Evict oldest entries if memory store gets too large
      const first = memStore.keys().next().value;
      memStore.delete(first);
    }
  }

  return res.json({ slug, shareUrl: `/viz/${slug}` });
});

// GET /api/snippets/:slug — fetch snippet by slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  if (isMongoReady()) {
    try {
      const snippet = await Snippet.findOneAndUpdate(
        { slug },
        { $inc: { viewCount: 1 } },
        { new: true }
      );
      if (!snippet) return res.status(404).json({ error: 'Snippet not found.' });
      return res.json(snippet);
    } catch (err) {
      return res.status(500).json({ error: 'DB error.' });
    }
  } else {
    const snippet = memStore.get(slug);
    if (!snippet) return res.status(404).json({ error: 'Snippet not found.' });
    return res.json(snippet);
  }
});

// GET /api/snippets/session/:sessionId — list recent snippets for this session
router.get('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (isMongoReady()) {
    try {
      const snippets = await Snippet.find({ sessionId })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('slug title language createdAt');
      return res.json(snippets);
    } catch (err) {
      return res.status(500).json({ error: 'DB error.' });
    }
  } else {
    const snippets = [];
    for (const [, v] of memStore) {
      if (v.sessionId === sessionId) snippets.push(v);
    }
    snippets.sort((a, b) => b.createdAt - a.createdAt);
    return res.json(snippets.slice(0, 20));
  }
});

module.exports = router;
