import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Package, Truck } from 'lucide-react';

/**
 * Order Management Component - Shopify-style order management
 */
export function OrderManagement({ storeId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [storeId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // Mock data
      setOrders([
        {
          _id: '1',
          orderNumber: 'ORD-001',
          customerName: 'John Doe',
          email: 'john@example.com',
          total: 129.99,
          status: 'pending',
          paymentStatus: 'paid',
          fulfillmentStatus: 'unfulfilled',
          createdAt: new Date(),
          items: 3,
        },
        {
          _id: '2',
          orderNumber: 'ORD-002',
          customerName: 'Jane Smith',
          email: 'jane@example.com',
          total: 89.50,
          status: 'processing',
          paymentStatus: 'paid',
          fulfillmentStatus: 'partial',
          createdAt: new Date(),
          items: 2,
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      processing: 'bg-brand-500/20 text-brand-300 border border-brand-500/30',
      shipped: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      delivered: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      cancelled: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    };
    return colors[status] || 'bg-white/10 text-white/60 border border-white/10';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-display">Orders</h1>
        <p className="text-white/70 mt-1">Manage and fulfill customer orders</p>
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-white/10 bg-ocean/65 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order number, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white"
          >
            <option value="all" className="bg-ocean">All Status</option>
            <option value="pending" className="bg-ocean">Pending</option>
            <option value="processing" className="bg-ocean">Processing</option>
            <option value="shipped" className="bg-ocean">Shipped</option>
            <option value="delivered" className="bg-ocean">Delivered</option>
            <option value="cancelled" className="bg-ocean">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-white/10 bg-ocean/65 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-400 mx-auto"></div>
            <p className="mt-4 text-white/60">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No orders found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Fulfillment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{order.orderNumber}</p>
                      <p className="text-sm text-white/50">{order.items} item(s)</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{order.customerName}</p>
                      <p className="text-sm text-white/50">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/80">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.fulfillmentStatus === 'fulfilled'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : order.fulfillmentStatus === 'partial'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-white/10 text-white/60 border border-white/10'
                    }`}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-white/40 hover:text-brand-300 rounded-xl hover:bg-white/5">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
