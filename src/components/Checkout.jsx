import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  User, Mail, Phone, MapPin, Building, CreditCard, Lock, 
  ShoppingBag, CheckCircle, ArrowRight, ArrowLeft, X 
} from 'lucide-react';
import { Button } from './Button.jsx';
import { Logo } from './Logo.jsx';
import api from '../services/api.js';

const fallbackImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#1da0e6" />
          <stop offset="100%" stop-color="#0b233e" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#grad)" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="32" fill="rgba(255,255,255,0.85)">
        Blue Ocean
      </text>
    </svg>
  `);

export function Checkout({ cartItems, isOpen, onClose, onOrderComplete }) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Shipping
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Zimbabwe',
    // Payment
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'card',
  });

  const containerRef = useRef(null);
  const formRef = useRef(null);

  // Calculate totals
  const normalizePrice = (price) => {
    if (typeof price === 'number') {
      return price;
    }
    if (typeof price === 'string') {
      const numeric = parseFloat(price.replace(/[^0-9.]/g, ''));
      return Number.isFinite(numeric) ? numeric : 0;
    }
    return 0;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = normalizePrice(item.price);
      return total + price * (item.quantity || 1);
    }, 0);
  };

  const shippingCost = 15.00;
  const taxRate = 0.15;
  const subtotal = calculateSubtotal();
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when checkout is open
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

  // GSAP animations
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const form = formRef.current;

    // Entrance animation
    gsap.fromTo(
      container,
      {
        opacity: 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out',
      }
    );

    // Form fields animation
    if (form) {
      const fields = form.querySelectorAll('input, select, textarea');
      gsap.fromTo(
        fields,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.05,
          delay: 0.2,
        }
      );
    }

    return () => {
      gsap.killTweensOf([container, form]);
    };
  }, [isOpen, step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Validation helper
  const validateForm = () => {
    // Validate shipping info
    if (!formData.firstName?.trim()) {
      return 'First name is required';
    }
    if (!formData.lastName?.trim()) {
      return 'Last name is required';
    }
    if (!formData.email?.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address';
    }
    if (!formData.phone?.trim()) {
      return 'Phone number is required';
    }
    if (!formData.address?.trim()) {
      return 'Address is required';
    }
    if (!formData.city?.trim()) {
      return 'City is required';
    }
    if (!formData.zipCode?.trim()) {
      return 'Zip code is required';
    }
    
    // Validate payment info
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber?.trim() || formData.cardNumber.replace(/\s/g, '').length < 13) {
        return 'Please enter a valid card number';
      }
      if (!formData.cardName?.trim()) {
        return 'Cardholder name is required';
      }
      if (!formData.expiryDate?.trim() || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        return 'Please enter a valid expiry date (MM/YY)';
      }
      if (!formData.cvv?.trim() || formData.cvv.length < 3) {
        return 'Please enter a valid CVV';
      }
    }
    
    // Validate cart
    if (!cartItems || cartItems.length === 0) {
      return 'Your cart is empty';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsProcessing(false);
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: normalizePrice(item.price),
          quantity: item.quantity || 1,
          image: item.image,
        })),
        shippingInfo: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          zipCode: formData.zipCode.trim(),
          country: formData.country,
        },
        paymentInfo: {
          method: formData.paymentMethod,
          cardNumber: formData.paymentMethod === 'card' ? formData.cardNumber.replace(/\s/g, '') : undefined,
          cardName: formData.paymentMethod === 'card' ? formData.cardName.trim() : undefined,
          expiryDate: formData.paymentMethod === 'card' ? formData.expiryDate : undefined,
          cvv: formData.paymentMethod === 'card' ? formData.cvv : undefined,
        },
        total: parseFloat(total.toFixed(2)),
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: parseFloat(shippingCost.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
      };

      // Create order via API
      const response = await api.orders.createOrder(orderData);

      if (response.success) {
        setIsProcessing(false);
        if (onOrderComplete) {
          onOrderComplete({
            orderId: response.data?.order?.orderNumber || response.data?.order?.id || `BO-${Date.now()}`,
            items: cartItems,
            total,
            shipping: formData,
          });
        }
        onClose();
      } else {
        setError(response.message || 'Failed to create order. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Order creation error:', err);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to create order. Please try again.';
      
      if (err.message) {
        if (err.message.includes('network') || err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
        } else if (err.message.includes('401') || err.message.includes('unauthorized')) {
          errorMessage = 'Please sign in to complete your order.';
        } else if (err.message.includes('400') || err.message.includes('validation')) {
          errorMessage = err.message;
        } else if (err.message.length < 150) {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

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
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .checkout-backdrop {
          animation: fadeIn 0.3s ease-out;
        }
        .animated-blob {
          animation: blob 7s infinite;
        }
        .animated-blob-delay-1 {
          animation: blob 7s infinite;
          animation-delay: 2s;
        }
        .animated-blob-delay-2 {
          animation: blob 7s infinite;
          animation-delay: 4s;
        }
      `}</style>

      {/* Backdrop with Animated Blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-midnight via-ocean/90 to-midnight/98 backdrop-blur-lg checkout-backdrop overflow-hidden" onClick={onClose}>
        {/* Animated Gradient Blobs */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-brand-500/20 rounded-full mix-blend-screen filter blur-3xl animated-blob" />
        <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animated-blob-delay-1" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl animated-blob-delay-2" />
      </div>

      {/* Checkout Content */}
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-ocean/95 to-midnight/98 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-4">
            <Logo className="scale-75" />
            <div>
              <h2 className="font-display text-2xl text-white">Checkout</h2>
              <p className="text-sm text-white/60 mt-1">
                Step {step} of 3
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 p-2 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            aria-label="Close checkout"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-white/10 bg-white/3">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    step >= s
                      ? 'border-brand-400 bg-brand-500/20 text-brand-200'
                      : 'border-white/20 bg-white/5 text-white/40'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 w-16 transition-all ${
                      step > s ? 'bg-brand-400' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-16 mt-2 text-xs text-white/60">
            <span className={step === 1 ? 'text-brand-200 font-semibold' : ''}>Shipping</span>
            <span className={step === 2 ? 'text-brand-200 font-semibold' : ''}>Payment</span>
            <span className={step === 3 ? 'text-brand-200 font-semibold' : ''}>Review</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div ref={formRef} className="lg:col-span-2 space-y-6">
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                  {error}
                </div>
              )}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-brand-500/20 border border-brand-400/30">
                      <MapPin className="h-5 w-5 text-brand-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Shipping Information</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                          placeholder="John"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                        placeholder="+263 77 123 4567"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">City</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                          placeholder="Harare"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">Zip Code</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                          placeholder="00000"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">Country</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 z-10 pointer-events-none" />
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer"
                          required
                        >
                          <option value="Zimbabwe">Zimbabwe</option>
                          <option value="South Africa">South Africa</option>
                          <option value="Botswana">Botswana</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-brand-500/20 border border-brand-400/30">
                      <CreditCard className="h-5 w-5 text-brand-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Payment Information</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Payment Method</label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {['card', 'ecocash', 'omari'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: method }))}
                          className={`rounded-xl border p-4 text-center transition ${
                            formData.paymentMethod === method
                              ? 'border-brand-400 bg-brand-500/20 text-white'
                              : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                          }`}
                        >
                          <span className="text-sm font-semibold capitalize">{method}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {formData.paymentMethod === 'card' && (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white/80">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => {
                              const formatted = formatCardNumber(e.target.value);
                              setFormData((prev) => ({ ...prev, cardNumber: formatted }));
                            }}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white/80">Cardholder Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                            placeholder="JOHN DOE"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white/80">Expiry Date</label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) => {
                                const formatted = formatExpiryDate(e.target.value);
                                setFormData((prev) => ({ ...prev, expiryDate: formatted }));
                              }}
                              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                              placeholder="MM/YY"
                              maxLength="5"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white/80">CVV</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, '').substring(0, 3);
                                setFormData((prev) => ({ ...prev, cvv: v }));
                              }}
                              className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                              placeholder="123"
                              maxLength="3"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.paymentMethod === 'ecocash' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">EcoCash Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                          placeholder="077 123 4567"
                          required
                        />
                      </div>
                    </div>
                  )}
                  {formData.paymentMethod === 'omari' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-white/80">OMARI Account Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <input
                          type="text"
                          name="accountNumber"
                          value={formData.accountNumber || ''}
                          onChange={handleInputChange}
                          className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:border-brand-400/50 focus:bg-white/10 transition-all duration-300"
                          placeholder="Enter your OMARI account"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-brand-500/20 border border-brand-400/30">
                      <CheckCircle className="h-5 w-5 text-brand-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Order Review</h3>
                  </div>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.cartId} className="flex gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={item.image || fallbackImage}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = fallbackImage;
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{item.name}</h4>
                          <p className="text-xs text-white/60 mt-1">
                            Quantity: {item.quantity} × ${parseFloat(item.price.replace('$', '')).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-brand-300">
                            ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                    <h4 className="font-semibold text-white mb-3">Shipping Details</h4>
                    <p className="text-sm text-white/80">{formData.firstName} {formData.lastName}</p>
                    <p className="text-sm text-white/80">{formData.address}</p>
                    <p className="text-sm text-white/80">{formData.city}, {formData.zipCode}</p>
                    <p className="text-sm text-white/80">{formData.country}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-sm p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="h-5 w-5 text-brand-300" />
                  <h3 className="text-lg font-semibold text-white">Order Summary</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/80">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between text-lg font-bold text-white">
                    <span>Total</span>
                    <span className="text-brand-300">${total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  {step > 1 && (
                    <Button variant="secondary" onClick={handleBack} className="w-full flex items-center justify-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button onClick={handleNext} className="w-full flex items-center justify-center gap-2">
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Complete Order
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

