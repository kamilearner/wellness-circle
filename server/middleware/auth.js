import jwt from 'jsonwebtoken';
import { statements } from '../db.js';

export default async function auth(req, res, next) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No authentication token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      throw new Error('Invalid token format');
    }

    const user = await statements.findUserById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      message: 'Please authenticate', 
      error: error.message 
    });
  }
}