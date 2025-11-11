import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import * as storefrontController from '../controllers/storefrontController.js';
import { body } from 'express-validator';

const router = express.Router();

// Public route for published storefronts by slug (no auth required)
router.get('/slug/:slug', storefrontController.getStorefrontBySlug);

// All other routes require authentication
router.use(authenticateToken);

// Get user's storefronts
router.get('/', storefrontController.getUserStorefronts);

// Get storefront by ID
router.get('/:id', storefrontController.getStorefrontById);

// Create storefront (requires subscription)
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Storefront name is required'),
    body('type').isIn(['products', 'spa', 'mixed']).withMessage('Invalid storefront type'),
  ],
  storefrontController.createStorefront
);

// Update storefront
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Storefront name cannot be empty'),
  ],
  storefrontController.updateStorefront
);

// Delete storefront
router.delete('/:id', storefrontController.deleteStorefront);

// Publish storefront
router.post('/:id/publish', storefrontController.publishStorefront);

// Unpublish storefront
router.post('/:id/unpublish', storefrontController.unpublishStorefront);

export default router;

