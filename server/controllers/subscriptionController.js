import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUBSCRIPTIONS_FILE = join(__dirname, '../data/subscriptions.json');

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

// Initialize subscriptions file if it doesn't exist
async function ensureSubscriptionsFile() {
  try {
    await readFile(SUBSCRIPTIONS_FILE);
  } catch (error) {
    // File doesn't exist, create it
    await writeFile(SUBSCRIPTIONS_FILE, JSON.stringify([], null, 2));
  }
}

// Read subscriptions from file
async function readSubscriptions() {
  await ensureSubscriptionsFile();
  const data = await readFile(SUBSCRIPTIONS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write subscriptions to file
async function writeSubscriptions(subscriptions) {
  await writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
}

// Get current subscription for user
export async function getCurrentSubscription(req, res) {
  try {
    const userId = req.user.userId;
    const subscriptions = await readSubscriptions();
    const subscription = subscriptions.find(
      (sub) => sub.userId === userId && sub.status === 'active'
    );

    if (!subscription) {
      return res.json({
        success: true,
        data: { subscription: null },
      });
    }

    const plan = SUBSCRIPTION_PLANS[subscription.planId];
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
    const userId = req.user.userId;
    const { planId } = req.body;

    if (!planId || !SUBSCRIPTION_PLANS[planId]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan ID',
      });
    }

    const subscriptions = await readSubscriptions();

    // Cancel any existing active subscription
    const existingSubscriptions = subscriptions.filter(
      (sub) => sub.userId === userId && sub.status === 'active'
    );
    existingSubscriptions.forEach((sub) => {
      sub.status = 'cancelled';
      sub.cancelledAt = new Date().toISOString();
    });

    // Create new subscription
    const plan = SUBSCRIPTION_PLANS[planId];
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    const newSubscription = {
      id: `sub_${Date.now()}`,
      userId,
      planId,
      status: 'active',
      createdAt: new Date().toISOString(),
      renewalDate: renewalDate.toISOString(),
      cancelledAt: null,
    };

    subscriptions.push(newSubscription);
    await writeSubscriptions(subscriptions);

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
    const userId = req.user.userId;
    const { id } = req.params;
    const { planId } = req.body;

    if (!planId || !SUBSCRIPTION_PLANS[planId]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan ID',
      });
    }

    const subscriptions = await readSubscriptions();
    const subscription = subscriptions.find(
      (sub) => sub.id === id && sub.userId === userId
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    subscription.planId = planId;
    subscription.updatedAt = new Date().toISOString();

    await writeSubscriptions(subscriptions);

    const plan = SUBSCRIPTION_PLANS[planId];
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
    const userId = req.user.userId;
    const { id } = req.params;

    const subscriptions = await readSubscriptions();
    const subscription = subscriptions.find(
      (sub) => sub.id === id && sub.userId === userId
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date().toISOString();

    await writeSubscriptions(subscriptions);

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

