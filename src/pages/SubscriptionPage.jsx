import { useState, useEffect } from 'react';
import { SubscriptionPlans } from '../components/SubscriptionPlans.jsx';
import { Button } from '../components/Button.jsx';
import { Logo } from '../components/Logo.jsx';
import { ArrowLeft, CreditCard, Calendar, CheckCircle } from 'lucide-react';
import api from '../services/api.js';
import { motion } from 'framer-motion';
import { ContainerScrollAnimation, ContainerScrollFade, ContainerScrollTranslate } from '../components/ui/ScrollTriggerAnimations.jsx';

export function SubscriptionPage({ onBack, onSubscribeSuccess }) {
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await api.subscriptions.getCurrent();
      if (response.success) {
        setCurrentSubscription(response.data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Don't set error state for 404 or no subscription - that's expected
      if (error.message && !error.message.includes('404')) {
        setError('Failed to load subscription status');
      }
    }
  };

  useEffect(() => {
    // Get current user from localStorage or API
    const loadUserData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          // Try to get user from localStorage first
          const userDataStr = localStorage.getItem('userData') || localStorage.getItem('currentUser');
          if (userDataStr) {
            try {
              const userData = JSON.parse(userDataStr);
              setUser(userData);
            } catch (e) {
              console.warn('Could not parse user data from localStorage');
            }
          }
          
          // Fetch subscription status
          await fetchSubscriptionStatus();
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user information');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSelectPlan = async (planId) => {
    try {
      setError(null);
      // In a real app, this would redirect to a payment processor
      // For now, we'll simulate subscription creation
      const response = await api.subscriptions.create({ planId });
      
      if (response.success) {
        // Update local state immediately
        setCurrentSubscription(response.data.subscription);
        
        // Call success callback if provided
        if (onSubscribeSuccess) {
          onSubscribeSuccess(response.data.subscription);
        } else {
          // If no callback, refresh the subscription status
          await fetchSubscriptionStatus();
        }
      } else {
        setError(response.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-400 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ContainerScrollAnimation className="min-h-screen bg-gradient-to-br from-midnight via-ocean to-midnight text-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-white/10 bg-ocean/80 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white/80 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <Logo />
          </div>
          {user && (
            <div className="text-sm text-white/60">
              {user.name || user.email}
            </div>
          )}
        </div>
      </motion.header>

      {/* Error Message */}
      {error && (
        <ContainerScrollFade opacityRange={[0, 1]} inputRange={[0, 0.2]}>
          <div className="mx-auto max-w-7xl px-6 pt-8">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 mb-8"
            >
              <p className="text-sm text-red-200">{error}</p>
            </motion.div>
          </div>
        </ContainerScrollFade>
      )}

      {/* Current Subscription Banner */}
      {currentSubscription && (
        <ContainerScrollFade opacityRange={[0, 1]} inputRange={[0, 0.2]}>
          <div className="mx-auto max-w-7xl px-6 pt-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 mb-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <CheckCircle className="h-8 w-8 text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Active Subscription: {currentSubscription.planName || currentSubscription.planId}
                  </h3>
                  <p className="text-sm text-white/70">
                    {currentSubscription.renewalDate 
                      ? `Renews on ${new Date(currentSubscription.renewalDate).toLocaleDateString()}`
                      : 'Active subscription'}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold text-white">
                    ${currentSubscription.price || 'N/A'}/{currentSubscription.period || 'month'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </ContainerScrollFade>
      )}

      {/* No Subscription Message */}
      {!loading && !currentSubscription && !error && (
        <ContainerScrollFade opacityRange={[0, 1]} inputRange={[0, 0.2]}>
          <div className="mx-auto max-w-7xl px-6 pt-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 mb-8"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    No Active Subscription
                  </h3>
                  <p className="text-sm text-white/70">
                    Subscribe to a plan below to start selling and advertising your goods on Blue Ocean Marketplace.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </ContainerScrollFade>
      )}

      {/* Subscription Plans */}
      <SubscriptionPlans
        onSelectPlan={handleSelectPlan}
        currentPlan={currentSubscription?.planId}
      />

      {/* Footer Info */}
      <ContainerScrollFade opacityRange={[0, 1]} inputRange={[0.6, 1]}>
        <ContainerScrollTranslate yRange={[50, 0]} inputRange={[0.6, 1]}>
          <div className="mx-auto max-w-7xl px-6 pb-16">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/10 bg-ocean/65 p-8"
            >
              <h3 className="font-display text-2xl mb-4">Why Subscribe?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: CreditCard, title: 'Secure Payments', desc: 'All transactions are processed securely through our payment partners.' },
                  { icon: Calendar, title: 'Flexible Billing', desc: 'Monthly or annual billing options. Cancel anytime with no hidden fees.' },
                  { icon: CheckCircle, title: '14-Day Trial', desc: 'Try any plan risk-free for 14 days. No credit card required to start.' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Icon className="h-8 w-8 text-brand-200 mb-3" />
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      <p className="text-sm text-white/70">{item.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </ContainerScrollTranslate>
      </ContainerScrollFade>
    </ContainerScrollAnimation>
  );
}

