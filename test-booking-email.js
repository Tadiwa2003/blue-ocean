// Test script to verify booking email configuration
// Run with: node test-booking-email.js

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { sendBookingNotifications } from './server/utils/email.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, 'server', '.env') });

// Test booking data
const testBooking = {
  id: 'test-booking-' + Date.now(),
  name: 'Test Spa Service',
  guestName: 'Test Customer',
  guestEmail: 'test@example.com',
  guestPhone: '+27 123456789',
  date: '2025-11-20',
  time: '10:00 AM',
  duration: 60,
  totalPrice: 150,
  currency: 'USD',
  status: 'pending',
  addOns: [
    { name: 'Facial Treatment' },
    { name: 'Massage' }
  ],
  notes: 'Test booking to verify email functionality'
};

console.log('🧪 Testing Booking Email Configuration...\n');
console.log('📋 Test Booking:', testBooking);
console.log('\n📧 Sending test email to: tadiwachoga2003@gmail.com\n');

sendBookingNotifications(testBooking)
  .then(() => {
    console.log('\n✅ Test email sent successfully!');
    console.log('📧 Check your email at: tadiwachoga2003@gmail.com');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test email failed:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Gmail credentials are configured in server/.env');
    console.error('   2. EMAIL_USER and EMAIL_PASS are set correctly');
    console.error('   3. Gmail App Password is valid');
    process.exit(1);
  });

