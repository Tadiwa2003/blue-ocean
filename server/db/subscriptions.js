import Subscription from '../models/Subscription.js';

export const getAllSubscriptions = async () => {
  return await Subscription.find({}).sort({ createdAt: -1 }).lean();
};

export const getSubscriptionByUserId = async (userId) => {
  const now = new Date();
  // Only return active subscriptions that haven't expired
  return await Subscription.findOne({ 
    userId,
    status: 'active',
    renewalDate: { $gte: now }
  }).sort({ createdAt: -1 }).lean();
};

export const getSubscriptionById = async (id) => {
  return await Subscription.findOne({ id }).lean();
};

export const createSubscription = async (subscriptionData) => {
  const subscription = await Subscription.create(subscriptionData);
  return subscription.toObject();
};

export const updateSubscription = async (id, updateData) => {
  const subscription = await Subscription.findOneAndUpdate(
    { id },
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).lean();
  return subscription;
};

export const deleteSubscription = async (id) => {
  const result = await Subscription.findOneAndDelete({ id });
  return result ? result.toObject() : null;
};

export const cancelSubscription = async (id) => {
  const subscription = await Subscription.findOneAndUpdate(
    { id },
    { 
      status: 'cancelled',
      cancelledAt: new Date(),
      updatedAt: new Date() 
    },
    { new: true, runValidators: true }
  ).lean();
  return subscription;
};
