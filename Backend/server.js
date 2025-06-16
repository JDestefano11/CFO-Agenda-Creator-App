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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  // Add your production frontend URL here when deployed
  // 'https://your-frontend-app.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
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

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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