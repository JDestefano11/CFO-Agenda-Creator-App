// routes/documentHistoryRoutes.js
import express from 'express';
import { 
  getUserDocumentHistory,
  getDocumentVersionHistory
} from '../controllers/documentHistoryController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all document history for the user (for history sidebar)
router.get('/user-history', getUserDocumentHistory);

// Get version history for a specific document
router.get('/document/:documentId', getDocumentVersionHistory);

export default router;