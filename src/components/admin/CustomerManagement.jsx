import { useState, useEffect } from 'react';
import { Search, Users, Mail, DollarSign, ShoppingCart } from 'lucide-react';

/**
 * Customer Management Component - Shopify-style customer management
 */
export function CustomerManagement({ storeId }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [storeId]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // Mock data
      setCustomers([
        {
          _id: '1',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          totalSpent: 450.00,
          orderCount: 5,
          averageOrderValue: 90.00,
          createdAt: new Date(),
        },
        {
          _id: '2',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          totalSpent: 320.50,
          orderCount: 3,
          averageOrderValue: 106.83,
          createdAt: new Date(),
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-display">Customers</h1>
        <p className="text-white/70 mt-1">Manage your customer database</p>
      </div>

      {/* Search */}
      <div className="rounded-3xl border border-white/10 bg-ocean/65 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-400 mx-auto"></div>
            <p className="mt-4 text-white/60">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No customers found</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer._id}
              className="rounded-3xl border border-white/10 bg-ocean/65 p-6 hover:shadow-glow transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-500/20 rounded-full flex items-center justify-center border border-brand-400/30">
                    <span className="text-brand-300 font-semibold text-lg">
                      {customer.firstName?.[0] || customer.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-sm text-white/50">{customer.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/60">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Total Spent</span>
                  </div>
                  <span className="font-semibold text-white">
                    ${customer.totalSpent.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/60">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Orders</span>
                  </div>
                  <span className="font-semibold text-white">{customer.orderCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Avg. Order Value</span>
                  <span className="font-semibold text-white">
                    ${customer.averageOrderValue.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <button className="w-full px-4 py-2 text-sm font-medium text-brand-300 hover:bg-brand-500/10 rounded-xl transition">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
