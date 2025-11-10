import { connectDB, disconnectDB } from '../db/connection.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import Order from '../models/Order.js';
import Subscription from '../models/Subscription.js';
import Booking from '../models/Booking.js';
import Contact from '../models/Contact.js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to parse price string to number
function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  if (typeof priceStr !== 'string') return 0;
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

async function migrateUsers() {
  try {
    const usersPath = join(__dirname, '../data/data/users.json');
    if (!existsSync(usersPath)) {
      console.log('⚠️  No users.json found, skipping user migration');
      return;
    }
    
    const data = await readFile(usersPath, 'utf8');
    const users = JSON.parse(data);
    
    if (!Array.isArray(users) || users.length === 0) {
      console.log('⚠️  No users to migrate');
      return;
    }
    
    let migrated = 0;
    for (const user of users) {
      try {
        // Check if user already exists
        const existing = await User.findOne({ id: user.id });
        if (!existing) {
          await User.create(user);
          migrated++;
        }
      } catch (error) {
        console.error(`Error migrating user ${user.id}:`, error.message);
      }
    }
    
    console.log(`✅ Migrated ${migrated} users`);
  } catch (error) {
    console.error('Error migrating users:', error);
  }
}

async function migrateProducts() {
  try {
    const productsPath = join(__dirname, '../data/products.json');
    if (!existsSync(productsPath)) {
      console.log('⚠️  No products.json found, skipping product migration');
      return;
    }
    
    const data = await readFile(productsPath, 'utf8');
    const products = JSON.parse(data);
    
    if (!Array.isArray(products) || products.length === 0) {
      console.log('⚠️  No products to migrate');
      return;
    }
    
    let migrated = 0;
    for (const product of products) {
      try {
        // Check if product already exists
        const existing = await Product.findOne({ id: product.id });
        if (!existing) {
          // Convert price string to number
          const price = parsePrice(product.price);
          await Product.create({
            ...product,
            price,
          });
          migrated++;
        }
      } catch (error) {
        console.error(`Error migrating product ${product.id}:`, error.message);
      }
    }
    
    console.log(`✅ Migrated ${migrated} products`);
  } catch (error) {
    console.error('Error migrating products:', error);
  }
}

async function migrateServices() {
  try {
    const servicesPath = join(__dirname, '../data/services.json');
    if (!existsSync(servicesPath)) {
      console.log('⚠️  No services.json found, skipping service migration');
      return;
    }
    
    const data = await readFile(servicesPath, 'utf8');
    const services = JSON.parse(data);
    
    if (!Array.isArray(services) || services.length === 0) {
      console.log('⚠️  No services to migrate');
      return;
    }
    
    let migrated = 0;
    for (const service of services) {
      try {
        // Check if service already exists
        const existing = await Service.findOne({ id: service.id });
        if (!existing) {
          // Ensure basePrice is a number
          const basePrice = service.basePrice ? parsePrice(service.basePrice) : parsePrice(service.price || 0);
          await Service.create({
            ...service,
            basePrice,
          });
          migrated++;
        }
      } catch (error) {
        console.error(`Error migrating service ${service.id}:`, error.message);
      }
    }
    
    console.log(`✅ Migrated ${migrated} services`);
  } catch (error) {
    console.error('Error migrating services:', error);
  }
}

async function migrateOrders() {
  try {
    const ordersPath = join(__dirname, '../data/orders.json');
    if (!existsSync(ordersPath)) {
      console.log('⚠️  No orders.json found, skipping order migration');
      return;
    }
    
    const data = await readFile(ordersPath, 'utf8');
    const orders = JSON.parse(data);
    
    if (!Array.isArray(orders) || orders.length === 0) {
      console.log('⚠️  No orders to migrate');
      return;
    }
    
    let migrated = 0;
    for (const order of orders) {
      try {
        const existing = await Order.findOne({ id: order.id });
        if (!existing) {
          await Order.create(order);
          migrated++;
        }
      } catch (error) {
        console.error(`Error migrating order ${order.id}:`, error.message);
      }
    }
    
    console.log(`✅ Migrated ${migrated} orders`);
  } catch (error) {
    console.error('Error migrating orders:', error);
  }
}

async function migrateSubscriptions() {
  try {
    const subscriptionsPath = join(__dirname, '../data/subscriptions.json');
    if (!existsSync(subscriptionsPath)) {
      console.log('⚠️  No subscriptions.json found, skipping subscription migration');
      return;
    }
    
    const data = await readFile(subscriptionsPath, 'utf8');
    const subscriptions = JSON.parse(data);
    
    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      console.log('⚠️  No subscriptions to migrate');
      return;
    }
    
    let migrated = 0;
    for (const subscription of subscriptions) {
      try {
        const existing = await Subscription.findOne({ id: subscription.id });
        if (!existing) {
          await Subscription.create(subscription);
          migrated++;
        }
      } catch (error) {
        console.error(`Error migrating subscription ${subscription.id}:`, error.message);
      }
    }
    
    console.log(`✅ Migrated ${migrated} subscriptions`);
  } catch (error) {
    console.error('Error migrating subscriptions:', error);
  }
}

async function migrateBookings() {
  try {
    const bookingsPath = join(__dirname, '../data/bookings.json');
    if (!existsSync(bookingsPath)) {
      console.log('⚠️  No bookings.json found, skipping booking migration');
      return;
    }
    
    const data = await readFile(bookingsPath, 'utf8');
    const bookings = JSON.parse(data);
    
    if (!Array.isArray(bookings) || bookings.length === 0) {
      console.log('⚠️  No bookings to migrate');
      return;
    }
    
    let migrated = 0;
    for (const booking of bookings) {
      try {
        const existing = await Booking.findOne({ id: booking.id });
        if (!existing) {
          await Booking.create(booking);
          migrated++;
        }
      } catch (error) {
        console.error(`Error migrating booking ${booking.id}:`, error.message);
      }
    }
    
    console.log(`✅ Migrated ${migrated} bookings`);
  } catch (error) {
    console.error('Error migrating bookings:', error);
  }
}

async function migrateContacts() {
  try {
    const contactsPath = join(__dirname, '../data/contact.json');
    if (!existsSync(contactsPath)) {
      console.log('⚠️  No contact.json found, skipping contact migration');
      return;
    }
    
    const data = await readFile(contactsPath, 'utf8');
    const contacts = JSON.parse(data);
    
    if (!Array.isArray(contacts) || contacts.length === 0) {
      console.log('⚠️  No contacts to migrate');
      return;
    }
    
    let migrated = 0;
    for (const contact of contacts) {
      try {
        const existing = await Contact.findOne({ id: contact.id });
        if (!existing) {
          await Contact.create(contact);
          migrated++;
        }
      } catch (error) {
        console.error(`Error migrating contact ${contact.id}:`, error.message);
      }
    }
    
    console.log(`✅ Migrated ${migrated} contact messages`);
  } catch (error) {
    console.error('Error migrating contacts:', error);
  }
}

async function main() {
  try {
    console.log('🚀 Starting MongoDB migration...\n');
    
    await connectDB();
    
    await migrateUsers();
    await migrateProducts();
    await migrateServices();
    await migrateOrders();
    await migrateSubscriptions();
    await migrateBookings();
    await migrateContacts();
    
    console.log('\n✅ Migration completed!');
    
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await disconnectDB();
    process.exit(1);
  }
}

main();

