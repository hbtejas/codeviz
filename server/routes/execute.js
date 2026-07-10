const express = require('express');
const router = express.Router();
const { runJavaScript } = require('../runners/jsRunner');
const { runPython } = require('../runners/pythonRunner');
const { runJava } = require('../runners/javaRunner');
const { runCCpp } = require('../runners/cCppRunner');

const MAX_CODE_SIZE = 50 * 1024; // 50KB

const SUPPORTED_LANGUAGES = ['javascript', 'python', 'java', 'cpp', 'c'];

router.post('/', async (req, res) => {
  const { code, language } = req.body;

  // ─── Validation ─────────────────────────────────────────────────────────────
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "code" field.' });
  }
  if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
    return res.status(400).json({
      error: `Invalid language. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`,
    });
  }
  if (code.length > MAX_CODE_SIZE) {
    return res.status(400).json({ error: 'Code exceeds 50KB limit.' });
  }

  // ─── Route to runner ────────────────────────────────────────────────────────
  let result;
  const startTime = Date.now();

  try {
    switch (language) {
      case 'javascript':
        result = runJavaScript(code); // sync — vm runs inline
        break;
      case 'python':
        result = await runPython(code);
        break;
      case 'java':
        result = await runJava(code);
        break;
      case 'cpp':
      case 'c':
        result = await runCCpp(code, language);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language.' });
    }
  } catch (err) {
    console.error('[Execute] Runner error:', err);
    return res.status(500).json({ error: 'Internal execution error.' });
  }

  const elapsed = Date.now() - startTime;
  console.log(`[Execute] ${language} | ${result.steps?.length || 0} steps | ${elapsed}ms`);

  return res.json({
    steps: result.steps || [],
    totalSteps: result.steps?.length || 0,
    finalOutput: result.finalOutput || '',
    error: result.error || null,
    language,
    elapsed,
  });
});

module.exports = router;
