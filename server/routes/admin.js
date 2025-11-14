import express from 'express';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Contact from '../models/Contact.js';
import Subscription from '../models/Subscription.js';
import Storefront from '../models/Storefront.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin/owner role
router.use(authenticateToken);
router.use(requireRole('admin', 'owner'));

// Get database overview/stats
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments({}),
      bookings: await Booking.countDocuments({}),
      services: await Service.countDocuments({}),
      products: await Product.countDocuments({}),
      orders: await Order.countDocuments({}),
      contacts: await Contact.countDocuments({}),
      subscriptions: await Subscription.countDocuments({}),
      storefronts: await Storefront.countDocuments({}),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch database stats',
    });
  }
});

// Get all data from a collection
router.get('/collection/:collectionName', async (req, res) => {
  try {
    const { collectionName } = req.params;
    const { limit = 100, skip = 0 } = req.query;

    let Model;
    switch (collectionName.toLowerCase()) {
      case 'users':
        Model = User;
        break;
      case 'bookings':
        Model = Booking;
        break;
      case 'services':
        Model = Service;
        break;
      case 'products':
        Model = Product;
        break;
      case 'orders':
        Model = Order;
        break;
      case 'contacts':
        Model = Contact;
        break;
      case 'subscriptions':
        Model = Subscription;
        break;
      case 'storefronts':
        Model = Storefront;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Unknown collection: ${collectionName}`,
        });
    }

    const items = await Model.find({})
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 })
      .lean();

    const total = await Model.countDocuments({});

    res.json({
      success: true,
      data: {
        items,
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
    });
  } catch (error) {
    console.error(`Error fetching ${req.params.collectionName}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch ${req.params.collectionName}`,
    });
  }
});

export default router;

