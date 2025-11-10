import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getCurrentSubscription, createSubscription, updateSubscription, cancelSubscription } from '../controllers/subscriptionController.js';

const router = express.Router();

// Get current user's subscription
router.get('/current', authenticateToken, getCurrentSubscription);

// Create new subscription
router.post('/', authenticateToken, createSubscription);

// Update subscription (upgrade/downgrade)
router.put('/:id', authenticateToken, updateSubscription);

// Cancel subscription
router.delete('/:id', authenticateToken, cancelSubscription);

export default router;

