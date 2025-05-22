import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Your OpenRouter API key (LLaMA backend)
const OPENROUTER_API_KEY = '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';

// ✅ POST endpoint for LLaMA chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid or missing "messages" array.' });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3-8b-instruct', // You can change this to another supported model
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({
      message: response.data.choices[0].message,
    });
  } catch (error) {
    console.error('OpenRouter error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Something went wrong with OpenRouter',
      details: error.response?.data || error.message,
    });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ LLaMA (via OpenRouter) backend running at http://localhost:${PORT}`);
});
