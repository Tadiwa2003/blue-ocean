import { useState, useEffect } from 'react';
import { CreditCard, Lock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api.js';

/**
 * Enhanced Checkout Component - Shopify-style checkout with payment gateway integration
 */
export function EnhancedCheckout({ cartItems, onOrderComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Customer Information
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  
  // Shipping Address
  const [shippingAddress, setShippingAddress] = useState({
    address1: '',
    address2: '',
    city: '',
    province: '',
    country: 'US',
    zip: '',
  });
  
  // Billing Address
  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
    address1: '',
    address2: '',
    city: '',
    province: '',
    country: 'US',
    zip: '',
  });
  
  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState(null);
  const [shippingMethods] = useState([
    { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-7' },
    { id: 'express', name: 'Express Shipping', price: 12.99, days: '2-3' },
    { id: 'overnight', name: 'Overnight', price: 24.99, days: '1' },
  ]);
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  
  // Discount
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  
  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = shippingMethod?.price || 0;
  const tax = (subtotal + shipping - (appliedDiscount?.discountAmount || 0)) * 0.08; // 8% tax
  const discount = appliedDiscount?.discountAmount || 0;
  const total = subtotal + shipping + tax - discount;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }
    
    try {
      // TODO: Replace with actual API call
      // const response = await api.discounts.validate(discountCode, subtotal);
      
      // Mock discount validation
      if (discountCode.toUpperCase() === 'SAVE10') {
        setAppliedDiscount({
          code: discountCode.toUpperCase(),
          discountAmount: subtotal * 0.1,
          type: 'percentage',
        });
        setDiscountError('');
      } else {
        setDiscountError('Invalid discount code');
      }
    } catch (err) {
      setDiscountError('Failed to apply discount code');
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          variantId: item.variantId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        customer: customerInfo,
        shippingAddress,
        billingAddress: billingAddress.sameAsShipping ? shippingAddress : billingAddress,
        shippingMethod: {
          id: shippingMethod.id,
          name: shippingMethod.name,
          price: shippingMethod.price,
        },
        payment: {
          method: paymentMethod,
          cardDetails: paymentMethod === 'card' ? cardDetails : null,
        },
        pricing: {
          subtotal,
          shipping,
          tax,
          discount,
          total,
        },
        discountCode: appliedDiscount?.code,
      };
      
      // Process payment (mock - replace with actual payment gateway)
      if (paymentMethod === 'card') {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // TODO: Integrate with Stripe/PayPal/etc.
        // const paymentResult = await processPayment(cardDetails, total);
      }
      
      // Create order
      const orderResponse = await api.orders.createOrder(orderData);
      
      if (orderResponse.success) {
        onOrderComplete(orderResponse.data);
      } else {
        throw new Error(orderResponse.message || 'Failed to create order');
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Information', icon: '📧' },
    { number: 2, title: 'Shipping', icon: '🚚' },
    { number: 3, title: 'Payment', icon: '💳' },
    { number: 4, title: 'Review', icon: '✓' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-ocean/90 to-midnight/98 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold border-2 transition-all ${
                      step >= stepItem.number
                        ? 'bg-brand-500/20 border-brand-400 text-brand-200'
                        : 'bg-white/5 border-white/20 text-white/40'
                    }`}
                  >
                    {step >= stepItem.number ? '✓' : stepItem.number}
                  </div>
                  <span className="mt-2 text-sm font-medium text-white/80">
                    {stepItem.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded-full ${
                      step > stepItem.number ? 'bg-brand-400' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-300" />
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Step 1: Customer Information */}
            {step === 1 && (
              <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6">
                <h2 className="text-2xl font-bold mb-6 text-white font-display">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                        className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                        className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName}
                    className="px-6 py-3 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6">
                <h2 className="text-2xl font-bold mb-6 text-white font-display">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address1: e.target.value })}
                      className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Apartment, suite, etc.
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address2}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address2: e.target.value })}
                      className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.zip}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                        className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.province}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
                        className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Country *
                      </label>
                      <select
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="ZW">Zimbabwe</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">Shipping Method</h3>
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition ${
                          shippingMethod?.id === method.id
                            ? 'border-brand-400 bg-brand-500/20'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={shippingMethod?.id === method.id}
                          onChange={() => setShippingMethod(method)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white">{method.name}</span>
                            <span className="font-semibold text-white">${method.price.toFixed(2)}</span>
                          </div>
                          <span className="text-sm text-white/60">{method.days} business days</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-white/10 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!shippingAddress.address1 || !shippingAddress.city || !shippingAddress.zip || !shippingMethod}
                    className="px-6 py-3 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6">
                <h2 className="text-2xl font-bold mb-6 text-white font-display">Payment</h2>
                
                {/* Discount Code */}
                <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Discount Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                    />
                    <button
                      onClick={handleApplyDiscount}
                      className="px-6 py-2 border border-white/10 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white"
                    >
                      Apply
                    </button>
                  </div>
                  {discountError && (
                    <p className="mt-2 text-sm text-red-300">{discountError}</p>
                  )}
                  {appliedDiscount && (
                    <p className="mt-2 text-sm text-emerald-300">
                      Discount {appliedDiscount.code} applied: -${appliedDiscount.discountAmount.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <label className="flex items-center p-4 border-2 border-brand-400 bg-brand-500/20 rounded-2xl cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 mr-3 text-white" />
                    <span className="font-medium text-white">Credit Card</span>
                  </label>

                  {paymentMethod === 'card' && (
                    <div className="ml-8 space-y-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Expiry *
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            placeholder="123"
                            maxLength="4"
                            className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-white/60">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border border-white/10 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={paymentMethod === 'card' && (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv)}
                    className="px-6 py-3 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6">
                <h2 className="text-2xl font-bold mb-6 text-white font-display">Review Your Order</h2>
                
                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4 text-white">Items</h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white/10 rounded-2xl" />
                          <div>
                            <p className="font-medium text-white">{item.name}</p>
                            <p className="text-sm text-white/50">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-white">Shipping Address</h3>
                  <p className="text-white/80">
                    {customerInfo.firstName} {customerInfo.lastName}<br />
                    {shippingAddress.address1}<br />
                    {shippingAddress.city}, {shippingAddress.province} {shippingAddress.zip}<br />
                    {shippingAddress.country}
                  </p>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-white">Payment Method</h3>
                  <p className="text-white/80">
                    {paymentMethod === 'card' ? `Card ending in ${cardDetails.number.slice(-4)}` : paymentMethod}
                  </p>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 border border-white/10 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="px-8 py-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Complete Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4 text-white font-display">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Shipping</span>
                  <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'Calculated at next step'}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-300">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/80">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="w-full mt-4 px-4 py-2 border border-white/10 rounded-2xl hover:bg-white/10 text-white/80 hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

