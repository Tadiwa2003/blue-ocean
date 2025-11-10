import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ORDERS_FILE = join(__dirname, 'orders.json');

// Ensure data directory exists
const dataDir = dirname(ORDERS_FILE);
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Get all orders from file
const getAllOrders = () => {
  try {
    if (!existsSync(ORDERS_FILE)) {
      return [];
    }
    const data = readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
};

// Save orders to file
const saveAllOrders = (orders) => {
  try {
    writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving orders:', error);
    throw error;
  }
};

// Save a single order
export const saveOrder = (order) => {
  const orders = getAllOrders();
  orders.push(order);
  saveAllOrders(orders);
  return order;
};

// Get orders by user ID
export const getOrdersByUserId = (userId) => {
  const orders = getAllOrders();
  return orders.filter(order => order.userId === userId);
};

// Get order by ID
export const getOrderById = (id) => {
  const orders = getAllOrders();
  return orders.find(order => order.id === id);
};

// Update order
export const updateOrder = (updatedOrder) => {
  const orders = getAllOrders();
  const index = orders.findIndex(order => order.id === updatedOrder.id);
  if (index !== -1) {
    orders[index] = updatedOrder;
    saveAllOrders(orders);
    return updatedOrder;
  }
  return null;
};

