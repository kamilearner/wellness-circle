import express from 'express';
import auth from '../middleware/auth.js';
import { statements } from '../db.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// Get all support groups
router.get('/', auth, async (req, res) => {
  try {
    const groups = await statements.getAllSupportGroups();
    res.json(groups);
  } catch (error) {
    console.error('Error fetching support groups:', error);
    res.status(500).json({ 
      message: 'Error fetching support groups',
      error: error.message 
    });
  }
});

// Get a specific group
router.get('/:groupId', auth, async (req, res) => {
  try {
    const group = await statements.getSupportGroupById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ 
      message: 'Error fetching group',
      error: error.message 
    });
  }
});

// Get messages for a group
router.get('/:groupId/messages', auth, async (req, res) => {
  try {
    const messages = await statements.getMessagesBySupportGroupId(req.params.groupId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      message: 'Error fetching messages',
      error: error.message 
    });
  }
});

// Post a message to a group
router.post('/:groupId/messages', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const id = randomUUID();
    
    await statements.createMessage(id, req.user.id, req.params.groupId, content);
    const message = await statements.getMessageById(id);
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ 
      message: 'Error posting message',
      error: error.message 
    });
  }
});

export default router;