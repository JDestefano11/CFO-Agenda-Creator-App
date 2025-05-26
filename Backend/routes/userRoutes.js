import express from 'express';
import { signup, login, getProfile, updateProfile } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

export default router;