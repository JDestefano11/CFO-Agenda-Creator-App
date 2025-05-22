import express from 'express';
import { testConnection, generateText } from '../services/openaiService.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Test OpenAI connection
router.get('/test-connection', async (req, res) => {
  try {
    const result = await testConnection();

    if (result.success) {
      res.status(200).json({
        message: result.message,
        response: result.response
      });
    } else {
      res.status(500).json({
        message: result.message
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error testing OpenAI connection',
      error: error.message
    });
  }
});

// Generate text with OpenAI (requires authentication)
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const generatedText = await generateText(prompt);

    res.status(200).json({
      message: 'Text generated successfully',
      text: generatedText
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error generating text',
      error: error.message
    });
  }
});

export default router;








