import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: false, // Optional for backward compatibility with platform services
    index: true,
  },
  storefrontId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storefront',
    required: false, // Optional - null means platform service
    index: true,
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
    enum: ['USD', 'ZAR'],
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

// Indexes - remove duplicates (id, userId, storefrontId already have indexes defined in schema)
serviceSchema.index({ serviceCategory: 1 });
serviceSchema.index({ storefrontId: 1, serviceCategory: 1 }); // Compound index for filtering

const Service = mongoose.model('Service', serviceSchema);

export default Service;

