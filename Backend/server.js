import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import documentHistoryRoutes from './routes/documentHistoryRoutes.js';
import openaiRoutes from './routes/openaiRoutes.js';
import documentExportRoutes from './routes/documentExportRoutes.js';
import connectDB from './config/db.js';

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB before starting the server
connectDB().then(() => {
  // Initialize express app
  const app = express();

// CORS middleware - configure for production and development
// Use a simpler CORS configuration that allows all origins for now
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));
// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

  // Set up static file serving
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Ensure uploads directory exists and serve it statically
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadDir));

  // Serve public static files (your frontend build or static assets)
  app.use(express.static(path.join(__dirname, 'public')));

  // API Routes
  app.use('/api/users', userRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/history', documentHistoryRoutes);
  app.use('/api/openai', openaiRoutes);
  app.use('/api/export', documentExportRoutes);

  // Root route - return API info instead of trying to serve an HTML file
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'CFO Agenda Creator API is running',
      version: '1.0.0',
      endpoints: [
        '/api/users',
        '/api/profile',
        '/api/documents',
        '/api/history',
        '/api/openai',
        '/api/export'
      ],
      health: '/health'
    });
  });

  // Health check endpoint for Heroku
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
  });

  // Start server on port from environment or fallback to 5000
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});