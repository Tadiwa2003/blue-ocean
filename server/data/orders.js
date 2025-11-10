import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import lockfile from 'proper-lockfile';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ORDERS_FILE = join(__dirname, 'orders.json');

// Ensure data directory exists
const dataDir = dirname(ORDERS_FILE);
if (!existsSync(dataDir)) {
  await mkdir(dataDir, { recursive: true });
}

// Get all orders from file (async)
export const getAllOrders = async () => {
  try {
    const data = await readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading orders:', error);
    throw error;
  }
};

// Save orders to file (async with locking)
export const saveAllOrders = async (orders) => {
  let release;
  try {
    // Acquire file lock with retries
    release = await lockfile.lock(ORDERS_FILE, {
      retries: {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 1000,
      },
    });
    
    // Atomic write: write to temp file then rename
    const tempPath = `${ORDERS_FILE}.tmp`;
    await writeFile(tempPath, JSON.stringify(orders, null, 2), 'utf8');
    const fs = await import('fs/promises');
    await fs.rename(tempPath, ORDERS_FILE);
  } catch (error) {
    // Clean up temp file on error
    try {
      const fs = await import('fs/promises');
      await fs.unlink(`${ORDERS_FILE}.tmp`).catch(() => {});
    } catch {}
    console.error('Error saving orders:', error);
    throw error;
  } finally {
    // Always release lock
    if (release) {
      await release().catch(() => {});
    }
  }
};

// Save a single order (async with locking)
export const saveOrder = async (order) => {
  let release;
  try {
    // Acquire exclusive file lock
    release = await lockfile.lock(ORDERS_FILE, {
      retries: {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 1000,
      },
    });
    
    // Re-load latest orders from disk while holding lock
    const orders = await getAllOrders();
    orders.push(order);
    await saveAllOrders(orders);
    return order;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  } finally {
    // Always release lock
    if (release) {
      await release().catch(() => {});
    }
  }
};

// Get orders by user ID (async)
export const getOrdersByUserId = async (userId) => {
  const orders = await getAllOrders();
  return orders.filter(order => order.userId === userId);
};

// Get order by ID (async)
export const getOrderById = async (id) => {
  const orders = await getAllOrders();
  return orders.find(order => order.id === id);
};

// Update order (async with locking)
export const updateOrder = async (updatedOrder) => {
  let release;
  try {
    // Acquire exclusive file lock
    release = await lockfile.lock(ORDERS_FILE, {
      retries: {
        retries: 5,
        minTimeout: 100,
        maxTimeout: 1000,
      },
    });
    
    // Re-load latest orders from disk while holding lock
    const orders = await getAllOrders();
    const index = orders.findIndex(order => order.id === updatedOrder.id);
    if (index !== -1) {
      orders[index] = updatedOrder;
      await saveAllOrders(orders);
      return updatedOrder;
    }
    return null;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  } finally {
    // Always release lock
    if (release) {
      await release().catch(() => {});
    }
  }
};

