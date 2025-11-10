import { saveOrder, getOrdersByUserId, getOrderById as getOrder, updateOrder } from '../data/orders.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingInfo, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required',
      });
    }

    if (!shippingInfo) {
      return res.status(400).json({
        success: false,
        message: 'Shipping information is required',
      });
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid total amount is required',
      });
    }

    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.id,
      orderNumber: `BO-${Date.now()}`,
      items,
      shippingInfo,
      total: parseFloat(total),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveOrder(order);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order. Please try again.',
    });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = getOrdersByUserId(req.user.id);

    res.json({
      success: true,
      data: {
        orders,
      },
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders.',
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = getOrder(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order or is admin
    if (order.userId !== req.user.id && !['admin', 'owner'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order.',
    });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = getOrder(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    updateOrder(order);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order,
      },
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status.',
    });
  }
};

