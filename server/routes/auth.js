import express from 'express';
import { signUp, signIn, signOut, getCurrentUser, requestPasswordReset } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateSignUp, validateSignIn } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/signup', validateSignUp, signUp);
router.post('/signin', validateSignIn, signIn);
router.post('/password-reset', requestPasswordReset);

// Protected routes
router.post('/signout', authenticateToken, signOut);
router.get('/me', authenticateToken, getCurrentUser);

export default router;

