import { useMemo, useState, useEffect } from 'react';
import { Button } from '../components/Button.jsx';
import { Logo } from '../components/Logo.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useServices } from '../hooks/useServices.js';
import { analyticsBreakdown } from '../data/analytics.js';
import { AddProductModal } from '../components/AddProductModal.jsx';
import { AddServiceModal } from '../components/AddServiceModal.jsx';
import { AnimatedRadialChart } from '../components/ui/AnimatedRadialChart.jsx';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/AreaChart.jsx';
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, Server, Shield, Zap, Activity } from 'lucide-react';
import CountUp from 'react-countup';
import { DonutChart } from '../components/ui/DonutChart.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api.js';
import { SubscriptionPage } from '../pages/SubscriptionPage.jsx';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'products', label: 'Products', icon: '👜' },
  { id: 'spaServices', label: 'Beauty Spa', icon: '💆' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'storefront', label: 'Storefront', icon: '🛍️' },
  { id: 'subscription', label: 'Subscription', icon: '💳' },
  { id: 'reports', label: 'Reports', icon: '📑' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'orders', label: 'Orders', icon: '📦' },
  { id: 'customers', label: 'Customers', icon: '🤝' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

const metricSummary = [
  {
    label: 'Total Sales',
    value: '$45,960.00',
    icon: '💠',
    tone: 'from-brand-500/30 to-brand-500/10',
  },
  {
    label: 'Products',
    value: '67',
    icon: '🧺',
    tone: 'from-emerald-500/30 to-emerald-500/10',
  },
  {
    label: 'Orders',
    value: '12',
    icon: '🛒',
    tone: 'from-amber-500/30 to-amber-500/10',
  },
];

const analyticsTiles = [
  {
    label: 'Gross Volume',
    value: '$83,902.00',
    delta: '+12.5%',
    icon: '📈',
    tone: 'from-brand-500/30 to-brand-500/10',
  },
  {
    label: 'Total Orders',
    value: '1,234',
    delta: '+8.2%',
    icon: '🛍️',
    tone: 'from-emerald-500/30 to-emerald-500/10',
  },
  {
    label: 'Revenue',
    value: '$67,450.00',
    delta: '+15.3%',
    icon: '💸',
    tone: 'from-amber-500/30 to-amber-500/10',
  },
];

const salesTrendData = {
  Week: [
    { period: 'Mon', sales: 4000, profit: 2400, orders: 32 },
    { period: 'Tue', sales: 3000, profit: 2100, orders: 28 },
    { period: 'Wed', sales: 9200, profit: 6100, orders: 65 },
    { period: 'Thu', sales: 3600, profit: 2600, orders: 30 },
    { period: 'Fri', sales: 4800, profit: 3100, orders: 42 },
    { period: 'Sat', sales: 5500, profit: 3600, orders: 48 },
    { period: 'Sun', sales: 6100, profit: 3900, orders: 52 },
  ],
  Month: [
    { period: 'Week 1', sales: 18200, profit: 12100, orders: 145 },
    { period: 'Week 2', sales: 22400, profit: 14800, orders: 178 },
    { period: 'Week 3', sales: 19800, profit: 13200, orders: 156 },
    { period: 'Week 4', sales: 25600, profit: 17100, orders: 201 },
  ],
  Quarter: [
    { period: 'Jan', sales: 86000, profit: 57200, orders: 680 },
    { period: 'Feb', sales: 92400, profit: 61600, orders: 735 },
    { period: 'Mar', sales: 98200, profit: 65400, orders: 782 },
  ],
};

const spaAnalyticsTiles = [
  {
    label: 'Spa Revenue',
    value: '$18,240.00',
    delta: '+9.1%',
    icon: '💆',
    tone: 'from-purple-500/30 to-purple-500/10',
  },
  {
    label: 'Average Ticket',
    value: '$142.00',
    delta: '+4.2%',
    icon: '💳',
    tone: 'from-emerald-500/30 to-emerald-500/10',
  },
  {
    label: 'Guest Repeat Rate',
    value: '37%',
    delta: '+6.5%',
    icon: '🔁',
    tone: 'from-amber-500/30 to-amber-500/10',
  },
];

const spaTrendData = {
  Week: [
    { period: 'Mon', bookings: 5, revenue: 620, profit: 390, repeat: 0.35 },
    { period: 'Tue', bookings: 4, revenue: 540, profit: 330, repeat: 0.31 },
    { period: 'Wed', bookings: 7, revenue: 910, profit: 580, repeat: 0.4 },
    { period: 'Thu', bookings: 6, revenue: 820, profit: 510, repeat: 0.38 },
    { period: 'Fri', bookings: 8, revenue: 1120, profit: 720, repeat: 0.42 },
    { period: 'Sat', bookings: 10, revenue: 1450, profit: 960, repeat: 0.44 },
    { period: 'Sun', bookings: 8, revenue: 1180, profit: 760, repeat: 0.39 },
  ],
  Month: [
    { period: 'Week 1', bookings: 42, revenue: 5580, profit: 3540, repeat: 0.33 },
    { period: 'Week 2', bookings: 48, revenue: 6320, profit: 4010, repeat: 0.35 },
    { period: 'Week 3', bookings: 51, revenue: 6780, profit: 4300, repeat: 0.37 },
    { period: 'Week 4', bookings: 55, revenue: 7560, profit: 4800, repeat: 0.39 },
  ],
  Quarter: [
    { period: 'Jan', bookings: 168, revenue: 21450, profit: 13520, repeat: 0.34 },
    { period: 'Feb', bookings: 182, revenue: 22860, profit: 14430, repeat: 0.36 },
    { period: 'Mar', bookings: 198, revenue: 24540, profit: 15480, repeat: 0.38 },
  ],
};

const recentOrders = [
  { customer: 'Solomon Johnson', items: 5, amount: '$67,000.00', status: 'Paid', date: '2 Jan 2025 · 21:29' },
  { customer: 'Tochukwu Michael', items: 5, amount: '$67,000.00', status: 'Paid', date: '2 Jan 2025 · 21:29' },
  { customer: 'Jane John', items: 1, amount: '$67,000.00', status: 'Pending', date: '2 Jan 2025 · 21:29' },
  { customer: 'Sierra Moyo', items: 2, amount: '$24,600.00', status: 'Pending', date: '1 Jan 2025 · 18:02' },
  { customer: 'Thandiwe K.', items: 3, amount: '$31,800.00', status: 'Paid', date: '30 Dec 2024 · 16:41' },
];

const ordersTable = [
  { customer: 'Solomon Johnson', total: 5, amount: '$67,000.00', status: 'Paid', datetime: '2 Jan 2025 · 21:29' },
  { customer: 'Tochukwu Michael', total: 5, amount: '$67,000.00', status: 'Paid', datetime: '2 Jan 2025 · 21:29' },
  { customer: 'Jane John', total: 1, amount: '$67,000.00', status: 'Pending', datetime: '2 Jan 2025 · 21:29' },
  { customer: 'Tochukwu Michael', total: 5, amount: '$67,000.00', status: 'Paid', datetime: '2 Jan 2025 · 21:29' },
  { customer: 'Jane John', total: 1, amount: '$67,000.00', status: 'Pending', datetime: '2 Jan 2025 · 21:29' },
  { customer: 'Jane John', total: 1, amount: '$67,000.00', status: 'Pending', datetime: '2 Jan 2025 · 21:29' },
  { customer: 'Tochukwu Michael', total: 5, amount: '$67,000.00', status: 'Paid', datetime: '2 Jan 2025 · 21:29' },
  { customer: 'Jane John', total: 1, amount: '$67,000.00', status: 'Pending', datetime: '2 Jan 2025 · 21:29' },
  { customer: 'Jane John', total: 1, amount: '$67,000.00', status: 'Pending', datetime: '2 Jan 2025 · 21:29' },
  { customer: 'Mr. Bolaji Diamond', total: 4, amount: '$67,000.00', status: 'Paid', datetime: '2 Jan 2025 · 21:29' },
];

const productStatusStyles = {
  Published: 'text-emerald-400',
  'Out of stock': 'text-rose-400',
  Draft: 'text-amber-300',
  Unpublished: 'text-sky-300',
};

const beautySpaBookings = [
  {
    client: 'Samantha Chikosi',
    service: 'Oceanstone Glow Facial',
    therapist: 'Nyasha M.',
    date: 'Mon · Jan 13 • 09:30',
    status: 'Confirmed',
    amount: '$125',
  },
  {
    client: 'Wangari N.',
    service: 'Tidal Stone Therapy',
    therapist: 'Chelsea K.',
    date: 'Mon · Jan 13 • 13:00',
    status: 'Pending',
    amount: '$135',
  },
  {
    client: 'Kim Moyo',
    service: 'Seaweed Wrap Ritual',
    therapist: 'Mutsa P.',
    date: 'Tue · Jan 14 • 11:00',
    status: 'Confirmed',
    amount: '$155',
  },
  {
    client: 'Solomon Johnson',
    service: 'Coastal Aromatherapy Massage',
    therapist: 'Tariro M.',
    date: 'Wed · Jan 15 • 16:30',
    status: 'Awaiting Payment',
    amount: '$145',
  },
  {
    client: 'Patience Dube',
    service: 'Pearl Infusion Facial',
    therapist: 'Chelsea K.',
    date: 'Thu · Jan 16 • 10:00',
    status: 'Confirmed',
    amount: '$140',
  },
  {
    client: 'Alvin Ndlovu',
    service: 'Reef-Safe Luxury Manicure',
    therapist: 'Nyasha M.',
    date: 'Fri · Jan 17 • 12:45',
    status: 'Cancelled',
    amount: '$65',
  },
];

const bookingStatusStyles = {
  Confirmed: 'text-emerald-300',
  Pending: 'text-amber-300',
  'Awaiting Payment': 'text-sky-300',
  Cancelled: 'text-rose-400',
};

const spaSalesBreakdown = [
  {
    service: 'Oceanstone Glow Facial',
    sessions: 68,
    revenue: 8500,
    avgTicket: 125,
    utilisation: 0.82,
  },
  {
    service: 'Tidal Stone Therapy',
    sessions: 54,
    revenue: 7290,
    avgTicket: 135,
    utilisation: 0.78,
  },
  {
    service: 'Seaweed Wrap Ritual',
    sessions: 41,
    revenue: 6355,
    avgTicket: 155,
    utilisation: 0.74,
  },
  {
    service: 'Pearl Infusion Facial',
    sessions: 46,
    revenue: 6440,
    avgTicket: 140,
    utilisation: 0.69,
  },
  {
    service: 'Reef-Safe Luxury Manicure',
    sessions: 52,
    revenue: 3380,
    avgTicket: 65,
    utilisation: 0.61,
  },
];

function Sidebar({ activeSection, onSelect, onSignOut, currentUser }) {
  return (
    <aside className="relative flex w-full max-w-[230px] flex-col gap-8 rounded-[32px] border border-white/10 bg-ocean/75 px-4 py-6 backdrop-blur-xl">
      <div className="px-2">
        <Logo className="text-sm" />
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/40">Signed in as</p>
        <p className="mt-1 text-sm font-semibold text-white">{currentUser?.name ?? 'Merchant'}</p>
        <p className="text-xs text-white/50">{currentUser?.role === 'owner' ? 'Owner · Full access' : 'Team member'}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition ${
              activeSection === item.id
                ? 'bg-brand-500/20 text-white'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <Button variant="secondary" className="w-full justify-center" onClick={onSignOut}>
        Sign Out
      </Button>
    </aside>
  );
}

function CopyShareLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          alert('Failed to copy link. Please copy manually: ' + window.location.href);
        }
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        alert('Failed to copy link. Please copy manually: ' + window.location.href);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <Button 
      className={copied ? 'bg-emerald-500/80 hover:bg-emerald-500' : 'bg-brand-500/80 hover:bg-brand-500'}
      onClick={handleCopy}
    >
      {copied ? '✓ Copied!' : 'Copy Share Link'}
    </Button>
  );
}

function DashboardHero({ currentUser, onViewStorefront, onViewSpaStorefront, subscription, onNavigateToSubscription }) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-ocean/90 via-ocean to-midnight/90 px-6 py-6 text-white shadow-glow">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-200/80">Hello, {currentUser?.name ?? 'Merchant'}</p>
          <h1 className="mt-2 font-display text-3xl">Welcome back to Blue Ocean HQ</h1>
          <p className="mt-2 text-sm text-white/70">
            Review capsule performance, publish storefront changes, and monitor guest experience all in one tide dashboard.
          </p>
          {!subscription && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/20 to-amber-500/10 p-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-200 mb-1">
                  ⚠️ <strong>Subscription Required</strong>
                </p>
                <p className="text-xs text-amber-200/80">
                  Subscribe to start selling and advertising your goods on Blue Ocean Marketplace.
                </p>
              </div>
              {onNavigateToSubscription && (
                <Button
                  onClick={onNavigateToSubscription}
                  className="bg-amber-500/80 hover:bg-amber-500 text-white whitespace-nowrap"
                >
                  Subscribe Now
                </Button>
              )}
            </div>
          )}
          {subscription && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-200 border border-emerald-500/30">
                ✓ {subscription.planName} Plan Active
              </span>
              <span className="text-white/70 text-sm">
                Renews {new Date(subscription.renewalDate).toLocaleDateString()}
              </span>
              {onNavigateToSubscription && (
                <button
                  onClick={onNavigateToSubscription}
                  className="text-xs text-brand-200 hover:text-brand-100 underline"
                >
                  Manage Subscription
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <Button variant="secondary" className="border-white/20 pr-10">
              <span className="mr-2">🛍️</span>
              Storefronts
            </Button>
            <div className="invisible absolute right-0 top-full z-30 mt-2 min-w-[220px] rounded-2xl border border-white/10 bg-ocean/95 p-2 text-left text-sm text-white/80 shadow-xl opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-xl px-4 py-2 transition hover:bg-white/10 hover:text-white"
                onClick={onViewStorefront}
              >
                <span className="text-lg">🛍️</span>
                Products Storefront
              </button>
              {onViewSpaStorefront && (
                <button
                  type="button"
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-4 py-2 transition hover:bg-white/10 hover:text-white"
                  onClick={onViewSpaStorefront}
                >
                  <span className="text-lg">💆</span>
                  Beauty Spa Storefront
                </button>
              )}
            </div>
          </div>
          <CopyShareLinkButton />
        </div>
      </div>
    </div>
  );
}

function MetricRow() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metricSummary.map((metric) => (
        <div
          key={metric.label}
          className={`rounded-3xl border border-white/10 bg-gradient-to-br ${metric.tone} px-5 py-4 text-white`}
        >
          <div className="flex items-center gap-3 text-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/20 text-lg">{metric.icon}</span>
            <span className="text-xs uppercase tracking-[0.3em] text-white/60">{metric.label}</span>
          </div>
          <p className="mt-4 text-2xl font-semibold">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}

function AnalyticsSummary() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6 text-white">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="font-display text-2xl">Analytics Overview</h2>
          <p className="text-sm text-white/70">Track performance trends and momentum across capsules.</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <span className="rounded-full border border-brand-400/40 bg-brand-500/20 px-3 py-1 text-xs font-semibold">
            Daily
          </span>
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">Last 7 days</span>
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">Monthly</span>
          <button className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 hover:border-brand-400/60 hover:text-white">
            View transactions
          </button>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {analyticsTiles.map((tile) => (
          <div
            key={tile.label}
            className={`rounded-3xl border border-white/10 bg-gradient-to-br ${tile.tone} px-5 py-4`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/20 text-lg">{tile.icon}</span>
              <div className="text-xs uppercase tracking-[0.3em] text-white/60">{tile.label}</div>
            </div>
            <p className="mt-4 text-2xl font-semibold text-white">{tile.value}</p>
            <p className="mt-2 text-xs text-emerald-300">{tile.delta} from last period</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SalesTrend() {
  const [timeframe, setTimeframe] = useState('Week');
  
  const currentData = salesTrendData[timeframe];

  const totalSales = currentData.reduce((sum, item) => sum + item.sales, 0);
  const totalProfit = currentData.reduce((sum, item) => sum + item.profit, 0);
  const totalOrders = currentData.reduce((sum, item) => sum + item.orders, 0);

  // Calculate percentage changes (simulated based on timeframe)
  const getChangeForMetric = (metric) => {
    const changes = {
      Week: { sales: 12, profit: 8, orders: 15 },
      Month: { sales: -5, profit: 3, orders: -8 },
      Quarter: { sales: 18, profit: 22, orders: 12 },
    };
    return changes[timeframe]?.[metric] || 0;
  };

  const chartConfig = {
    sales: {
      label: 'Sales',
      color: '#1da0e6',
    },
    profit: {
      label: 'Profit',
      color: '#3ed598',
    },
    orders: {
      label: 'Orders',
      color: '#facc15',
    },
  };

  // Latest data point for stats
  const latestData = currentData[currentData.length - 1];

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-ocean/80 to-ocean/60 p-8 text-white shadow-xl">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-brand-400/10 blur-2xl" />
      
      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-2">
          <h2 className="font-display text-3xl text-white">Sales & Trends</h2>
          <p className="text-sm text-white/70">Comprehensive view of sales and profit cadence.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            {['Week', 'Month', 'Quarter'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={[
                  'rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300',
                  timeframe === period
                    ? 'bg-brand-500/30 text-white shadow-[0_4px_20px_rgba(29,160,230,0.3)]'
                    : 'text-white/60 hover:bg-white/10 hover:text-white/80',
                ].join(' ')}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { key: 'sales', label: 'Sales', value: latestData.sales, total: totalSales, icon: '💠' },
          { key: 'profit', label: 'Profit', value: latestData.profit, total: totalProfit, icon: '💚' },
          { key: 'orders', label: 'Orders', value: latestData.orders, total: totalOrders, icon: '📦' },
        ].map((metric) => {
          const change = getChangeForMetric(metric.key);
          return (
            <div key={metric.key} className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-0.5 h-12 rounded-full bg-white/10"></div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium text-white/60">{metric.label}</div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl font-semibold leading-none">{metric.value.toLocaleString()}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {Math.abs(change)}%
                </span>
              </div>
              </div>
              </div>
            </div>
          );
        })}
          </div>
      
      {/* Chart */}
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-midnight/40 p-6 backdrop-blur-sm">
        <ChartContainer
          config={chartConfig}
          className="h-[400px] w-full"
        >
          <RechartsAreaChart
            accessibilityLayer
            data={currentData}
            margin={{
              top: 10,
              bottom: 10,
              left: 20,
              right: 20,
            }}
          >
          <defs>
              {/* Modern Abstract Background Pattern */}
              <pattern id="modernPattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <path
                  d="M0,16 L32,16 M16,0 L16,32"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="0.5"
                />
                <path
                  d="M0,0 L32,32 M0,32 L32,0"
                  stroke="rgba(255,255,255,0.02)"
                  strokeWidth="0.3"
                />
                <circle cx="8" cy="8" r="1.5" fill="rgba(255,255,255,0.04)" />
                <circle cx="24" cy="24" r="1.5" fill="rgba(255,255,255,0.04)" />
              </pattern>

              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1da0e6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1da0e6" stopOpacity={0.1} />
            </linearGradient>
              <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3ed598" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3ed598" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          
            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgba(255,255,255,0.1)" />

            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              interval={0}
            />

            <YAxis hide />

            <ChartTooltip
              cursor={{
                strokeDasharray: '4 4',
                stroke: 'rgba(29,160,230,0.6)',
                strokeWidth: 1,
              }}
              content={<ChartTooltipContent />}
              offset={20}
            />

            {/* Background Pattern Areas */}
            <Area
              dataKey="sales"
              type="natural"
              fill="url(#modernPattern)"
              fillOpacity={1}
              stroke="transparent"
              stackId="pattern"
              dot={false}
              activeDot={false}
            />
            <Area
              dataKey="profit"
              type="natural"
              fill="url(#modernPattern)"
              fillOpacity={1}
              stroke="transparent"
              stackId="pattern"
              dot={false}
              activeDot={false}
            />

            {/* Stacked Areas */}
            <Area
              dataKey="profit"
              type="natural"
              fill="url(#fillProfit)"
              fillOpacity={0.5}
              stroke="#3ed598"
              stackId="a"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#3ed598',
                stroke: 'white',
                strokeWidth: 1.5,
              }}
            />
            <Area
              dataKey="sales"
              type="natural"
              fill="url(#fillSales)"
              fillOpacity={0.4}
                        stroke="#1da0e6"
              stackId="a"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#1da0e6',
                stroke: 'white',
                strokeWidth: 1.5,
              }}
            />
          </RechartsAreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}

function RecentOrders() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">Recent Orders</h2>
          <p className="text-sm text-white/70">Latest transactions and guest activity.</p>
        </div>
        <button className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 hover:border-brand-400/60 hover:text-white">
          View all
        </button>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm text-white/70">
          <thead className="text-xs uppercase tracking-[0.3em] text-white/50">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Date/Time</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {recentOrders.map((order) => (
              <tr key={`${order.customer}-${order.date}`} className="hover:bg-white/5">
                <td className="px-4 py-3 text-white">{order.customer}</td>
                <td className="px-4 py-3">{order.items}</td>
                <td className="px-4 py-3">{order.date}</td>
                <td className="px-4 py-3">{order.amount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-200'
                        : 'bg-amber-500/20 text-amber-200'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersPanel() {
  return (
    <div className="space-y-6 text-white">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total order value', value: '$63,000.00' },
          { label: 'Total orders', value: '34' },
          { label: 'Completed orders', value: '23' },
          { label: 'Unpaid orders', value: '45' },
        ].map((metric) => (
          <div key={metric.label} className="rounded-3xl border border-white/10 bg-ocean/65 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">{metric.label}</p>
            <p className="mt-3 text-xl font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-ocean/65">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div>
            <h2 className="font-display text-2xl">Orders</h2>
            <p className="text-sm text-white/70">Track transactions, fulfillment status, and outstanding payments.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm text-white/70">
            <thead className="text-xs uppercase tracking-[0.3em] text-white/50">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Date/Time</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {ordersTable.map((order, index) => (
                <tr key={`${order.customer}-${index}`} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-white">{order.customer}</td>
                  <td className="px-6 py-4">{order.total}</td>
                  <td className="px-6 py-4">{order.datetime}</td>
                  <td className="px-6 py-4">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-200'
                          : 'bg-amber-500/20 text-amber-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-white/50">
          <span>919 results</span>
          <div className="flex gap-2">
            <button className="rounded-full border border-white/15 px-3 py-1 hover:text-white">Previous</button>
            <button className="rounded-full border border-white/15 px-3 py-1 hover:text-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsTable({ isOwner, onAddProduct, subscription, onViewStorefront }) {
  const { products: allProducts, loading } = useProducts();
  // Allow owners to add products even without subscription for testing/admin purposes
  const hasSubscription = !!subscription || isOwner;
  
  const productRows = useMemo(
    () => {
      if (!allProducts || allProducts.length === 0) return [];
      // Show all products, not just first 10
      return allProducts.filter((p) => p.category !== 'Beauty Spa Services').map((product, index) => ({
        ...product,
        status:
          index % 6 === 0
            ? 'Draft'
            : index % 5 === 0
            ? 'Unpublished'
            : index % 4 === 0
            ? 'Out of stock'
            : 'Published',
        stock: index % 4 === 0 ? 0 : (product.stock || 23),
      }));
    },
    [allProducts]
  );

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-ocean/65">
      <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl">Product Catalogue</h2>
          <p className="text-sm text-white/60">Manage assortment, pricing, and availability.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            className="border-white/20"
            onClick={() => {
              // Export functionality - could export to CSV/JSON
              const csv = [
                ['Name', 'Category', 'Price', 'Status'].join(','),
                ...productRows.map(p => [
                  `"${p.name}"`,
                  `"${p.category}"`,
                  `"${p.price}"`,
                  `"${p.status}"`
                ].join(','))
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export
          </Button>
          <Button
            onClick={onAddProduct}
            disabled={!isOwner}
            className={!isOwner ? 'cursor-not-allowed bg-white/10 text-white/40' : undefined}
            title={
              !isOwner 
                ? 'Only the Blue Ocean owner can add products'
                : 'Create a new Blue Ocean product'
            }
          >
            Add Product
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm text-white/70">
          <thead className="text-xs uppercase tracking-[0.3em] text-white/50">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">In stock</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {productRows.map((product) => (
              <tr key={product.id} className="hover:bg-white/5">
                <td className="px-6 py-4 text-white">{product.name}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${productStatusStyles[product.status]}`}>{product.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 text-xs text-white/50">
        <span>
          {loading ? 'Loading products...' : `Showing ${productRows.length} of ${allProducts?.filter((p) => p.category !== 'Beauty Spa Services').length || 0} products`}
        </span>
        {!loading && productRows.length === 0 && (
          <span className="text-white/60">No products found. Add your first product to get started.</span>
        )}
      </div>
    </div>
  );
}

function StorefrontPanel() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6 text-white">
      <h2 className="font-display text-2xl">Storefront</h2>
      <p className="mt-3 text-sm text-white/70">
        Blueprint your digital storefront with curated hero spots, capsule rails, and editorial campaigns. Preview responsive
        layouts before publishing to customers.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          'Hero Modules · Resort Capsule, Editorial Film, Gift Guide',
          'Content Blocks · Shoreline Journal, Maker Interviews, Scent Pairings',
          'Conversion Tools · Floating CTA, Gift With Purchase, Loyalty Tiers',
          'Publishing · Schedule updates and sync to in-store displays',
        ].map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function SpaServicesPanel({ onAddService, subscription, onViewSpaStorefront, isOwner }) {
  const { services: allServices, loading: servicesLoading } = useServices();
  // Allow owners to add services even without subscription for testing/admin purposes
  const hasSubscription = !!subscription || isOwner;
  
  const services = useMemo(
    () => allServices || [],
    [allServices]
  );

  const summary = useMemo(() => {
    const total = services.length;
    let durationSum = 0;
    let durationCount = 0;
    let premiumCount = 0;

    services.forEach((service) => {
      const durationBadge = service.badges?.find((badge) => badge.toLowerCase().includes('min'));
      if (durationBadge) {
        const numeric = parseInt(durationBadge.replace(/\D/g, ''), 10);
        if (!Number.isNaN(numeric)) {
          durationSum += numeric;
          durationCount += 1;
        }
      }
      if (service.badges?.some((badge) => /premium|signature|luxury/i.test(badge))) {
        premiumCount += 1;
      }
    });

    const averageDuration = durationCount ? Math.round(durationSum / durationCount) : null;

    return {
      total,
      averageDuration,
      premiumCount,
    };
  }, [services]);

  return (
    <div className="space-y-6 text-white">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Spa Services"
          value={summary.total}
          subtitle="Active beauty spa experiences"
        />
        <StatCard
          title="Average Duration"
          value={summary.averageDuration ? `${summary.averageDuration} min` : '—'}
          subtitle="Across all listed services"
        />
        <StatCard
          title="Premium Treatments"
          value={summary.premiumCount}
          subtitle="Signature & luxury offerings"
        />
      </div>

      <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Beauty Spa Services</h2>
            <p className="mt-2 text-sm text-white/70">
              Manage your treatment menu, highlight premium rituals, and align spa merchandising with seasonal demand.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="secondary" 
              className="border-white/20" 
              onClick={onAddService}
              disabled={!isOwner}
              title={isOwner ? 'Add a new beauty spa service' : 'Only the Blue Ocean owner can add services'}
            >
              Add New Service
            </Button>
            <Button 
              onClick={() => {
                if (onViewSpaStorefront) {
                  onViewSpaStorefront();
                } else {
                  // Fallback: show message or navigate
                  alert('Opening spa storefront...');
                }
              }}
            >
              Sync to Storefront
            </Button>
          </div>
        </div>

        {servicesLoading ? (
          <div className="mt-6 flex items-center justify-center py-12">
            <div className="text-white/60">Loading services...</div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-4 text-white/80 backdrop-blur"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-brand-200/80">{service.serviceCategory || service.category}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{service.name}</h3>
                  </div>
                  <span className="rounded-full border border-brand-400/40 bg-brand-500/20 px-3 py-1 text-sm font-semibold text-white">
                    {service.price}
                  </span>
                </div>
                {(service.description || service.headline) && (
                  <p className="mt-3 text-sm leading-relaxed">{service.description || service.headline}</p>
                )}
                {service.badges?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.badges.map((badge, idx) => (
                      <span
                        key={badge || idx}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-5 flex items-center justify-between text-xs text-white/60">
                  <span>Updated · {new Date().toLocaleDateString()}</span>
                  <button className="text-brand-200 hover:text-brand-100">View in storefront →</button>
                </div>
              </div>
            ))}
            {!services.length && !servicesLoading && (
              <div className="col-span-full rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-white/60">
                No spa services configured yet. Use "Add New Service" to build your menu.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SpaBookingsTable({ onSelect, onViewSpaStorefront }) {
  const stats = useMemo(() => {
    return beautySpaBookings.reduce(
      (acc, booking) => {
        const key = booking.status;
        acc[key] = (acc[key] || 0) + 1;
        acc.total += 1;
        return acc;
      },
      { total: 0 },
    );
  }, []);

  const handleExportWeek = () => {
    const csv = [
      ['Client', 'Service', 'Therapist', 'Date', 'Status', 'Amount'].join(','),
      ...beautySpaBookings.map(booking => [
        `"${booking.client}"`,
        `"${booking.service}"`,
        `"${booking.therapist}"`,
        `"${booking.date}"`,
        `"${booking.status}"`,
        `"${booking.amount}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const weekLabel = `${weekStart.toISOString().split('T')[0]}_to_${weekEnd.toISOString().split('T')[0]}`;
    a.download = `bookings-week-${weekLabel}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Bookings & Schedule</h2>
          <p className="mt-2 text-sm text-white/70">
            Track upcoming treatments, therapist assignments, and client status in real time.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="secondary" 
            className="border-white/20"
            onClick={handleExportWeek}
          >
            Export Week
          </Button>
          <Button onClick={() => {
            if (onViewSpaStorefront) {
              onViewSpaStorefront();
            } else if (onSelect) {
              onSelect('spaServices');
            }
          }}>
            Schedule Booking
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Total Bookings</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {stats.total || beautySpaBookings.length}
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Confirmed</p>
          <p className="mt-2 text-2xl font-semibold text-white">{stats.Confirmed ?? 0}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Pending</p>
          <p className="mt-2 text-2xl font-semibold text-white">{stats.Pending ?? 0}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Awaiting Payment</p>
          <p className="mt-2 text-2xl font-semibold text-white">{stats['Awaiting Payment'] ?? 0}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm text-white/70">
          <thead className="border-b border-white/10 text-xs uppercase tracking-[0.3em] text-white/50">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Therapist</th>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-sm">
            {beautySpaBookings.map((booking) => (
              <tr key={`${booking.client}-${booking.date}`}>
                <td className="px-4 py-3 text-white">{booking.client}</td>
                <td className="px-4 py-3">{booking.service}</td>
                <td className="px-4 py-3 text-white/80">{booking.therapist}</td>
                <td className="px-4 py-3 text-white/70">{booking.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                      bookingStatusStyles[booking.status] ?? 'text-white/80'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-white">{booking.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SpaAnalyticsPanel({ onSelect, onViewSpaStorefront }) {
  return (
    <div className="space-y-6 text-white">
      <SpaAnalyticsSummary />
      <SpaTrendChart />
      <SpaSalesTable onSelect={onSelect} />
      <SpaBookingsTable onSelect={onSelect} onViewSpaStorefront={onViewSpaStorefront} />
    </div>
  );
}

function ReportsPanel() {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('last-7-days');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real metrics from API
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/metrics?period=${selectedTimePeriod}`);
        if (response.success) {
          setMetrics(response.data);
        } else {
          setError('Failed to load metrics');
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load metrics. Using fallback data.');
        // Set fallback data
        setMetrics({
          summary: {
            totalRequests: 0,
            successRate: 100,
            averageResponseTime: 0,
            uptime: 0,
            uptimePercentage: 100,
          },
          dailyData: [],
          detailedMetrics: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [selectedTimePeriod]);

  const chartData = useMemo(() => {
    if (!metrics || !metrics.dailyData || metrics.dailyData.length === 0) {
      // Fallback empty data
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          'API Requests': 0,
          'Success Rate': 0,
          'Response Time': 0,
        };
      });
    }
    return metrics.dailyData;
  }, [metrics]);

  const timePeriodOptions = [
    { value: 'last-7-days', label: 'Last 7 Days' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
  ];

  // Calculate backend stats from real metrics
  const backendStats = useMemo(() => {
    if (!metrics) {
      return [
        {
          id: 'api-requests',
          title: 'API Requests',
          count: 0,
          countFrom: 0,
          comparisonText: 'No data available',
          percentage: 0,
          TrendIcon: TrendingUp,
          trendColor: 'text-emerald-400',
          trendBgColor: 'bg-emerald-500/20',
        },
        {
          id: 'uptime',
          title: 'Uptime',
          count: 0,
          countFrom: 0,
          comparisonText: 'Server starting up',
          percentage: 0,
          TrendIcon: TrendingUp,
          trendColor: 'text-emerald-400',
          trendBgColor: 'bg-emerald-500/20',
        },
      ];
    }

    const totalRequests = metrics.summary?.totalRequests || 0;
    const uptimePercentage = metrics.summary?.uptimePercentage || 0;

    // Calculate comparison (compare to previous period)
    const previousPeriodRequests = Math.floor(totalRequests * 0.9); // Simulated previous period
    const requestChange = totalRequests > 0
      ? Math.round(((totalRequests - previousPeriodRequests) / previousPeriodRequests) * 100)
      : 0;

    return [
      {
        id: 'api-requests',
        title: 'API Requests',
        count: totalRequests,
        countFrom: 0,
        comparisonText: `Total requests since server start`,
        percentage: requestChange,
        TrendIcon: requestChange >= 0 ? TrendingUp : TrendingDown,
        trendColor: requestChange >= 0 ? 'text-emerald-400' : 'text-rose-400',
        trendBgColor: requestChange >= 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20',
      },
      {
        id: 'uptime',
        title: 'Uptime',
        count: uptimePercentage,
        countFrom: 0,
        comparisonText: `${Math.floor((metrics.summary?.uptime || 0) / 3600)}h ${Math.floor(((metrics.summary?.uptime || 0) % 3600) / 60)}m uptime`,
        percentage: 0.3,
        TrendIcon: TrendingUp,
        trendColor: 'text-emerald-400',
        trendBgColor: 'bg-emerald-500/20',
      },
    ];
  }, [metrics]);

  const detailedMetrics = useMemo(() => {
    if (!metrics || !metrics.detailedMetrics) {
      return [
        {
          id: 'response-time',
          Icon: Zap,
          label: 'Avg Response Time',
          tooltip: 'Average API response time',
          value: '0ms',
          TrendIcon: TrendingDown,
          trendColor: 'text-emerald-400',
          delay: 0,
        },
        {
          id: 'success-rate',
          Icon: Shield,
          label: 'Success Rate',
          tooltip: 'API request success rate',
          value: '0%',
          TrendIcon: TrendingUp,
          trendColor: 'text-emerald-400',
          delay: 0.05,
        },
        {
          id: 'active-connections',
          Icon: Activity,
          label: 'Database Status',
          tooltip: 'MongoDB connection status',
          value: 'Connected',
          TrendIcon: TrendingUp,
          trendColor: 'text-emerald-400',
          delay: 0.1,
        },
      ];
    }

    return metrics.detailedMetrics.map((metric, index) => ({
      id: metric.id,
      Icon: metric.id === 'response-time' ? Zap : metric.id === 'success-rate' ? Shield : Activity,
      label: metric.label,
      tooltip: metric.tooltip || metric.label,
      value: metric.value,
      TrendIcon: metric.trend === 'down' || metric.trend === 'stable' ? TrendingDown : TrendingUp,
      trendColor: metric.trend === 'down' || metric.trend === 'stable' ? 'text-emerald-400' : 'text-rose-400',
      delay: index * 0.05,
    }));
  }, [metrics]);

  const chartConfig = {
    'API Requests': { label: 'API Requests', color: '#1da0e6' },
    'Success Rate': { label: 'Success Rate', color: '#3ed598' },
    'Response Time': { label: 'Response Time', color: '#facc15' },
  };

  return (
    <div className="space-y-6 text-white">
      {/* Main Backend Status Report */}
      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-ocean/90 via-ocean/80 to-midnight/90 p-8 text-white shadow-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="font-display text-3xl font-bold">Backend Status Report</h2>
            <p className="mt-2 text-sm text-white/70">Monitor API performance, uptime, and system health metrics.</p>
          </div>
          <select
            value={selectedTimePeriod}
            onChange={(e) => setSelectedTimePeriod(e.target.value)}
            className="bg-white/10 border border-white/20 text-white p-3 rounded-xl focus:ring-2 focus:ring-brand-400 outline-none transition-colors"
          >
            {timePeriodOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-ocean">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex gap-6 w-full mb-4">
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1da0e6' }} />
            <span className="text-white/70 text-xs">API Requests</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3ed598' }} />
            <span className="text-white/70 text-xs">Success Rate</span>
          </div>
        </div>

        {/* Chart */}
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-midnight/40 p-6 backdrop-blur-sm">
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <RechartsAreaChart data={chartData} margin={{ top: 10, bottom: 10, left: 20, right: 20 }}>
              <defs>
                <linearGradient id="fillApiRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1da0e6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1da0e6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillSuccessRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3ed598" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3ed598" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillResponseTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#facc15" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              />
              <YAxis hide />
              <ChartTooltip
                cursor={{ strokeDasharray: '4 4', stroke: 'rgba(29,160,230,0.6)', strokeWidth: 1 }}
                content={<ChartTooltipContent />}
              />
              <Area
                type="natural"
                dataKey="API Requests"
                stroke="#1da0e6"
                fill="url(#fillApiRequests)"
                fillOpacity={0.5}
                strokeWidth={2}
              />
              <Area
                type="natural"
                dataKey="Success Rate"
                stroke="#3ed598"
                fill="url(#fillSuccessRate)"
                fillOpacity={0.5}
                strokeWidth={2}
              />
            </RechartsAreaChart>
          </ChartContainer>
        </div>

        {/* Summary Stats */}
        <div className="flex flex-col sm:flex-row w-full justify-between gap-6 mt-8">
          {backendStats.map(stat => (
            <div key={stat.id} className="flex flex-col gap-2 flex-1">
              <span className="text-xl text-white/90">{stat.title}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-1">
                  {stat.id === 'uptime' ? (
                    <span className="font-mono text-4xl font-semibold text-white">
                      <CountUp start={stat.countFrom || 0} end={stat.count} duration={2.5} decimals={1} />%
                    </span>
                  ) : (
                    <span className="font-mono text-4xl font-semibold text-white">
                      <CountUp start={stat.countFrom || 0} end={stat.count} duration={2.5} />
                    </span>
                  )}
                </div>
                <div className={`flex ${stat.trendBgColor} p-1.5 px-3 items-center gap-1 rounded-full ${stat.trendColor}`}>
                  <stat.TrendIcon className="h-4 w-4" />
                  <span className="text-xs font-semibold">+{stat.percentage}%</span>
                </div>
              </div>
              <span className="text-white/60 text-sm">{stat.comparisonText}</span>
            </div>
          ))}
        </div>

        {/* Detailed Metrics List */}
        <div className="flex flex-col divide-y divide-white/10 mt-8 font-mono">
          {detailedMetrics.map((metric) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: metric.delay }}
              className="flex w-full py-4 items-center gap-4"
            >
              <div className="flex flex-row gap-3 items-center text-base w-1/2 text-white/70">
                <metric.Icon className="h-5 w-5 text-brand-300" />
                <span className="truncate" title={metric.tooltip}>
                  {metric.label}
                </span>
              </div>
              <div className="flex gap-3 w-1/2 justify-end items-center">
                <span className="font-semibold text-xl text-white">{metric.value}</span>
                <div className={`p-1.5 rounded-full ${metric.trendColor === 'text-emerald-400' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                  <metric.TrendIcon className={`h-4 w-4 ${metric.trendColor}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available Reports List */}
      <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6 text-white">
        <h3 className="font-display text-2xl mb-4">Available Reports</h3>
        <p className="text-sm text-white/70 mb-6">Download sell-through, merchandising impact, and fulfillment SLA reports.</p>
        <ul className="space-y-3 text-sm text-white/70">
          <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors">
            <span>Weekly Capsule Performance · CSV</span>
            <span className="text-xs text-white/50">2h ago</span>
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors">
            <span>Wholesale Pipeline Summary · PDF</span>
            <span className="text-xs text-white/50">Scheduled Mondays</span>
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors">
            <span>Logistics & SLA Dashboard</span>
            <span className="text-xs text-white/50">Shared</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  const { summary, daily, weekly, monthly } = analyticsBreakdown;

  // Calculate percentages for radial charts (normalized to 0-100)
  const dailyProfitPercent = useMemo(() => {
    const maxDaily = Math.max(...daily.map(d => d.profit));
    const avgDaily = daily.reduce((sum, d) => sum + d.profit, 0) / daily.length;
    return Math.round((avgDaily / maxDaily) * 100);
  }, [daily]);

  const weeklyProfitPercent = useMemo(() => {
    const maxWeekly = Math.max(...weekly.map(w => w.profit));
    const avgWeekly = weekly.reduce((sum, w) => sum + w.profit, 0) / weekly.length;
    return Math.round((avgWeekly / maxWeekly) * 100);
  }, [weekly]);

  const monthlyProfitPercent = useMemo(() => {
    const maxMonthly = Math.max(...monthly.map(m => m.profit));
    const avgMonthly = monthly.reduce((sum, m) => sum + m.profit, 0) / monthly.length;
    return Math.round((avgMonthly / maxMonthly) * 100);
  }, [monthly]);

  return (
    <div className="space-y-6 text-white">
      {/* Animated Radial Charts */}
      <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6">
        <h2 className="font-display text-2xl">Profit Performance</h2>
        <p className="mt-2 text-sm text-white/70">Visual representation of profit metrics across different time periods.</p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <AnimatedRadialChart 
              value={dailyProfitPercent} 
              size={200} 
              duration={2}
              showLabels={true}
            />
            <div className="mt-4 text-center">
              <p className="text-sm font-semibold text-white">Daily Profit</p>
              <p className="text-xs text-white/60 mt-1">Average past 7 days</p>
              <p className="text-lg font-bold text-brand-200 mt-2">${summary.dailyProfit}</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <AnimatedRadialChart 
              value={weeklyProfitPercent} 
              size={200} 
              duration={2.2}
              showLabels={true}
            />
            <div className="mt-4 text-center">
              <p className="text-sm font-semibold text-white">Weekly Profit</p>
              <p className="text-xs text-white/60 mt-1">Trailing 4 weeks</p>
              <p className="text-lg font-bold text-brand-200 mt-2">${summary.weeklyProfit}</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <AnimatedRadialChart 
              value={monthlyProfitPercent} 
              size={200} 
              duration={2.4}
              showLabels={true}
            />
            <div className="mt-4 text-center">
              <p className="text-sm font-semibold text-white">Monthly Profit</p>
              <p className="text-xs text-white/60 mt-1">Trailing 6 months</p>
              <p className="text-lg font-bold text-brand-200 mt-2">${summary.monthlyProfit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Daily Profit" value={`$${summary.dailyProfit}`} subtitle="Average past 7 days" />
        <StatCard title="Weekly Profit" value={`$${summary.weeklyProfit}`} subtitle="Trailing 4 weeks" />
        <StatCard title="Monthly Profit" value={`$${summary.monthlyProfit}`} subtitle="Trailing 6 months" />
      </div>

      {/* Sales & Profit Breakdown Tables */}
      <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6">
        <h2 className="font-display text-2xl">Sales & Profit Breakdown</h2>
        <p className="mt-3 text-sm text-white/70">Track performance cadence to forecast capsule drops with confidence.</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <AnalyticsTable title="Daily" data={daily} />
          <AnalyticsTable title="Weekly" data={weekly} />
          <AnalyticsTable title="Monthly" data={monthly} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-ocean/65 px-5 py-4 text-white">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">{title}</p>
      <p className="mt-3 text-xl font-semibold">{value}</p>
      {subtitle ? <p className="mt-2 text-sm text-white/60">{subtitle}</p> : null}
    </div>
  );
}

function AnalyticsTable({ title, data }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <table className="mt-4 w-full text-left text-xs">
        <thead className="text-[10px] uppercase tracking-[0.3em] text-white/50">
          <tr>
            <th className="py-2 pr-2">Period</th>
            <th className="py-2 pr-2">Sales</th>
            <th className="py-2">Profit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {data.map((row) => (
            <tr key={row.period}>
              <td className="py-2 pr-2 text-white">{row.period}</td>
              <td className="py-2 pr-2">${row.sales.toLocaleString()}</td>
              <td className="py-2">${row.profit.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpaAnalyticsSummary() {
  const [hoveredRevenueSegment, setHoveredRevenueSegment] = useState(null);
  const [hoveredBookingSegment, setHoveredBookingSegment] = useState(null);

  // Calculate revenue distribution from spaSalesBreakdown
  const totalRevenue = spaSalesBreakdown.reduce((sum, service) => sum + service.revenue, 0);
  const revenueChartData = spaSalesBreakdown.map((service, index) => {
    const colors = [
      '#a855f7', // Purple
      '#38bdf8', // Sky blue
      '#facc15', // Yellow
      '#3ed598', // Emerald
      '#f97316', // Orange
    ];
    return {
      value: service.revenue,
      color: colors[index % colors.length],
      label: service.service,
    };
  });

  // Calculate booking status distribution
  const bookingStatusCounts = beautySpaBookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});
  
  const bookingChartData = Object.entries(bookingStatusCounts).map(([status, count], index) => {
    const statusColors = {
      'Confirmed': '#3ed598',
      'Pending': '#facc15',
      'Awaiting Payment': '#38bdf8',
      'Cancelled': '#f97316',
    };
    return {
      value: count,
      color: statusColors[status] || '#6b7280',
      label: status,
    };
  });

  const totalBookings = beautySpaBookings.length;

  // Get active segment for revenue chart
  const activeRevenueSegment = revenueChartData.find(
    (segment) => segment.label === hoveredRevenueSegment?.label
  );
  const displayRevenueValue = activeRevenueSegment?.value ?? totalRevenue;
  const displayRevenueLabel = activeRevenueSegment?.label ?? 'Total Revenue';
  const displayRevenuePercentage = activeRevenueSegment 
    ? ((activeRevenueSegment.value / totalRevenue) * 100).toFixed(0) 
    : null;

  // Get active segment for booking chart
  const activeBookingSegment = bookingChartData.find(
    (segment) => segment.label === hoveredBookingSegment?.label
  );
  const displayBookingValue = activeBookingSegment?.value ?? totalBookings;
  const displayBookingLabel = activeBookingSegment?.label ?? 'Total Bookings';
  const displayBookingPercentage = activeBookingSegment 
    ? ((activeBookingSegment.value / totalBookings) * 100).toFixed(0) 
    : null;

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="font-display text-2xl">Beauty Spa Performance</h2>
          <p className="text-sm text-white/70">Bookings cadence, guest repeat rate, and service mix.</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          {spaAnalyticsTiles.map((tile) => (
            <div
              key={tile.label}
              className={`rounded-2xl border border-white/10 bg-gradient-to-br ${tile.tone} px-4 py-3 text-sm`}
            >
              <div className="flex items-center gap-3 text-white/80">
                <span className="text-lg">{tile.icon}</span>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{tile.label}</p>
                  <p className="text-lg font-semibold text-white">{tile.value}</p>
                  <p className="text-xs text-emerald-300">Trend {tile.delta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard title="Week" value={`$${spaTrendData.Week.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}`} subtitle="Week-to-date revenue" />
        <StatCard title="Bookings" value={spaTrendData.Week.reduce((sum, item) => sum + item.bookings, 0)} subtitle="Spa guests this week" />
        <StatCard title="Repeat Guests" value={`${Math.round(spaTrendData.Week.reduce((sum, item) => sum + item.repeat, 0) / spaTrendData.Week.length * 100)}%`} subtitle="Return spa clients" />
        </div>
      </div>

      {/* Donut Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Distribution Chart */}
        <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6">
          <h3 className="font-display text-xl mb-2">Revenue by Service</h3>
          <p className="text-sm text-white/70 mb-6">Distribution of revenue across spa services</p>
          <div className="flex flex-col items-center gap-6">
            <DonutChart
              data={revenueChartData}
              size={250}
              strokeWidth={30}
              animationDuration={1.2}
              animationDelayPerSegment={0.05}
              highlightOnHover={true}
              onSegmentHover={setHoveredRevenueSegment}
              centerContent={
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayRevenueLabel}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "circOut" }}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <p className="text-white/60 text-sm font-medium truncate max-w-[180px]">
                      {displayRevenueLabel}
                    </p>
                    <p className="text-4xl font-bold text-white">
                      ${displayRevenueValue.toLocaleString()}
                    </p>
                    {displayRevenuePercentage && (
                      <p className="text-lg font-medium text-white/60">
                        [{displayRevenuePercentage}%]
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              }
            />
            <div className="flex flex-col space-y-2 w-full pt-4 border-t border-white/10">
              {revenueChartData.map((segment, index) => (
                <motion.div
                  key={segment.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  className={`flex items-center justify-between p-2 rounded-md transition-all duration-200 cursor-pointer ${
                    hoveredRevenueSegment?.label === segment.label ? 'bg-white/10' : ''
                  }`}
                  onMouseEnter={() => setHoveredRevenueSegment(segment)}
                  onMouseLeave={() => setHoveredRevenueSegment(null)}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    ></span>
                    <span className="text-sm font-medium text-white/80 truncate max-w-[200px]">
                      {segment.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    ${segment.value.toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Status Distribution Chart */}
        <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6">
          <h3 className="font-display text-xl mb-2">Booking Status</h3>
          <p className="text-sm text-white/70 mb-6">Current booking status breakdown</p>
          <div className="flex flex-col items-center gap-6">
            <DonutChart
              data={bookingChartData}
              size={250}
              strokeWidth={30}
              animationDuration={1.2}
              animationDelayPerSegment={0.05}
              highlightOnHover={true}
              onSegmentHover={setHoveredBookingSegment}
              centerContent={
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayBookingLabel}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: "circOut" }}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <p className="text-white/60 text-sm font-medium truncate max-w-[180px]">
                      {displayBookingLabel}
                    </p>
                    <p className="text-4xl font-bold text-white">
                      {displayBookingValue}
                    </p>
                    {displayBookingPercentage && (
                      <p className="text-lg font-medium text-white/60">
                        [{displayBookingPercentage}%]
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              }
            />
            <div className="flex flex-col space-y-2 w-full pt-4 border-t border-white/10">
              {bookingChartData.map((segment, index) => (
                <motion.div
                  key={segment.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  className={`flex items-center justify-between p-2 rounded-md transition-all duration-200 cursor-pointer ${
                    hoveredBookingSegment?.label === segment.label ? 'bg-white/10' : ''
                  }`}
                  onMouseEnter={() => setHoveredBookingSegment(segment)}
                  onMouseLeave={() => setHoveredBookingSegment(null)}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    ></span>
                    <span className="text-sm font-medium text-white/80">
                      {segment.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {segment.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpaTrendChart() {
  const [timeframe, setTimeframe] = useState('Week');
  const trendData = spaTrendData[timeframe];

  // Calculate percentage changes (simulated based on timeframe)
  const getChangeForMetric = (metric) => {
    const changes = {
      Week: { revenue: 12, bookings: 8, profit: 15 },
      Month: { revenue: -5, bookings: 3, profit: -8 },
      Quarter: { revenue: 18, bookings: 22, profit: 12 },
    };
    return changes[timeframe]?.[metric] || 0;
  };

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: '#a855f7',
    },
    bookings: {
      label: 'Bookings',
      color: '#38bdf8',
    },
    profit: {
      label: 'Profit',
      color: '#facc15',
    },
  };

  // Latest data point for stats
  const latestData = trendData[trendData.length - 1];
  const totalRevenue = trendData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = trendData.reduce((sum, item) => sum + item.bookings, 0);
  const totalProfit = trendData.reduce((sum, item) => sum + item.profit, 0);

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-white/20 bg-ocean/95 backdrop-blur-sm p-4 shadow-lg min-w-[200px]">
          <div className="text-sm font-semibold text-white mb-3.5 pb-2 border-b border-white/10">
            {label}
          </div>
          <div className="space-y-1.5">
            {payload.map((item) => {
              const config = chartConfig[item.dataKey];
              return (
                <div key={item.dataKey} className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-sm" style={{ backgroundColor: config?.color || item.color }} />
                    <span className="text-xs font-medium text-white/70">{config?.label || item.dataKey}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {item.dataKey === 'revenue' || item.dataKey === 'profit' 
                      ? `$${item.value.toLocaleString()}` 
                      : item.value.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Spa Bookings & Revenue</h2>
          <p className="text-sm text-white/70">Monitor bookings pace and average ticket across spa services.</p>
        </div>
        <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          {['Week', 'Month', 'Quarter'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={[
                'rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300',
                timeframe === period
                  ? 'bg-purple-500/30 text-white shadow-[0_4px_20px_rgba(168,85,247,0.3)]'
                  : 'text-white/60 hover:bg-white/10 hover:text-white/80',
              ].join(' ')}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { key: 'revenue', label: 'Revenue', value: latestData.revenue, total: totalRevenue, icon: '💳' },
          { key: 'bookings', label: 'Bookings', value: latestData.bookings, total: totalBookings, icon: '🗓️' },
          { key: 'profit', label: 'Profit', value: latestData.profit, total: totalProfit, icon: '💰' },
        ].map((metric) => {
          const change = getChangeForMetric(metric.key);
          return (
            <div key={metric.key} className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-0.5 h-12 rounded-full bg-white/10"></div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium text-white/60">{metric.label}</div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl font-semibold leading-none">
                      {metric.key === 'revenue' || metric.key === 'profit' 
                        ? `$${metric.value.toLocaleString()}` 
                        : metric.value.toLocaleString()}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {Math.abs(change)}%
            </span>
          </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-midnight/40 p-6 backdrop-blur-sm">
        <ChartContainer
          config={chartConfig}
          className="h-[400px] w-full"
        >
          <RechartsAreaChart
            accessibilityLayer
            data={trendData}
            margin={{
              top: 10,
              bottom: 10,
              left: 20,
              right: 20,
            }}
            >
              <defs>
              {/* Modern Abstract Background Pattern */}
              <pattern id="spaModernPattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <path
                  d="M0,16 L32,16 M16,0 L16,32"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="0.5"
                />
                <path
                  d="M0,0 L32,32 M0,32 L32,0"
                  stroke="rgba(255,255,255,0.02)"
                  strokeWidth="0.3"
                />
                <circle cx="8" cy="8" r="1.5" fill="rgba(255,255,255,0.04)" />
                <circle cx="24" cy="24" r="1.5" fill="rgba(255,255,255,0.04)" />
                <rect x="12" y="4" width="8" height="2" rx="1" fill="rgba(255,255,255,0.02)" />
                <rect x="4" y="26" width="8" height="2" rx="1" fill="rgba(255,255,255,0.02)" />
                <rect x="20" y="12" width="2" height="8" rx="1" fill="rgba(255,255,255,0.02)" />
                <circle cx="6" cy="20" r="0.5" fill="rgba(255,255,255,0.06)" />
                <circle cx="26" cy="10" r="0.5" fill="rgba(255,255,255,0.06)" />
                <circle cx="14" cy="28" r="0.5" fill="rgba(255,255,255,0.06)" />
              </pattern>

              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                </linearGradient>
              <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.1} />
                </linearGradient>
              <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#facc15" stopOpacity={0.1} />
                </linearGradient>
              </defs>

            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="rgba(255,255,255,0.1)" />

            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              interval={0}
            />

            <YAxis hide />

            <ChartTooltip
              cursor={{
                strokeDasharray: '4 4',
                stroke: 'rgba(168,85,247,0.6)',
                strokeWidth: 1,
              }}
              content={<CustomTooltip />}
              offset={20}
            />

            {/* Background Pattern Areas */}
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#spaModernPattern)"
              fillOpacity={1}
              stroke="transparent"
              stackId="pattern"
              dot={false}
              activeDot={false}
            />
            <Area
              dataKey="bookings"
              type="natural"
              fill="url(#spaModernPattern)"
              fillOpacity={1}
              stroke="transparent"
              stackId="pattern"
              dot={false}
              activeDot={false}
            />
            <Area
              dataKey="profit"
              type="natural"
              fill="url(#spaModernPattern)"
              fillOpacity={1}
              stroke="transparent"
              stackId="pattern"
              dot={false}
              activeDot={false}
            />

            {/* Stacked Areas */}
            <Area
              dataKey="profit"
              type="natural"
              fill="url(#fillProfit)"
              fillOpacity={0.5}
              stroke="#facc15"
              stackId="a"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#facc15',
                stroke: 'white',
                strokeWidth: 1.5,
              }}
            />
            <Area
              dataKey="bookings"
              type="natural"
              fill="url(#fillBookings)"
              fillOpacity={0.4}
              stroke="#38bdf8"
              stackId="a"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#38bdf8',
                stroke: 'white',
                strokeWidth: 1.5,
              }}
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              fillOpacity={0.3}
              stroke="#a855f7"
              stackId="a"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#a855f7',
                stroke: 'white',
                strokeWidth: 1.5,
              }}
            />
          </RechartsAreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}

function SpaSalesTable({ onSelect }) {
  const handleDownloadCSV = () => {
    const csv = [
      ['Service', 'Sessions', 'Revenue', 'Avg Ticket', 'Utilisation %'].join(','),
      ...spaSalesBreakdown.map(row => [
        `"${row.service}"`,
        row.sessions,
        row.revenue,
        row.avgTicket,
        Math.round(row.utilisation * 100)
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `service-sales-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Service Sales Breakdown</h2>
          <p className="text-sm text-white/70">
            Compare session volume, revenue contribution, and utilisation across the spa menu.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="secondary" 
            className="border-white/20"
            onClick={handleDownloadCSV}
          >
            Download CSV
          </Button>
          <Button onClick={() => {
            if (onSelect) {
              onSelect('spaServices');
              // Scroll to top of the section after navigation
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }
          }}>
            Manage Services
          </Button>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm text-white/70">
          <thead className="border-b border-white/10 text-xs uppercase tracking-[0.3em] text-white/50">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3 text-right">Sessions</th>
              <th className="px-4 py-3 text-right">Revenue</th>
              <th className="px-4 py-3 text-right">Avg Ticket</th>
              <th className="px-4 py-3 text-right">Utilisation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-sm">
            {spaSalesBreakdown.map((row) => (
              <tr key={row.service}>
                <td className="px-4 py-3 text-white">{row.service}</td>
                <td className="px-4 py-3 text-right text-white/80">{row.sessions}</td>
                <td className="px-4 py-3 text-right text-white">${row.revenue.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-white">${row.avgTicket.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-white/80">{Math.round(row.utilisation * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashboardPanel({ currentUser, onViewStorefront, onViewSpaStorefront, subscription, onNavigateToSubscription }) {
  return (
    <div className="space-y-6">
      <DashboardHero 
        currentUser={currentUser} 
        onViewStorefront={onViewStorefront} 
        onViewSpaStorefront={onViewSpaStorefront} 
        subscription={subscription}
        onNavigateToSubscription={onNavigateToSubscription}
      />
      <MetricRow />
      <AnalyticsSummary />
      <SalesTrend />
      <RecentOrders />
    </div>
  );
}

export function DashboardLayout({ currentUser, onSignOut, onViewStorefront, onViewSpaStorefront }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const isOwner = currentUser?.role === 'owner';

  // Fetch subscription status
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await api.subscriptions.getCurrent();
        if (response.success) {
          setSubscription(response.data.subscription);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    if (currentUser) {
      fetchSubscription();
    }
  }, [currentUser]);

  const handleSubscribeSuccess = async (newSubscription) => {
    setSubscription(newSubscription);
    setActiveSection('dashboard');
    // Refresh the page to update all data
    window.location.reload();
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'products':
        return <ProductsTable 
          isOwner={isOwner} 
          onAddProduct={() => setIsAddProductOpen(true)} 
          subscription={subscription}
          onViewStorefront={onViewStorefront}
        />;
      case 'spaServices':
        return <SpaServicesPanel 
          onAddService={() => setIsAddServiceOpen(true)} 
          subscription={subscription}
          onViewSpaStorefront={onViewSpaStorefront}
          isOwner={isOwner}
        />;
      case 'bookings':
        return <SpaAnalyticsPanel onSelect={setActiveSection} onViewSpaStorefront={onViewSpaStorefront} />;
      case 'storefront':
        return <StorefrontPanel />;
      case 'subscription':
        return <SubscriptionPage onBack={() => setActiveSection('dashboard')} onSubscribeSuccess={handleSubscribeSuccess} />;
      case 'reports':
        return <ReportsPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'orders':
        return <OrdersPanel />;
      case 'customers':
      case 'settings':
        return (
          <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6 text-white">
            <h2 className="font-display text-2xl capitalize">{activeSection}</h2>
            <p className="mt-3 text-sm text-white/70">Dedicated modules for {activeSection} are coming soon.</p>
          </div>
        );
      case 'dashboard':
      default:
        return <DashboardPanel 
          currentUser={currentUser} 
          onViewStorefront={onViewStorefront} 
          onViewSpaStorefront={onViewSpaStorefront} 
          subscription={subscription}
          onNavigateToSubscription={() => setActiveSection('subscription')}
        />;
    }
  };

  return (
    <>
    <div className="relative z-10 mx-auto flex min-h-screen max-w-[1200px] gap-6 px-6 py-10">
      <Sidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        onSignOut={onSignOut}
        currentUser={currentUser}
      />
      <main className="flex-1 space-y-6 pb-16">{renderSection()}</main>
    </div>
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSuccess={(product) => {
          setIsAddProductOpen(false);
          // Trigger a refresh by changing a key or using a refresh function
          // The hooks will automatically refetch when the component remounts
          // For now, we'll use a simple page reload to ensure data is fresh
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }}
      />
      <AddServiceModal
        isOpen={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        onSuccess={(service) => {
          setIsAddServiceOpen(false);
          // Trigger a refresh by changing a key or using a refresh function
          // The hooks will automatically refetch when the component remounts
          // For now, we'll use a simple page reload to ensure data is fresh
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }}
      />
    </>
  );
}
