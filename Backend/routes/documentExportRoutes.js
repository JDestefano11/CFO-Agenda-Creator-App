import express from 'express';
import { 
  generateExport,
  updateExport,
  finalizeExport,
  getExport
} from '../controllers/documentExportController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Generate export content for a document
router.post('/:id/generate', generateExport);

// Update export content with user modifications
router.put('/:id/update', updateExport);

// Finalize export content for download
router.post('/:id/finalize', finalizeExport);

// Get export information for a document
router.get('/:id', getExport);

export default router;