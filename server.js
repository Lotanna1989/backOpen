import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const app = express();

// CORS config to allow localhost:3000 and Postman (no origin)
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman or server requests
    if (origin.includes('localhost:3000')) return callback(null, true);
    callback(new Error('Not allowed by CORS'), false);
  },
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages) return res.status(400).json({ error: 'Messages are required' });

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or 'gpt-3.5-turbo'
      messages,
    });

    // Send only assistant message back
    res.json({ message: completion.choices[0].message });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
