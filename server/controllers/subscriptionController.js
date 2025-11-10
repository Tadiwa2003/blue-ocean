import { getSubscriptionByUserId, createSubscription as createSubscriptionDB, updateSubscription as updateSubscriptionDB, cancelSubscription as cancelSubscriptionDB } from '../db/subscriptions.js';
import Subscription from '../models/Subscription.js';
import crypto from 'crypto';

// Subscription plans configuration
const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 29,
    period: 'month',
    maxProducts: 10,
    maxServices: 5,
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 79,
    period: 'month',
    maxProducts: -1, // unlimited
    maxServices: -1, // unlimited
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    period: 'month',
    maxProducts: -1,
    maxServices: -1,
  },
};

// Helper function to get subscription limits for a user
export async function getUserSubscriptionLimits(userId) {
  const subscription = await getSubscriptionByUserId(userId);
  if (!subscription) {
    return { maxProducts: 0, maxServices: 0, hasSubscription: false };
  }
  
  const plan = SUBSCRIPTION_PLANS[subscription.planId];
  if (!plan) {
    return { maxProducts: 0, maxServices: 0, hasSubscription: false };
  }
  
  return {
    maxProducts: plan.maxProducts,
    maxServices: plan.maxServices,
    hasSubscription: true,
    planId: subscription.planId,
    planName: plan.name,
  };
}


// Get current subscription for user
export async function getCurrentSubscription(req, res) {
  try {
    const userId = req.user.id;
    const subscription = await getSubscriptionByUserId(userId);

    if (!subscription) {
      return res.json({
        success: true,
        data: { subscription: null },
      });
    }

    // Check if trial has expired
    const now = new Date();
    if (subscription.isTrial && subscription.trialEndDate) {
      const trialEndDate = new Date(subscription.trialEndDate);
      if (trialEndDate < now) {
        // Trial has expired, return null
        return res.json({
          success: true,
          data: { subscription: null, trialExpired: true },
        });
      }
    }

    // Check if subscription has expired
    const renewalDate = new Date(subscription.renewalDate);
    if (renewalDate < now) {
      // Subscription has expired, return null
      return res.json({
        success: true,
        data: { subscription: null, subscriptionExpired: true },
      });
    }

    const plan = SUBSCRIPTION_PLANS[subscription.planId];
    if (!plan) {
      console.error(`Plan ${subscription.planId} not found in SUBSCRIPTION_PLANS`);
      return res.status(500).json({
        success: false,
        message: 'Subscription plan configuration error',
      });
    }

    res.json({
      success: true,
      data: {
        subscription: {
          ...subscription,
          planName: plan.name,
          price: plan.price,
          period: plan.period,
        },
      },
    });
  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription',
    });
  }
}

// Create new subscription
export async function createSubscription(req, res) {
  try {
    const userId = req.user.id;
    const { planId } = req.body;

    if (!planId || !SUBSCRIPTION_PLANS[planId]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan ID',
      });
    }

    // Cancel any existing subscription (active or not) for this user
    // We need to get all subscriptions, not just active ones
    const existingSubscription = await Subscription.findOne({ userId }).sort({ createdAt: -1 }).lean();
    if (existingSubscription && existingSubscription.status === 'active') {
      try {
        await cancelSubscriptionDB(existingSubscription.id);
      } catch (cancelError) {
        console.error('Error cancelling existing subscription:', cancelError);
        // Continue with creation even if cancellation fails
      }
    }

    // Create new subscription
    const plan = SUBSCRIPTION_PLANS[planId];
    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial
    const renewalDate = new Date(now);
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    const newSubscription = await createSubscriptionDB({
      id: `sub_${crypto.randomUUID()}`,
      userId,
      planId,
      planName: plan.name,
      status: 'active',
      renewalDate: renewalDate.toISOString(),
      trialStartDate: now.toISOString(),
      trialEndDate: trialEndDate.toISOString(),
      isTrial: true,
    });

    res.status(201).json({
      success: true,
      data: {
        subscription: {
          ...newSubscription,
          planName: plan.name,
          price: plan.price,
          period: plan.period,
        },
      },
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
    });
  }
}

// Update subscription (upgrade/downgrade)
export async function updateSubscription(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { planId } = req.body;

    if (!planId || !SUBSCRIPTION_PLANS[planId]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan ID',
      });
    }

    const plan = SUBSCRIPTION_PLANS[planId];
    const updatedSubscription = await updateSubscriptionDB(id, {
      planId,
      planName: plan.name,
    });

    if (!updatedSubscription || updatedSubscription.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    res.json({
      success: true,
      data: {
        subscription: {
          ...updatedSubscription,
          planName: plan.name,
          price: plan.price,
          period: plan.period,
        },
      },
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription',
    });
  }
}

// Cancel subscription
export async function cancelSubscription(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const cancelledSubscription = await cancelSubscriptionDB(id);

    if (!cancelledSubscription || cancelledSubscription.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
    });
  }
}

