import { useState, useRef, useEffect } from 'react';
import { Button } from './Button.jsx';
import { Check, Sparkles, Crown, Rocket, CheckCheck } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { PaymentModal } from './PaymentModal.jsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    yearlyPrice: 290,
    period: 'month',
    description: 'Perfect for small businesses getting started',
    icon: Sparkles,
    color: 'from-brand-500/30 to-brand-500/10',
    features: [
      '1 Storefront',
      'Up to 10 products',
      'Up to 5 services',
      'Up to 3 images per product',
      'Basic analytics & reports',
      'Email support',
      'Mobile-responsive design',
      'Secure checkout',
    ],
    includes: [
      'Everything you need to start:',
      'Custom branding colors',
      'Product categories',
      'Service bookings',
      'Order management',
    ],
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    yearlyPrice: 790,
    period: 'month',
    description: 'Ideal for growing businesses',
    icon: Crown,
    color: 'from-purple-600/90 to-purple-500/90',
    features: [
      'Up to 3 storefronts',
      'Unlimited products & services',
      'Up to 10 images per item',
      'Custom themes & branding',
      'Advanced analytics & reports',
      'Data export (CSV/Excel)',
      'Inventory management',
      'Order tracking',
      'Customer management',
      'Email marketing tools',
      'Multi-currency support',
      'API access & webhooks',
      'Priority email support',
      'Custom domain',
    ],
    includes: [
      'Everything in Basic, plus:',
      'Multi-user accounts (up to 5)',
      'Role-based access control',
      'Third-party app integrations',
      'Custom checkout flow',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    yearlyPrice: 1990,
    period: 'month',
    description: 'For large-scale operations',
    icon: Rocket,
    color: 'from-emerald-500/30 to-emerald-500/10',
    features: [
      'Unlimited storefronts',
      'Unlimited products & services',
      'Unlimited images',
      'White-label options',
      'Custom integrations',
      'Advanced reporting & analytics',
      'Multi-language support',
      'SMS notifications',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom API development',
      'Priority feature requests',
      'SLA guarantee (99.9% uptime)',
    ],
    includes: [
      'Everything in Professional, plus:',
      'Unlimited user accounts',
      'Advanced role permissions',
      'Custom development support',
      'Onboarding & training',
    ],
    popular: false,
  },
];

const PricingSwitch = ({ onSwitch, isYearly, className }) => {
  const [selected, setSelected] = useState(isYearly ? "1" : "0");

  const handleSwitch = (value) => {
    setSelected(value);
    onSwitch(value === "1");
  };

  return (
    <div className={`flex justify-center ${className || ''}`}>
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-white/10 border border-white/20 p-1 backdrop-blur-sm">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit sm:h-12 cursor-pointer h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${selected === "0"
              ? "text-white"
              : "text-white/60 hover:text-white"
            }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-2 shadow-sm border-brand-400/50 bg-gradient-to-t from-brand-500/30 via-brand-400/20 to-brand-500/30"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit cursor-pointer sm:h-12 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${selected === "1"
              ? "text-white"
              : "text-white/60 hover:text-white"
            }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-2 shadow-sm border-brand-400/50 bg-gradient-to-t from-brand-500/30 via-brand-400/20 to-brand-500/30"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-brand-500/80 px-2 py-0.5 text-xs font-medium text-white">
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export function SubscriptionPlans({ onSelectPlan, currentPlan = null }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isYearly, setIsYearly] = useState(false);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const plansRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const plansInView = useInView(plansRef, { once: true, margin: "-100px" });

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate title
      gsap.fromTo(
        titleRef.current,
        {
          y: 30,
          opacity: 0,
          filter: "blur(10px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Animate plan cards with stagger
      const cards = plansRef.current?.querySelectorAll('.plan-card');
      if (cards) {
        gsap.fromTo(
          cards,
          {
            y: 50,
            opacity: 0,
            scale: 0.9,
            filter: "blur(10px)",
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: plansRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSelectPlan = (planId) => {
    if (isProcessing) return;
    setSelectedPlanId(planId);
    setShowPaymentModal(true);
    setError(null);
  };

  const handlePaymentSuccess = async (planId) => {
    setShowPaymentModal(false);
    setIsProcessing(true);
    setError(null);

    try {
      if (onSelectPlan) {
        await onSelectPlan(planId);
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedPlanId(null);
    }
  };

  const togglePricingPeriod = (value) => {
    setIsYearly(value);
  };

  return (
    <div ref={containerRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header Section */}
      <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between mb-10 sm:mb-12">
        <div className="text-left mb-6 sm:mb-0">
          <motion.h2
            ref={titleRef}
            className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4 leading-tight"
          >
            Plans & Pricing
          </motion.h2>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl">
            Trusted by millions, we help teams all around the world. Explore which option is right for you.
          </p>
        </div>
        <PricingSwitch onSwitch={togglePricingPeriod} isYearly={isYearly} className="shrink-0" />
      </div>

      {/* Plans Grid */}
      <div ref={plansRef} className="grid md:grid-cols-3 gap-4 sm:gap-6 mx-auto bg-gradient-to-b from-ocean/40 to-midnight/40 sm:p-3 rounded-2xl">
        {subscriptionPlans.map((plan, index) => {
          const Icon = plan.icon;
          const isCurrentPlan = currentPlan === plan.id;
          const displayPrice = isYearly ? plan.yearlyPrice : plan.price;
          const displayPeriod = isYearly ? 'year' : 'month';

          return (
            <div
              key={plan.id}
              className={`plan-card relative flex flex-col justify-between ${plan.popular
                  ? "scale-105 sm:scale-110 ring-2 ring-brand-400/50 bg-gradient-to-br from-ocean/95 via-brand-500/20 to-midnight/95 text-white shadow-[0_8px_32px_rgba(29,160,230,0.4)]"
                  : "border border-white/10 shadow-none bg-gradient-to-br from-ocean/80 to-midnight/80 pt-4 text-white"
                } rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300`}
            >
              <div>
                {plan.popular && (
                  <div className="mb-4">
                    <span className="bg-brand-500/80 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Popular
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl sm:text-5xl font-bold">
                    ${displayPrice}
                  </span>
                  <span className={`ml-2 text-sm sm:text-base ${plan.popular ? "text-white/80" : "text-white/60"
                    }`}>
                    /{displayPeriod}
                  </span>
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl sm:text-3xl font-semibold mb-2">{plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.popular ? "text-white/80" : "text-white/70"
                  }`}>
                  {plan.description}
                </p>

                {/* Features */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <h4 className="font-medium text-base mb-3">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className={`h-6 w-6 rounded-full grid place-content-center mt-0.5 mr-3 shrink-0 ${plan.popular
                            ? "bg-white/20 border border-white/30"
                            : "bg-white/10 border border-white/20"
                          }`}>
                          <CheckCheck className="h-4 w-4" />
                        </span>
                        <span className={`text-sm ${plan.popular ? "text-white/90" : "text-white/80"
                          }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Button */}
              <div className="mt-8">
                {isCurrentPlan ? (
                  <Button
                    variant="secondary"
                    className="w-full border-white/20 bg-white/10 cursor-not-allowed text-sm sm:text-base"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isProcessing}
                    className={`w-full mb-2 p-4 text-base sm:text-lg rounded-xl font-semibold transition-all duration-300 ${plan.popular
                        ? "bg-gradient-to-t from-white/90 to-white/70 shadow-lg shadow-brand-500/50 border border-white/40 text-midnight hover:from-white hover:to-white/90"
                        : "bg-gradient-to-t from-brand-500/90 to-brand-400/80 shadow-lg shadow-brand-500/30 border border-brand-400/50 text-white hover:from-brand-400 hover:to-brand-300"
                      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isProcessing && selectedPlanId === plan.id ? 'Processing...' : 'Subscribe Now'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-6 mx-auto max-w-2xl px-4">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-200 text-center">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-10 sm:mt-12 text-center px-4">
        <p className="text-xs sm:text-sm text-white/60">
          All plans include a 14-day free trial. Cancel anytime.
        </p>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlanId && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlanId(null);
          }}
          planId={selectedPlanId}
          isYearly={isYearly}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
