import { useState, useEffect } from 'react';
import { Plus, Search, Tag, Calendar, Percent } from 'lucide-react';
import { Button } from '../Button.jsx';

/**
 * Discount Management Component - Shopify-style discount management
 */
export function DiscountManagement({ storeId }) {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDiscounts();
  }, [storeId]);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // Mock data
      setDiscounts([
        {
          _id: '1',
          title: 'Summer Sale',
          code: 'SUMMER20',
          discountType: 'percentage',
          value: 20,
          status: 'active',
          usageCount: 45,
          usageLimit: 100,
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
          _id: '2',
          title: 'Free Shipping',
          code: 'FREESHIP',
          discountType: 'free_shipping',
          value: 0,
          status: 'active',
          usageCount: 12,
          usageLimit: null,
          startsAt: new Date(),
          endsAt: null,
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      setLoading(false);
    }
  };

  const filteredDiscounts = discounts.filter(discount =>
    discount.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDiscountDisplay = (discount) => {
    switch (discount.discountType) {
      case 'percentage':
        return `${discount.value}% OFF`;
      case 'fixed_amount':
        return `$${discount.value} OFF`;
      case 'free_shipping':
        return 'FREE SHIPPING';
      default:
        return discount.value;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Discounts</h1>
          <p className="text-white/70 mt-1">Create and manage discount codes</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Discount
        </Button>
      </div>

      {/* Search */}
      <div className="rounded-3xl border border-white/10 bg-ocean/65 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
          <input
            type="text"
            placeholder="Search discounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white placeholder-white/40"
          />
        </div>
      </div>

      {/* Discounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-400 mx-auto"></div>
            <p className="mt-4 text-white/60">Loading discounts...</p>
          </div>
        ) : filteredDiscounts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Tag className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No discounts found</p>
            <Button className="mt-4">Create Your First Discount</Button>
          </div>
        ) : (
          filteredDiscounts.map((discount) => (
            <div
              key={discount._id}
              className="rounded-3xl border border-white/10 bg-ocean/65 p-6 hover:shadow-glow transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">{discount.title}</h3>
                  <p className="text-sm text-white/50 mt-1">Code: {discount.code}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    discount.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : discount.status === 'expired'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-white/10 text-white/60 border border-white/10'
                  }`}
                >
                  {discount.status}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-2xl font-bold text-brand-300">
                  {discount.discountType === 'percentage' && <Percent className="w-6 h-6" />}
                  {getDiscountDisplay(discount)}
                </div>
              </div>

              <div className="space-y-2 text-sm text-white/60 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(discount.startsAt).toLocaleDateString()}
                    {discount.endsAt && ` - ${new Date(discount.endsAt).toLocaleDateString()}`}
                  </span>
                </div>
                <div>
                  Used: {discount.usageCount}
                  {discount.usageLimit && ` / ${discount.usageLimit}`}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 text-sm font-medium text-brand-300 hover:bg-brand-500/10 rounded-xl transition">
                  Edit
                </button>
                <button className="flex-1 px-4 py-2 text-sm font-medium text-white/60 hover:bg-white/5 rounded-xl transition">
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
