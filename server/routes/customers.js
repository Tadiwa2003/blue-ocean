import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addAddress,
  getCustomerStats,
} from '../controllers/customerController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Customer statistics
router.get('/stores/:storeId/stats', getCustomerStats);

// Customer CRUD
router.get('/stores/:storeId/customers', getCustomers);
router.get('/stores/:storeId/customers/:customerId', getCustomer);
router.post('/stores/:storeId/customers', createCustomer);
router.put('/stores/:storeId/customers/:customerId', updateCustomer);
router.delete('/stores/:storeId/customers/:customerId', deleteCustomer);

// Customer addresses
router.post('/stores/:storeId/customers/:customerId/addresses', addAddress);

export default router;

