import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CreditCard, Clock } from 'lucide-react';
import { Button } from './Button.jsx';
import { Logo } from './Logo.jsx';
import { SubscriptionPlans } from './SubscriptionPlans.jsx';
import api from '../services/api.js';

export function SubscriptionRequiredModal({ isOpen, onSubscribeSuccess, trialExpired = false }) {
  const [showPlans, setShowPlans] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);

  useEffect(() => {
    if (isOpen && !trialExpired) {
      // Calculate days remaining in trial (if any)
      // This would come from the subscription data
      setDaysRemaining(14); // Default 14-day trial
    }
  }, [isOpen, trialExpired]);

  const handleSubscribeSuccess = async (planId) => {
    try {
      // Create subscription via API
      const response = await api.subscriptions.create({ planId });
      if (response.success && onSubscribeSuccess) {
        await onSubscribeSuccess(response.data.subscription);
      }
      setShowPlans(false);
    } catch (error) {
      console.error('Error creating subscription:', error);
      // Error handling is done in SubscriptionPlans component
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1005] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-midnight/98 backdrop-blur-lg"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-ocean/95 to-midnight/98 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {!showPlans ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400/30">
                      <AlertCircle className="h-6 w-6 text-amber-200" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl text-white">
                        {trialExpired ? 'Trial Period Expired' : 'Subscription Required'}
                      </h2>
                      <p className="text-sm text-white/60 mt-1">
                        {trialExpired 
                          ? 'Your free trial has ended. Subscribe to continue using Blue Ocean Marketplace.'
                          : 'Subscribe to access all features and start selling on Blue Ocean Marketplace.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="max-w-2xl mx-auto text-center space-y-6">
                    {trialExpired ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 mb-6"
                      >
                        <Clock className="h-12 w-12 text-amber-200 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Your Trial Has Ended</h3>
                        <p className="text-white/70">
                          Your 14-day free trial period has expired. To continue using Blue Ocean Marketplace and access all features, please subscribe to a plan.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl border border-brand-400/30 bg-brand-500/10 p-6 mb-6"
                      >
                        <CreditCard className="h-12 w-12 text-brand-200 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Access Restricted</h3>
                        <p className="text-white/70">
                          You need an active subscription to access the dashboard and all features. Subscribe now to get started with a 14-day free trial.
                        </p>
                      </motion.div>
                    )}

                    <div className="grid sm:grid-cols-3 gap-4 mt-8">
                      {[
                        { icon: '🛍️', title: 'Sell Products', desc: 'List and manage your products' },
                        { icon: '💆', title: 'Beauty Spa', desc: 'Manage spa services and bookings' },
                        { icon: '📊', title: 'Analytics', desc: 'Track sales and performance' },
                      ].map((feature, idx) => (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          className="rounded-xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="text-3xl mb-2">{feature.icon}</div>
                          <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                          <p className="text-xs text-white/60">{feature.desc}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pt-6">
                      <Button
                        onClick={() => setShowPlans(true)}
                        className="w-full sm:w-auto bg-brand-500 hover:bg-brand-400 text-lg px-8 py-6"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        View Subscription Plans
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Header for Plans View */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-4">
                    <Logo className="scale-75" />
                    <div>
                      <h2 className="font-display text-2xl text-white">Choose Your Plan</h2>
                      <p className="text-sm text-white/60 mt-1">
                        Select a subscription plan to continue
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPlans(false)}
                    className="rounded-full border border-white/20 bg-white/10 p-2 text-white/80 hover:text-white hover:bg-white/20 transition"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Subscription Plans */}
                <div className="flex-1 overflow-y-auto">
                  <SubscriptionPlans
                    onSelectPlan={handleSubscribeSuccess}
                    currentPlan={null}
                  />
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

