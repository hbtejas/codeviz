const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { code, line, variables, event, stepIndex, totalSteps } = req.body;

    // Simple template-based generator as default/fallback
    const varsStr = Object.entries(variables || {})
      .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
      .join(', ');

    let explanation = `Currently executing line ${line}. The state is: ${varsStr || 'no variables in scope'}.`;

    if (event === 'call') {
      explanation = `Entering recursive function call at line ${line}. State: ${varsStr}`;
    } else if (event === 'return') {
      explanation = `Returning from function frame at line ${line}. Variables: ${varsStr}`;
    } else if (event === 'exception') {
      explanation = `Execution halted due to exception at line ${line}. State: ${varsStr}`;
    }

    // Proxy to OpenAI/Anthropic API if API Key is configured in environment
    if (process.env.OPENAI_API_KEY) {
      try {
        const { Configuration, OpenAIApi } = require('openai');
        const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
        const openai = new OpenAIApi(configuration);

        const prompt = `You are a DSA tutor. Explain the current step in the execution of this code snippet:
\`\`\`javascript
${code}
\`\`\`
Current execution line: ${line}
Event type: ${event}
Step index: ${stepIndex + 1} of ${totalSteps}
Variables state: ${JSON.stringify(variables)}

Write a concise, 1-2 sentence explanation of what this specific line is doing in relation to the algorithm pattern. Keep it clear, helpful and focused.`;

        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 120,
        });

        const aiText = completion.data.choices[0]?.message?.content;
        if (aiText) explanation = aiText.trim();
      } catch (err) {
        console.warn('[AI Explainer] Failed API request, using fallback:', err.message);
      }
    }

    return res.json({ explanation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
