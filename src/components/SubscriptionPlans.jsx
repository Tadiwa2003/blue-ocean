import { useState, useRef } from 'react';
import { Button } from './Button.jsx';
import { Check, Sparkles, Crown, Rocket } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    period: 'month',
    description: 'Perfect for small businesses getting started',
    icon: Sparkles,
    color: 'from-brand-500/30 to-brand-500/10',
    features: [
      'Up to 10 products',
      'Up to 5 services',
      'Basic analytics',
      'Email support',
      'Mobile-responsive storefront',
    ],
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    period: 'month',
    description: 'Ideal for growing businesses',
    icon: Crown,
    color: 'from-purple-500/30 to-purple-500/10',
    features: [
      'Unlimited products',
      'Unlimited services',
      'Advanced analytics',
      'Priority support',
      'Custom storefront themes',
      'Inventory management',
      'Order tracking',
      'Customer management',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    period: 'month',
    description: 'For large-scale operations',
    icon: Rocket,
    color: 'from-emerald-500/30 to-emerald-500/10',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom integrations',
      'API access',
      'White-label options',
      'Advanced reporting',
      'Multi-user accounts',
      '24/7 phone support',
    ],
    popular: false,
  },
];

export function SubscriptionPlans({ onSelectPlan, currentPlan = null }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const titleRef = useRef(null);
  const plansRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const plansInView = useInView(plansRef, { once: true, margin: "-100px" });

  const handleSelectPlan = async (planId) => {
    if (isProcessing) return; // Prevent double clicks
    
    setSelectedPlan(planId);
    setIsProcessing(true);
    
    try {
      if (onSelectPlan) {
        await onSelectPlan(planId);
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <motion.div 
        ref={titleRef}
        initial={{ y: 30, opacity: 0 }}
        animate={titleInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-4xl text-white mb-4">Choose Your Plan</h2>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          Subscribe to start selling and advertising your goods on Blue Ocean Marketplace
        </p>
      </motion.div>

      <div ref={plansRef} className="grid gap-8 md:grid-cols-3">
        {subscriptionPlans.map((plan, index) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentPlan === plan.id;
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={plansInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative rounded-[32px] border ${
                plan.popular
                  ? 'border-brand-400/50 bg-gradient-to-br from-ocean/90 to-midnight/90 shadow-[0_8px_32px_rgba(29,160,230,0.3)]'
                  : 'border-white/10 bg-ocean/65'
              } p-8 text-white transition-shadow duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-brand-500 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.color}`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-2xl">{plan.name}</h3>
                  <p className="text-sm text-white/60">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-white/60">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={plansInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.15 + idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={plansInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: index * 0.15 + idx * 0.05 + 0.2 }}
                    >
                      <Check className="h-5 w-5 text-brand-200 mt-0.5 shrink-0" />
                    </motion.div>
                    <span className="text-sm text-white/80">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <Button
                  variant="secondary"
                  className="w-full border-white/20 bg-white/10 cursor-not-allowed"
                  disabled
                >
                  Current Plan
                </Button>
              ) : (
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isProcessing}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-brand-500 hover:bg-brand-400'
                      : 'bg-white/10 hover:bg-white/20'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing && selectedPlan === plan.id ? 'Processing...' : 'Subscribe Now'}
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-white/60">
          All plans include a 14-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  );
}

