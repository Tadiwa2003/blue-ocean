import { createOrder as createOrderData, getOrdersByUserId, getOrderById as getOrder, updateOrder } from '../db/orders.js';
import crypto from 'crypto';

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

    const parsedTotal = parseFloat(total);
    if (!Number.isFinite(parsedTotal) || parsedTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid total amount is required',
      });
    }

    const order = {
      id: `order_${crypto.randomUUID()}`,
      userId: req.user.id,
      orderNumber: `BO-${Date.now()}`,
      items,
      shippingInfo,
      total: parsedTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createOrderData(order);

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
    const orders = await getOrdersByUserId(req.user.id);

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
    const order = await getOrder(id);

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

    const order = await getOrder(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const updatedOrder = await updateOrder(order.id, { status });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order: updatedOrder,
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

