import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  planId: {
    type: String,
    required: true,
  },
  planName: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active',
  },
  renewalDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ id: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ renewalDate: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;

