import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import auth from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

router.post('/recommendations', auth, async (req, res) => {
  try {
    const { birthYear, city, country } = req.body;
    const age = new Date().getFullYear() - parseInt(birthYear);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `As a healthcare professional, provide personalized health screening recommendations for a ${age}-year-old person living in ${city}, ${country}. Include:
    1. Age-appropriate health screenings and their recommended frequency
    2. Specific clinics or medical centers in ${city} that offer these screenings
    3. General health maintenance tips
    Please format the response in a clear, organized way.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = response.text();

    res.json({ recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ 
      message: 'Failed to get recommendations',
      error: error.message 
    });
  }
});

export default router;