import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import screeningRoutes from './routes/screenings.js';
import symptomsRoutes from './routes/symptoms.js';
import supportGroupRoutes from './routes/supportGroups.js';
import periodRoutes from './routes/periods.js';
import db from './db.js';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to SQLite
console.log('Connecting to SQLite database...');

const connectDB = () => {
  try {
    // SQLite uses the `db` object from db.js to interact with the database.
    // There's no async connection process like MongoDB, but we ensure the database is initialized
    console.log('SQLite database connected successfully');
    startServer();
  } catch (error) {
    console.error('SQLite connection error:', error);
    process.exit(1);
  }
};

function startServer() {
  // Routes
  app.use('/auth', authRoutes);
  app.use('/screenings', screeningRoutes);
  app.use('/symptoms', symptomsRoutes);
  app.use('/support-groups', supportGroupRoutes);
  app.use('/periods', periodRoutes);
  
  // Server listening
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Initialize SQLite database and start the server
connectDB();
