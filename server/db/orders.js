import Order from '../models/Order.js';

export const getAllOrders = async () => {
  return await Order.find({}).sort({ createdAt: -1 }).lean();
};

export const getOrdersByUserId = async (userId) => {
  return await Order.find({ userId }).sort({ createdAt: -1 }).lean();
};

export const getOrderById = async (id) => {
  return await Order.findOne({ id }).lean();
};

export const createOrder = async (orderData) => {
  const order = await Order.create(orderData);
  return order.toObject();
};

export const updateOrder = async (id, updateData) => {
  const order = await Order.findOneAndUpdate(
    { id },
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).lean();
  return order;
};

export const deleteOrder = async (id) => {
  const result = await Order.findOneAndDelete({ id });
  return result ? result.toObject() : null;
};
