// routes/documentHistoryRoutes.js
import express from 'express';
import { auth } from '../middleware/auth.js';
import { 
  getUserDocumentHistory,
  getDocumentVersionHistory,
  getHistoricalVersion,
  createHistoryEntry,
  checkDocumentHistoryStatus,
  createHistoryAfterAnalysis,
  createManualHistoryEntry
} from '../controllers/documentHistoryController.js';
import Document from '../models/Document.js';
import DocumentHistory from '../models/DocumentHistory.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get the latest history entry for each document the user has
router.get('/user-history', getUserDocumentHistory);

// Get all versions of a specific document
router.get('/document/:documentId', getDocumentVersionHistory);

// Get a specific historical version
router.get('/version/:historyId', getHistoricalVersion);

// Check if history exists for a document
router.get('/status/:documentId', checkDocumentHistoryStatus);

// Manually create a history entry for a document
router.post('/create/:documentId', createManualHistoryEntry);

// Create history entry when analysis is complete
router.post('/create-after-analysis/:documentId', createHistoryAfterAnalysis);

export default router;