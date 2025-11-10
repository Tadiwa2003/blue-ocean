import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    default: null, // Allow guest bookings
  },
  serviceId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  serviceCategory: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 0,
  },
  basePrice: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  therapistLevel: {
    type: String,
    default: '',
  },
  addOns: {
    type: [{
      name: String,
      price: Number,
    }],
    default: [],
  },
  addOnTotal: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
bookingSchema.index({ userId: 1 });
bookingSchema.index({ id: 1 });
bookingSchema.index({ serviceId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1, time: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;

