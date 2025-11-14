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
  guestName: {
    type: String,
    default: '',
  },
  guestEmail: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  guestPhone: {
    type: String,
    default: '',
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
    validate: {
      validator: function(v) {
        // Validate ISO date format (YYYY-MM-DD)
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'Date must be in ISO format (YYYY-MM-DD)'
    }
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Validate time format (HH:MM AM/PM or 24-hour format)
        return /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i.test(v);
      },
      message: 'Time must be in format like "10:00 AM" or "14:00"'
    }
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

// Indexes for better query performance
bookingSchema.index({ userId: 1 });
bookingSchema.index({ id: 1 }, { unique: true });
bookingSchema.index({ serviceId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1, time: 1 });
// Compound index for checking availability (serviceId + date + time)
bookingSchema.index({ serviceId: 1, date: 1, time: 1 });
// Index for date range queries
bookingSchema.index({ date: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;

