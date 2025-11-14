import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Contact from '../models/Contact.js';
import Subscription from '../models/Subscription.js';
import Storefront from '../models/Storefront.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blueocean';

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString();
};

const displayCollection = async (Model, collectionName) => {
  try {
    const items = await Model.find({}).lean();
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📦 ${collectionName.toUpperCase()} (${items.length} items)`);
    console.log('='.repeat(80));
    
    if (items.length === 0) {
      console.log('  (No items found)');
      return;
    }

    items.forEach((item, index) => {
      console.log(`\n[${index + 1}] ${collectionName} ID: ${item.id || item._id}`);
      console.log(JSON.stringify(item, null, 2));
    });
  } catch (error) {
    console.error(`❌ Error fetching ${collectionName}:`, error.message);
  }
};

const displaySummary = async () => {
  try {
    const counts = {
      users: await User.countDocuments({}),
      bookings: await Booking.countDocuments({}),
      services: await Service.countDocuments({}),
      products: await Product.countDocuments({}),
      orders: await Order.countDocuments({}),
      contacts: await Contact.countDocuments({}),
      subscriptions: await Subscription.countDocuments({}),
      storefronts: await Storefront.countDocuments({}),
    };

    console.log('\n' + '='.repeat(80));
    console.log('📊 DATABASE SUMMARY');
    console.log('='.repeat(80));
    console.log(`Users:          ${counts.users}`);
    console.log(`Bookings:       ${counts.bookings}`);
    console.log(`Services:       ${counts.services}`);
    console.log(`Products:       ${counts.products}`);
    console.log(`Orders:         ${counts.orders}`);
    console.log(`Contacts:       ${counts.contacts}`);
    console.log(`Subscriptions:  ${counts.subscriptions}`);
    console.log(`Storefronts:    ${counts.storefronts}`);
  } catch (error) {
    console.error('❌ Error getting summary:', error.message);
  }
};

const main = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log(`📍 URI: ${MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Connected to MongoDB!\n');

    // Display summary first
    await displaySummary();

    // Display each collection
    await displayCollection(User, 'Users');
    await displayCollection(Booking, 'Bookings');
    await displayCollection(Service, 'Services');
    await displayCollection(Product, 'Products');
    await displayCollection(Order, 'Orders');
    await displayCollection(Contact, 'Contacts');
    await displayCollection(Subscription, 'Subscriptions');
    await displayCollection(Storefront, 'Storefronts');

    console.log('\n' + '='.repeat(80));
    console.log('✅ Database view complete!');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n💡 Make sure MongoDB is running:');
      console.error('   brew services start mongodb-community');
      console.error('   or');
      console.error('   mongod');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

main();

