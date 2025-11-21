import mongoose from 'mongoose';
import Customer from '../models/Customer.js';
import OrderEnhanced from '../models/OrderEnhanced.js';

/**
 * Customer Controller - Shopify-style customer management
 */

// Get all customers for a store
export const getCustomers = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 20, search, tags, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = { storeId };
    
    // Search filter
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }
    
    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const customers = await Customer.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();
    
    const total = await Customer.countDocuments(query);
    
    res.json({
      success: true,
      data: customers,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message,
    });
  }
};

// Get single customer
export const getCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { storeId } = req.params;
    
    const customer = await Customer.findOne({
      _id: customerId,
      storeId,
    }).lean();
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    
    // Get customer orders
    const orders = await OrderEnhanced.find({
      customerId,
      storeId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    res.json({
      success: true,
      data: {
        ...customer,
        recentOrders: orders,
      },
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer',
      error: error.message,
    });
  }
};

// Create customer
export const createCustomer = async (req, res) => {
  try {
    const { storeId } = req.params;
    const customerData = {
      ...req.body,
      storeId,
    };
    
    // Check if customer with email already exists
    const existing = await Customer.findOne({
      storeId,
      email: customerData.email,
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists',
      });
    }
    
    const customer = new Customer(customerData);
    await customer.save();
    
    res.status(201).json({
      success: true,
      data: customer,
      message: 'Customer created successfully',
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message,
    });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const { customerId, storeId } = req.params;
    
    const customer = await Customer.findOneAndUpdate(
      { _id: customerId, storeId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    
    res.json({
      success: true,
      data: customer,
      message: 'Customer updated successfully',
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      error: error.message,
    });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const { customerId, storeId } = req.params;
    
    const customer = await Customer.findOneAndDelete({
      _id: customerId,
      storeId,
    });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: error.message,
    });
  }
};

// Add address to customer
export const addAddress = async (req, res) => {
  try {
    const { customerId, storeId } = req.params;
    
    const customer = await Customer.findOne({
      _id: customerId,
      storeId,
    });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    
    await customer.addAddress(req.body);
    
    res.json({
      success: true,
      data: customer,
      message: 'Address added successfully',
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: error.message,
    });
  }
};

// Get customer statistics
export const getCustomerStats = async (req, res) => {
  try {
    const { storeId } = req.params;
    
    const totalCustomers = await Customer.countDocuments({ storeId });
    const totalSpent = await Customer.aggregate([
      { $match: { storeId: mongoose.Types.ObjectId(storeId) } },
      { $group: { _id: null, total: { $sum: '$totalSpent' } } },
    ]);
    
    const averageOrderValue = await Customer.aggregate([
      { $match: { storeId: mongoose.Types.ObjectId(storeId) } },
      { $group: { _id: null, avg: { $avg: '$averageOrderValue' } } },
    ]);
    
    res.json({
      success: true,
      data: {
        totalCustomers,
        totalRevenue: totalSpent[0]?.total || 0,
        averageOrderValue: averageOrderValue[0]?.avg || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer statistics',
      error: error.message,
    });
  }
};

