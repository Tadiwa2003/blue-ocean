import { useState, useEffect } from 'react';
import { Button } from './Button.jsx';

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

export function Cart({ cartItems, isOpen, onClose, onRemoveItem, onUpdateQuantity, onClearCart, onCheckout }) {
  // Calculate total
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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = normalizePrice(item.price);
      return total + price * (item.quantity || 1);
    }, 0);
  };

  const total = calculateTotal();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

  // Prevent body scroll when cart is open
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex items-end sm:items-center justify-end sm:justify-center">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .cart-backdrop {
          animation: fadeIn 0.3s ease-out;
        }
        .cart-content {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-midnight/95 backdrop-blur-md cart-backdrop" onClick={onClose} />

      {/* Cart Content */}
      <div className="relative w-full sm:w-[500px] lg:w-[600px] h-full sm:h-auto sm:max-h-[90vh] bg-gradient-to-br from-ocean/95 to-midnight/98 border-l sm:border border-white/10 shadow-2xl cart-content flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="font-display text-2xl text-white">Shopping Cart</h2>
            <p className="text-sm text-white/60 mt-1">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/80 hover:text-white hover:bg-white/20 transition"
          >
            Close
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-lg font-semibold text-white mb-2">Your cart is empty</p>
              <p className="text-sm text-white/60">Add items to get started</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.cartId}
                className="flex gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={item.image || fallbackImage}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{item.name}</h3>
                  <p className="text-xs text-white/60 mt-1">
                    {item.color && `${item.color}`}
                    {item.color && item.size && ' • '}
                    {item.size && `${item.size}`}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10 transition flex items-center justify-center"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10 transition flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-brand-300">
                        {`$${(normalizePrice(item.price) * item.quantity).toFixed(2)}`}
                      </p>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.cartId)}
                        className="text-xs text-white/50 hover:text-brand-200 mt-1 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4 bg-gradient-to-t from-midnight/50 to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-2xl font-bold text-brand-300">${total.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClearCart} className="flex-1">
                Clear Cart
              </Button>
              <Button onClick={onCheckout || onClose} className="flex-1">
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

