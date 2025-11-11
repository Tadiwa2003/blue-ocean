import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './Button.jsx';
import { Logo } from './Logo.jsx';
import { CreditCard, Lock, CheckCircle, X, Shield, Calendar, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const subscriptionPlans = {
  basic: {
    name: 'Basic',
    price: 29,
    yearlyPrice: 290,
    period: 'month',
    features: [
      'Up to 10 products',
      'Up to 5 services',
      'Basic analytics',
      'Email support',
      'Mobile-responsive storefront',
    ],
  },
  professional: {
    name: 'Professional',
    price: 79,
    yearlyPrice: 790,
    period: 'month',
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
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    yearlyPrice: 1990,
    period: 'month',
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
  },
};

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function PaymentModal({ isOpen, onClose, planId, isYearly = false, onPaymentSuccess }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('payment'); // 'payment' or 'success'
  const [showCvv, setShowCvv] = useState(false);
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const overlayRef = useRef(null);

  const plan = subscriptionPlans[planId];
  const displayPrice = isYearly ? (plan?.yearlyPrice || plan?.price) : plan?.price;
  const displayPeriod = isYearly ? 'year' : plan?.period;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        email: '',
      });
      setError('');
      setIsProcessing(false);
      setStep('payment');
    }
  }, [isOpen, planId]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape' && step === 'payment') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, step]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // GSAP animations with ScrollTrigger-like effects
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const form = formRef.current;
    const overlay = overlayRef.current;

    // Overlay fade in
    if (overlay) {
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    }

    // Modal entrance animation with scale and fade
    gsap.fromTo(
      container,
      {
        opacity: 0,
        scale: 0.95,
        y: 20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
        delay: 0.1,
      }
    );

    // Form fields animation with stagger
    if (form && step === 'payment') {
      const fields = form.querySelectorAll('input, label');
      gsap.fromTo(
        fields,
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.08,
          delay: 0.3,
        }
      );
    }

    return () => {
      gsap.killTweensOf([container, form, overlay]);
    };
  }, [isOpen, step]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{13,19}$/)) {
      setError('Please enter a valid card number.');
      return false;
    }
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      setError('Please enter a valid expiry date (MM/YY).');
      return false;
    }
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      setError('Please enter a valid CVV.');
      return false;
    }
    if (!formData.cardholderName.trim()) {
      setError('Please enter the cardholder name.');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, this would call a payment API
    // For now, we'll simulate a successful payment
    setIsProcessing(false);
    setStep('success');

    // Call success callback after a short delay
    setTimeout(() => {
      if (onPaymentSuccess) {
        onPaymentSuccess(planId);
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1004] flex items-center justify-center p-4">
          {/* Backdrop with blur - matching ContactModal */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-midnight/98 backdrop-blur-lg"
            onClick={step === 'payment' ? onClose : undefined}
          />

          {/* Modal Content - matching ContactModal style */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-ocean/95 to-midnight/98 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header - matching ContactModal style */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-4">
                <Logo className="scale-75" />
                <div>
                  <h2 className="font-display text-2xl text-white">
                    {step === 'payment' ? 'Complete Payment' : 'Payment Successful!'}
                  </h2>
                  <p className="text-sm text-white/60 mt-1">
                    {step === 'payment' 
                      ? `Subscribe to ${plan?.name} Plan - $${displayPrice}/${displayPeriod}`
                      : 'Your subscription is now active'}
                  </p>
                </div>
              </div>
              {step === 'payment' && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/20 bg-white/10 p-2 text-white/80 hover:text-white hover:bg-white/20 transition"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {step === 'payment' ? (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Plan Summary */}
                  <div className="rounded-xl border border-brand-400/30 bg-brand-500/10 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white text-lg">{plan?.name} Plan</h3>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-white">${displayPrice}</span>
                        <span className="text-white/60 text-sm">/{displayPeriod}</span>
                      </div>
                    </div>
                    <ul className="space-y-2 mt-4">
                      {plan?.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle className="h-4 w-4 text-brand-200 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Number */}
                  <div className="space-y-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-white/80">
                      <CreditCard className="inline h-4 w-4 mr-2" />
                      Card Number *
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full h-11 pl-4 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Cardholder Name */}
                  <div className="space-y-2">
                    <label htmlFor="cardholderName" className="block text-sm font-medium text-white/80">
                      Cardholder Name *
                    </label>
                    <input
                      id="cardholderName"
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full h-11 pl-4 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-white/80">
                        Expiry Date *
                      </label>
                      <input
                        id="expiryDate"
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full h-11 pl-4 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="cvv" className="block text-sm font-medium text-white/80">
                        CVV *
                      </label>
                      <div className="relative">
                        <input
                          id="cvv"
                          type={showCvv ? "text" : "password"}
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={4}
                          className="w-full h-11 pl-4 pr-4 pr-9 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCvv(!showCvv)}
                          className="absolute inset-y-0 right-0 flex h-full w-9 items-center justify-center rounded-r-xl text-white/60 hover:text-white/90 transition-colors"
                          aria-label={showCvv ? "Hide CVV" : "Show CVV"}
                        >
                          {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-white/80">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full h-11 pl-4 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Security Info */}
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-200 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-white/90 font-medium mb-1">Secure Payment</p>
                      <p className="text-xs text-white/70">
                        Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Pay ${displayPrice}/{displayPeriod}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="rounded-full bg-emerald-500/20 p-6 mb-6 border border-emerald-500/30"
                  >
                    <CheckCircle className="h-16 w-16 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">Payment Successful!</h3>
                  <p className="text-white/70 mb-6 max-w-md leading-relaxed">
                    Your {plan?.name} Plan subscription is now active. You can start using all the features immediately.
                  </p>
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 w-full max-w-md backdrop-blur-sm">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm">Plan:</span>
                        <span className="font-semibold text-white">{plan?.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm">Amount:</span>
                        <span className="font-semibold text-white">${displayPrice}/{displayPeriod}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <span className="text-white/70 text-sm">Next billing:</span>
                        <span className="font-semibold text-white">
                          {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setStep('payment');
                      onClose();
                    }}
                    className="mt-6 bg-brand-500 hover:bg-brand-400"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

