import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import auth from '../middleware/auth.js';
import { statements } from '../db.js';

const router = express.Router();

router.post('/check', auth, async (req, res) => {
  try {
    const { symptoms } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Please provide a valid description of your symptoms'
      });
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('Missing GOOGLE_API_KEY in environment variables');
      return res.status(500).json({ 
        message: 'Server configuration error: Missing API key'
      });
    }

    // Verify user exists in database
    const user = await statements.findUserById(userId);
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found'
      });
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create prompt
    const prompt = `As a healthcare professional, analyze the following symptoms and provide:
    1. Possible causes or conditions
    2. Recommended self-care measures and lifestyle changes
    3. Warning signs that would require immediate medical attention
    4. General advice for symptom management

    Patient's symptoms:
    ${symptoms.trim()}

    Please format the response in clear sections and maintain a professional, informative tone. Include a reminder that this is AI-generated advice and should not replace professional medical consultation.`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const diagnosis = response.text();

    if (!diagnosis) {
      throw new Error('Failed to generate analysis');
    }

    res.json({ diagnosis });
  } catch (error) {
    console.error('Symptoms analysis error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to analyze symptoms'
    });
  }
});

export default router;