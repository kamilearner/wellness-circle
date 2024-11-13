import express from 'express';
import auth from '../middleware/auth.js';
import { statements } from '../db.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// Add or update period entry
router.post('/', auth, async (req, res) => {
  try {
    const { date, notes } = req.body;
    const id = randomUUID();
    
    await statements.upsertPeriod(id, req.user.id, date, notes);
    const periods = await statements.getPeriodsByUserId(req.user.id);
    
    res.status(201).json(periods);
  } catch (error) {
    console.error('Error adding/updating period entry:', error);
    res.status(500).json({ 
      message: 'Error adding/updating period entry',
      error: error.message 
    });
  }
});

// Get all period entries
router.get('/', auth, async (req, res) => {
  try {
    const periods = await statements.getPeriodsByUserId(req.user.id);
    res.json(periods);
  } catch (error) {
    console.error('Error fetching period entries:', error);
    res.status(500).json({ 
      message: 'Error fetching period entries',
      error: error.message 
    });
  }
});

// Add health reminder
router.post('/reminders', auth, async (req, res) => {
  try {
    const { name, frequency, nextDate } = req.body;
    const id = randomUUID();
    
    await statements.createReminder(id, req.user.id, name, frequency, nextDate);
    const reminders = await statements.getRemindersByUserId(req.user.id);
    
    res.status(201).json(reminders);
  } catch (error) {
    console.error('Error adding health reminder:', error);
    res.status(500).json({ 
      message: 'Error adding health reminder',
      error: error.message 
    });
  }
});

// Get all health reminders
router.get('/reminders', auth, async (req, res) => {
  try {
    const reminders = await statements.getRemindersByUserId(req.user.id);
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching health reminders:', error);
    res.status(500).json({ 
      message: 'Error fetching health reminders',
      error: error.message 
    });
  }
});

export default router;