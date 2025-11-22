import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../../services/api.js';

/**
 * Order Tracking Component - Customer order tracking with timeline
 */
export function OrderTracking({ orderId, orderNumber }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.orders.getOrderById(orderId);
      
      // Mock data
      setOrder({
        orderNumber: orderNumber || 'ORD-001',
        status: 'shipped',
        createdAt: new Date('2024-01-15'),
        estimatedDelivery: new Date('2024-01-20'),
        items: [
          { name: 'Product 1', quantity: 2, price: 29.99 },
          { name: 'Product 2', quantity: 1, price: 49.99 },
        ],
        shippingAddress: {
          address1: '123 Main St',
          city: 'New York',
          province: 'NY',
          zip: '10001',
          country: 'US',
        },
        tracking: {
          number: '1Z999AA10123456784',
          carrier: 'UPS',
          url: 'https://www.ups.com/track',
        },
        timeline: [
          { status: 'pending', date: new Date('2024-01-15T10:00:00'), message: 'Order placed' },
          { status: 'processing', date: new Date('2024-01-15T14:30:00'), message: 'Order confirmed' },
          { status: 'processing', date: new Date('2024-01-16T09:00:00'), message: 'Order being prepared' },
          { status: 'shipped', date: new Date('2024-01-17T11:00:00'), message: 'Order shipped' },
        ],
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-emerald-400" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-brand-400" />;
      case 'processing':
        return <Package className="w-6 h-6 text-amber-400" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-white/40" />;
      default:
        return <AlertCircle className="w-6 h-6 text-white/40" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'shipped':
        return 'bg-brand-500/20 text-brand-300 border border-brand-500/30';
      case 'processing':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'pending':
        return 'bg-white/10 text-white/60 border border-white/10';
      default:
        return 'bg-white/10 text-white/60 border border-white/10';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-400"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-300">{error || 'Order not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white font-display">Order {order.orderNumber}</h1>
            <p className="text-white/70 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>

        {/* Tracking Info */}
        {order.tracking && (
          <div className="bg-brand-500/20 border border-brand-400/30 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Tracking Number</p>
                <p className="font-mono font-semibold text-lg text-white">{order.tracking.number}</p>
                <p className="text-sm text-white/60 mt-1">Carrier: {order.tracking.carrier}</p>
              </div>
              <a
                href={order.tracking.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-500 text-white rounded-2xl hover:bg-brand-600"
              >
                Track Package
              </a>
            </div>
          </div>
        )}

        {/* Estimated Delivery */}
        {order.estimatedDelivery && (
          <div className="mb-6">
            <p className="text-sm text-white/60">Estimated Delivery</p>
            <p className="text-lg font-semibold text-white">
              {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )}

        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-white font-display">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl" />
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-white/50">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white font-display">Shipping Address</h2>
          <p className="text-white/80">
            {order.shippingAddress.address1}<br />
            {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}<br />
            {order.shippingAddress.country}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6">
        <h2 className="text-lg font-semibold mb-6 text-white font-display">Order Timeline</h2>
        <div className="relative">
          {order.timeline.map((event, index) => (
            <div key={index} className="flex gap-4 mb-6 last:mb-0">
              <div className="flex-shrink-0">
                {getStatusIcon(event.status)}
              </div>
              <div className="flex-1 pb-6 border-l-2 border-white/10 last:border-0">
                <div className="ml-4">
                  <p className="font-semibold text-white">{event.message}</p>
                  <p className="text-sm text-white/50 mt-1">
                    {new Date(event.date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

