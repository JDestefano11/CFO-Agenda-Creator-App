import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  deleteProfile, 
  getDocumentHistory,
  getDocumentDetails
} from '../controllers/profileController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All profile routes require authentication
router.use(auth);

// Profile management routes
router.get('/', getProfile);
router.put('/', updateProfile);
router.delete('/', deleteProfile);

// Document history routes
router.get('/documents', getDocumentHistory);
router.get('/documents/:id', getDocumentDetails);

export default router;
