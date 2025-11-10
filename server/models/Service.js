import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  serviceCategory: {
    type: String,
    required: true,
    enum: ['Massage', 'Facial', 'Body Treatment', 'Wellness', 'Spa Package'],
  },
  description: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP'],
  },
  image: {
    type: String,
    default: '',
  },
  badges: {
    type: [String],
    default: [],
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
serviceSchema.index({ serviceCategory: 1 });
serviceSchema.index({ id: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;

