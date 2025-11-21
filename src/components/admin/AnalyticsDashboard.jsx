import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Package,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api.js';

/**
 * Analytics Dashboard Component - Shopify-style analytics
 */
export function AnalyticsDashboard({ storeId }) {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [trafficSources, setTrafficSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [storeId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics data
      // This would typically come from your analytics API
      // For now, using mock data structure
      
      // Mock data - replace with actual API calls
      setStats({
        totalRevenue: 45231.89,
        totalOrders: 324,
        totalCustomers: 189,
        averageOrderValue: 139.58,
        conversionRate: 3.2,
        revenueChange: 12.5,
        ordersChange: 8.3,
        customersChange: 15.2,
      });

      setSalesData([
        { date: 'Mon', sales: 4000, orders: 24 },
        { date: 'Tue', sales: 3000, orders: 18 },
        { date: 'Wed', sales: 5000, orders: 30 },
        { date: 'Thu', sales: 4500, orders: 27 },
        { date: 'Fri', sales: 6000, orders: 35 },
        { date: 'Sat', sales: 5500, orders: 32 },
        { date: 'Sun', sales: 4800, orders: 28 },
      ]);

      setTopProducts([
        { name: 'Product A', sales: 12000, orders: 85 },
        { name: 'Product B', sales: 9800, orders: 72 },
        { name: 'Product C', sales: 7500, orders: 58 },
        { name: 'Product D', sales: 6200, orders: 45 },
        { name: 'Product E', sales: 5100, orders: 38 },
      ]);

      setTrafficSources([
        { name: 'Direct', value: 45, color: '#3b82f6' },
        { name: 'Organic Search', value: 30, color: '#10b981' },
        { name: 'Social Media', value: 15, color: '#f59e0b' },
        { name: 'Email', value: 10, color: '#ef4444' },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, format = (v) => v }) => (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-ocean/50 to-ocean/30 p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">{title}</p>
          <p className="text-2xl font-bold text-white mt-2 font-display">{format(value)}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 ${change >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
              {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
              <span className="text-sm text-white/50">vs last period</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-brand-500/20 rounded-2xl border border-brand-400/30">
          <Icon className="w-6 h-6 text-brand-300" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-display">Analytics Dashboard</h1>
        <p className="text-white/70 mt-1">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          change={stats.revenueChange}
          icon={DollarSign}
          format={(v) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersChange}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          change={stats.customersChange}
          icon={Users}
        />
        <StatCard
          title="Average Order Value"
          value={stats.averageOrderValue}
          icon={TrendingUp}
          format={(v) => `$${v.toFixed(2)}`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 font-display">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="date" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(10, 25, 47, 0.95)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }} 
              />
              <Legend wrapperStyle={{ color: '#ffffff80' }} />
              <Line type="monotone" dataKey="sales" stroke="#1B98E0" strokeWidth={2} name="Sales ($)" />
              <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 font-display">Top Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(10, 25, 47, 0.95)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }} 
              />
              <Legend wrapperStyle={{ color: '#ffffff80' }} />
              <Bar dataKey="sales" fill="#1B98E0" name="Sales ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 font-display">Traffic Sources</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trafficSources}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-white/80">{source.name}</span>
                </div>
                <span className="font-semibold text-white">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

