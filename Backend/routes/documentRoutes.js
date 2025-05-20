import express from 'express';
import { 
  uploadMiddleware, 
  uploadDocument, 
  deleteDocument, 
  getUserDocuments,
  getDocumentAnalysis,
  analyzeDocument
} from '../controllers/documentController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all documents for the current user
router.get('/', getUserDocuments);

// Upload a new document
router.post('/upload', uploadMiddleware, uploadDocument);

// Delete a document (remove if wrong document was uploaded)
router.delete('/:id', deleteDocument);

// Get Document Analysis
router.get('/:id/analysis', getDocumentAnalysis);

// Manually Trigger analysis for a document
router.post('/:id/analyze', analyzeDocument);

export default router;