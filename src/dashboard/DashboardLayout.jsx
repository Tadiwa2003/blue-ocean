import { useMemo, useState } from 'react';
import { Button } from '../components/Button.jsx';
import { Logo } from '../components/Logo.jsx';
import { highlightProducts } from '../data/products.js';
import { analyticsBreakdown } from '../data/analytics.js';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'products', label: 'Products', icon: '👜' },
  { id: 'spaServices', label: 'Beauty Spa', icon: '💆' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'storefront', label: 'Storefront', icon: '🛍️' },
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

function DashboardHero({ currentUser, onViewStorefront, onViewSpaStorefront }) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-ocean/90 via-ocean to-midnight/90 px-6 py-6 text-white shadow-glow">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-200/80">Hello, {currentUser?.name ?? 'Merchant'}</p>
          <h1 className="mt-2 font-display text-3xl">Welcome back to Blue Ocean HQ</h1>
          <p className="mt-2 text-sm text-white/70">
            Review capsule performance, publish storefront changes, and monitor guest experience all in one tide dashboard.
          </p>
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
          <Button className="bg-brand-500/80 hover:bg-brand-500">Copy Share Link</Button>
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
  const [chartType, setChartType] = useState('line');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  const currentData = salesTrendData[timeframe];
  const chartWidth = 600;
  const chartHeight = 240;
  const maxMetric = Math.max(...currentData.map((d) => Math.max(d.sales, d.profit)));
  const step = chartWidth / (currentData.length - 1);

  const buildPath = (key) =>
    currentData
      .map((point, index) => {
        const x = index * step;
        const y = chartHeight - (point[key] / maxMetric) * (chartHeight - 20) - 10;
        return `${x},${y}`;
      })
      .join(' ');

  const profitPath = `${buildPath('profit')} ${chartWidth},${chartHeight} 0,${chartHeight}`;

  const totalSales = currentData.reduce((sum, item) => sum + item.sales, 0);
  const totalProfit = currentData.reduce((sum, item) => sum + item.profit, 0);
  const totalOrders = currentData.reduce((sum, item) => sum + item.orders, 0);

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
          <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            {[
              { type: 'line', icon: '📈', label: 'Line' },
              { type: 'bar', icon: '📊', label: 'Bar' },
              { type: 'area', icon: '🌊', label: 'Area' },
            ].map((chart) => (
              <button
                key={chart.type}
                onClick={() => setChartType(chart.type)}
                className={[
                  'flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-300',
                  chartType === chart.type
                    ? 'bg-brand-500/30 text-white shadow-[0_4px_20px_rgba(29,160,230,0.3)]'
                    : 'text-white/60 hover:bg-white/10 hover:text-white/80',
                ].join(' ')}
                title={chart.label}
              >
                <span>{chart.icon}</span>
                <span className="hidden sm:inline">{chart.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-midnight/40 p-6 backdrop-blur-sm">
        {/* Tooltip */}
        {hoveredPoint !== null && (
          <div 
            className="absolute z-50 rounded-2xl border border-brand-400/40 bg-midnight/95 px-4 py-3 shadow-2xl backdrop-blur-xl"
            style={{
              left: `${60 + (chartType === 'bar' 
                ? hoveredPoint * (chartWidth / currentData.length) + (chartWidth / currentData.length) / 2 
                : hoveredPoint * step) * (100 / (chartWidth + 80))}%`,
              top: '20px',
              transform: 'translateX(-50%)',
              animation: 'chartFadeIn 0.2s ease-out',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-300">
              {currentData[hoveredPoint].period}
            </p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-xs text-white/70">
                  <span className="h-2 w-2 rounded-full bg-brand-400" />
                  Sales
                </span>
                <span className="text-sm font-bold text-white">
                  ${currentData[hoveredPoint].sales.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-xs text-white/70">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Profit
                </span>
                <span className="text-sm font-bold text-white">
                  ${currentData[hoveredPoint].profit.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-xs text-white/70">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Orders
                </span>
                <span className="text-sm font-bold text-white">
                  {currentData[hoveredPoint].orders}
                </span>
              </div>
            </div>
          </div>
        )}
      
        <style>{`
          @keyframes chartFadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pathDraw {
            from {
              stroke-dashoffset: 1000;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes barGrow {
            from {
              transform: scaleY(0);
              opacity: 0;
            }
            to {
              transform: scaleY(1);
              opacity: 1;
            }
          }
          .chart-container {
            animation: chartFadeIn 0.5s ease-out;
          }
          .chart-line {
            stroke-dasharray: 1000;
            animation: pathDraw 1.2s ease-out forwards;
          }
          .chart-bar {
            transform-origin: bottom;
            animation: barGrow 0.6s ease-out forwards;
          }
          .chart-point {
            animation: chartFadeIn 0.8s ease-out forwards;
          }
        `}</style>
        <svg viewBox={`0 0 ${chartWidth + 80} ${chartHeight + 60}`} className="chart-container h-64 w-full">
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(62,213,152,0.5)" />
              <stop offset="100%" stopColor="rgba(62,213,152,0.05)" />
            </linearGradient>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(29,160,230,0.5)" />
              <stop offset="100%" stopColor="rgba(29,160,230,0.05)" />
            </linearGradient>
            <linearGradient id="salesStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1da0e6" />
              <stop offset="100%" stopColor="#45c4fb" />
            </linearGradient>
            <linearGradient id="profitStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3ed598" />
              <stop offset="100%" stopColor="#8df7d1" />
            </linearGradient>
          </defs>
          
          <g transform="translate(60, 10)">
            {/* Y-axis labels (money in thousands) */}
            {[0, 1, 2, 3, 4].map((i) => {
              const value = Math.round((maxMetric * (4 - i)) / 4 / 1000);
              const y = i * (chartHeight / 4);
              return (
                <g key={i}>
                  <line
                    x1="0"
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                  <text
                    x="-10"
                    y={y + 4}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.5)"
                    fontSize="11"
                    fontWeight="500"
                  >
                    ${value}k
                  </text>
                </g>
              );
            })}
            
            {/* Y-axis label */}
            <text
              x="-45"
              y={chartHeight / 2}
              textAnchor="middle"
              fill="rgba(255,255,255,0.6)"
              fontSize="12"
              fontWeight="600"
              transform={`rotate(-90, -45, ${chartHeight / 2})`}
            >
              Revenue (Thousands)
            </text>
          
          {/* Chart Type: Line */}
          {chartType === 'line' && (
            <>
              <polyline
                points={buildPath('profit')}
                fill="none"
                stroke="url(#profitStroke)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="chart-line"
              />
              <polyline
                points={buildPath('sales')}
                fill="none"
                stroke="url(#salesStroke)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="chart-line"
                style={{ animationDelay: '0.2s' }}
              />
              {/* Data points with hover areas */}
              {currentData.map((point, index) => {
                const x = index * step;
                const profitY = chartHeight - (point.profit / maxMetric) * (chartHeight - 20) - 10;
                const salesY = chartHeight - (point.sales / maxMetric) * (chartHeight - 20) - 10;
                const isHovered = hoveredPoint === index;
                return (
                  <g key={index} className="chart-point" style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                    {/* Invisible hover area */}
                    <rect
                      x={x - 20}
                      y={0}
                      width={40}
                      height={chartHeight}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* Profit point */}
                    <circle 
                      cx={x} 
                      cy={profitY} 
                      r={isHovered ? "8" : "5"} 
                      fill="#3ed598" 
                      opacity="0.9"
                      className="transition-all duration-200"
                    >
                      <animate attributeName="r" from="0" to={isHovered ? "8" : "5"} dur="0.4s" fill="freeze" />
                    </circle>
                    {isHovered && (
                      <circle cx={x} cy={profitY} r="12" fill="#3ed598" opacity="0.2" />
                    )}
                    {/* Sales point */}
                    <circle 
                      cx={x} 
                      cy={salesY} 
                      r={isHovered ? "8" : "5"} 
                      fill="#1da0e6" 
                      opacity="0.9"
                      className="transition-all duration-200"
                    >
                      <animate attributeName="r" from="0" to={isHovered ? "8" : "5"} dur="0.4s" fill="freeze" />
                    </circle>
                    {isHovered && (
                      <circle cx={x} cy={salesY} r="12" fill="#1da0e6" opacity="0.2" />
                    )}
                  </g>
                );
              })}
            </>
          )}
          
          {/* Chart Type: Area */}
          {chartType === 'area' && (
            <>
              <polygon points={profitPath} fill="url(#profitGradient)" className="chart-point" style={{ animationDelay: '0.2s' }}>
                <animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze" />
              </polygon>
              <polygon 
                points={`${buildPath('sales')} ${chartWidth},${chartHeight} 0,${chartHeight}`} 
                fill="url(#salesGradient)"
                className="chart-point"
                style={{ animationDelay: '0.1s' }}
              >
                <animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze" />
              </polygon>
              <polyline
                points={buildPath('profit')}
                fill="none"
                stroke="url(#profitStroke)"
                strokeWidth="2"
                strokeLinecap="round"
                className="chart-line"
              />
              <polyline
                points={buildPath('sales')}
                fill="none"
                stroke="url(#salesStroke)"
                strokeWidth="2"
                strokeLinecap="round"
                className="chart-line"
                style={{ animationDelay: '0.2s' }}
              />
            </>
          )}
          
          {/* Chart Type: Bar */}
          {chartType === 'bar' && (
            <>
              {currentData.map((point, index) => {
                const barWidth = (chartWidth / currentData.length) * 0.7;
                const x = index * (chartWidth / currentData.length) + (chartWidth / currentData.length - barWidth) / 2;
                const salesHeight = (point.sales / maxMetric) * (chartHeight - 30);
                const profitHeight = (point.profit / maxMetric) * (chartHeight - 30);
                const salesY = chartHeight - salesHeight - 10;
                const profitY = chartHeight - profitHeight - 10;
                const isHovered = hoveredPoint === index;
                
                return (
                  <g key={index}>
                    {/* Hover area */}
                    <rect
                      x={x - 10}
                      y={0}
                      width={barWidth + 20}
                      height={chartHeight}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* Sales bar */}
                    <rect
                      x={x}
                      y={salesY}
                      width={barWidth * 0.45}
                      height={salesHeight}
                      fill="url(#salesStroke)"
                      rx="6"
                      opacity={isHovered ? "1" : "0.8"}
                      className="chart-bar transition-all duration-200"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    />
                    {isHovered && (
                      <rect
                        x={x - 2}
                        y={salesY - 2}
                        width={barWidth * 0.45 + 4}
                        height={salesHeight + 4}
                        fill="none"
                        stroke="#1da0e6"
                        strokeWidth="2"
                        rx="6"
                        opacity="0.6"
                      />
                    )}
                    {/* Profit bar */}
                    <rect
                      x={x + barWidth * 0.5}
                      y={profitY}
                      width={barWidth * 0.45}
                      height={profitHeight}
                      fill="url(#profitStroke)"
                      rx="6"
                      opacity={isHovered ? "1" : "0.8"}
                      className="chart-bar transition-all duration-200"
                      style={{ animationDelay: `${index * 0.1 + 0.05}s` }}
                    />
                    {isHovered && (
                      <rect
                        x={x + barWidth * 0.5 - 2}
                        y={profitY - 2}
                        width={barWidth * 0.45 + 4}
                        height={profitHeight + 4}
                        fill="none"
                        stroke="#3ed598"
                        strokeWidth="2"
                        rx="6"
                        opacity="0.6"
                      />
                    )}
                  </g>
                );
              })}
            </>
          )}
          
          {/* X-axis labels (days/periods) */}
          {currentData.map((point, index) => {
            const x = chartType === 'bar' 
              ? index * (chartWidth / currentData.length) + (chartWidth / currentData.length) / 2
              : index * step;
            return (
              <text
                key={index}
                x={x}
                y={chartHeight + 20}
                textAnchor="middle"
                fill="rgba(255,255,255,0.5)"
                fontSize="11"
                fontWeight="500"
                className="chart-point"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {point.period}
              </text>
            );
          })}
          
          {/* X-axis label */}
          <text
            x={chartWidth / 2}
            y={chartHeight + 45}
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="12"
            fontWeight="600"
          >
            {timeframe === 'Week' ? 'Days of the Week' : timeframe === 'Month' ? 'Weeks of the Month' : 'Months of the Quarter'}
          </text>
          </g>
        </svg>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-brand-400/30 bg-gradient-to-br from-brand-500/20 to-brand-600/10 p-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-400/20">
                <span className="text-lg">💠</span>
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-brand-300">Sales</p>
                <p className="text-xl font-bold text-white">${totalSales.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/20">
                <span className="text-lg">💚</span>
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Profit</p>
                <p className="text-xl font-bold text-white">${totalProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/20 to-amber-600/10 p-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/20">
                <span className="text-lg">📦</span>
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Orders</p>
                <p className="text-xl font-bold text-white">{totalOrders}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-brand-400 to-brand-500" />
            <span className="text-white/70">Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
            <span className="text-white/70">Profit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/50">•</span>
            <span className="text-xs text-white/50">Showing {timeframe.toLowerCase()} data</span>
          </div>
        </div>
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

function ProductsTable({ isOwner }) {
  const productRows = useMemo(
    () =>
      highlightProducts.slice(0, 10).map((product, index) => ({
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
      })),
    []
  );

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-ocean/65">
      <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl">Product Catalogue</h2>
          <p className="text-sm text-white/60">Manage assortment, pricing, and availability.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="border-white/20">
            Export
          </Button>
          <Button
            disabled={!isOwner}
            className={!isOwner ? 'cursor-not-allowed bg-white/10 text-white/40' : undefined}
            title={isOwner ? 'Create a new Blue Ocean product' : 'Only the Blue Ocean owner can add products'}
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
        <span>Showing {productRows.length} products</span>
        <div className="flex gap-2">
          <button className="rounded-full border border-white/15 px-3 py-1 hover:text-white">Previous</button>
          <button className="rounded-full border border-white/15 px-3 py-1 hover:text-white">Next</button>
        </div>
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

function SpaServicesPanel() {
  const services = useMemo(
    () => highlightProducts.filter((product) => product.category === 'Beauty Spa Services'),
    [],
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
            <Button variant="secondary" className="border-white/20">
              Add New Service
            </Button>
            <Button>Sync to Storefront</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-4 text-white/80 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-200/80">{service.category}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{service.name}</h3>
                </div>
                <span className="rounded-full border border-brand-400/40 bg-brand-500/20 px-3 py-1 text-sm font-semibold text-white">
                  {service.price}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{service.description}</p>
              {service.badges?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.badges.map((badge) => (
                    <span
                      key={badge}
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
          {!services.length && (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-white/60">
              No spa services configured yet. Use "Add New Service" to build your menu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SpaBookingsTable() {
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
          <Button variant="secondary" className="border-white/20">
            Export Week
          </Button>
          <Button>Schedule Booking</Button>
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

function SpaAnalyticsPanel() {
  return (
    <div className="space-y-6 text-white">
      <SpaAnalyticsSummary />
      <SpaTrendChart />
      <SpaSalesTable />
      <SpaBookingsTable />
    </div>
  );
}

function ReportsPanel() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6 text-white">
      <h2 className="font-display text-2xl">Reports</h2>
      <p className="mt-3 text-sm text-white/70">Download sell-through, merchandising impact, and fulfillment SLA reports.</p>
      <ul className="mt-6 space-y-3 text-sm text-white/70">
        <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Weekly Capsule Performance · CSV · 2h ago</li>
        <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Wholesale Pipeline Summary · PDF · Scheduled Mondays</li>
        <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Logistics & SLA Dashboard · Shared</li>
      </ul>
    </div>
  );
}

function AnalyticsPanel() {
  const { summary, daily, weekly, monthly } = analyticsBreakdown;

  return (
    <div className="space-y-6 text-white">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Daily Profit" value={`$${summary.dailyProfit}`} subtitle="Average past 7 days" />
        <StatCard title="Weekly Profit" value={`$${summary.weeklyProfit}`} subtitle="Trailing 4 weeks" />
        <StatCard title="Monthly Profit" value={`$${summary.monthlyProfit}`} subtitle="Trailing 6 months" />
      </div>
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
  return (
    <div className="rounded-[32px] border border-white/10 bg-ocean/65 p-6 text-white">
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
  );
}

function SpaTrendChart() {
  const [timeframe, setTimeframe] = useState('Week');
  const trendData = spaTrendData[timeframe];
  const chartWidth = 640;
  const chartHeight = 220;
  const verticalPadding = 30;
  const horizontalPadding = 20;

  const revenueMax = Math.max(...trendData.map((item) => item.revenue));
  const bookingsMax = Math.max(...trendData.map((item) => item.bookings));
  const profitMax = Math.max(...trendData.map((item) => item.profit));

  const revenuePoints = trendData.map((item, index) => {
    const x =
      horizontalPadding +
      (index / (trendData.length - 1 || 1)) * (chartWidth - horizontalPadding * 2);
    const valueScale = (chartHeight - verticalPadding * 2) / (revenueMax || 1);
    const y =
      chartHeight - verticalPadding - item.revenue * valueScale;
    return { x, y };
  });

  const bookingsPoints = trendData.map((item, index) => {
    const x =
      horizontalPadding +
      (index / (trendData.length - 1 || 1)) * (chartWidth - horizontalPadding * 2);
    const valueScale = (chartHeight - verticalPadding * 2) / (bookingsMax || 1);
    const y =
      chartHeight - verticalPadding - item.bookings * valueScale;
    return { x, y };
  });

  const profitPoints = trendData.map((item, index) => {
    const x =
      horizontalPadding +
      (index / (trendData.length - 1 || 1)) * (chartWidth - horizontalPadding * 2);
    const valueScale = (chartHeight - verticalPadding * 2) / (profitMax || 1);
    const y =
      chartHeight - verticalPadding - item.profit * valueScale;
    return { x, y };
  });

  const revenueAreaPath = revenuePoints.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${chartHeight - verticalPadding} L ${point.x} ${point.y}`;
    }
    return `${path} L ${point.x} ${point.y}`;
  }, '');

  const revenueAreaClosed =
    `${revenueAreaPath} L ${
      revenuePoints[revenuePoints.length - 1]?.x ?? horizontalPadding
    } ${chartHeight - verticalPadding} Z`;

  const bookingsLinePath = bookingsPoints.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${path} L ${point.x} ${point.y}`;
  }, '');

  const profitLinePath = profitPoints.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${path} L ${point.x} ${point.y}`;
  }, '');

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
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Revenue trend</h3>
              <p className="text-xs text-white/50">Stacked view of revenue (area) and bookings (line)</p>
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/60">
              {timeframe}
            </span>
          </div>
          <div className="relative mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-midnight/60">
            <svg
              width="100%"
              height={chartHeight}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="spaRevenueGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#5b21b6" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="spaBookingLine" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
                <linearGradient id="spaProfitLine" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="chartBG" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <rect
                x="0"
                y="0"
                width={chartWidth}
                height={chartHeight}
                fill="url(#chartBG)"
                opacity="0.02"
              />
              <path
                d={revenueAreaClosed}
                fill="url(#spaRevenueGradient)"
                stroke="none"
              />
              <path
                d={bookingsLinePath}
                fill="none"
                stroke="url(#spaBookingLine)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={profitLinePath}
                fill="none"
                stroke="url(#spaProfitLine)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 6"
              />
              {bookingsPoints.map((point, index) => (
                <circle
                  key={point.x}
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="#0ea5e9"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="2"
                >
                  <title>
                    {trendData[index].period}: {trendData[index].bookings} bookings
                  </title>
                </circle>
              ))}
              {profitPoints.map((point, index) => (
                <circle
                  key={`profit-${point.x}`}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#facc15"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.5"
                >
                  <title>
                    {trendData[index].period}: ${trendData[index].profit.toLocaleString()} profit
                  </title>
                </circle>
              ))}

              <g>
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const value = Math.round(revenueMax * ratio);
                  const y =
                    chartHeight - verticalPadding - ratio * (chartHeight - verticalPadding * 2);
                  return (
                    <g key={ratio}>
                      <line
                        x1={horizontalPadding - 6}
                        y1={y}
                        x2={chartWidth - horizontalPadding + 6}
                        y2={y}
                        stroke="rgba(255,255,255,0.08)"
                      />
                      <text
                        x={horizontalPadding - 14}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="11"
                        fill="rgba(255,255,255,0.5)"
                      >
                        ${value.toLocaleString()}
                      </text>
                    </g>
                  );
                })}
                <text
                  x={horizontalPadding - 46}
                  y={chartHeight / 2}
                  transform={`rotate(-90 ${horizontalPadding - 46} ${chartHeight / 2})`}
                  fontSize="11"
                  fill="rgba(255,255,255,0.55)"
                  letterSpacing="0.2em"
                >
                  REVENUE ($)
                </text>
              </g>
              <g className="text-white/50">
                {trendData.map((point, index) => {
                  const x =
                    horizontalPadding +
                    (index / (trendData.length - 1 || 1)) * (chartWidth - horizontalPadding * 2);
                  return (
                    <g key={point.period}>
                      <line
                        x1={x}
                        y1={chartHeight - verticalPadding + 6}
                        x2={x}
                        y2={chartHeight - verticalPadding + 14}
                        stroke="rgba(255,255,255,0.2)"
                      />
                      <text
                        x={x}
                        y={chartHeight - verticalPadding + 28}
                        textAnchor="middle"
                        fontSize="12"
                        fill="rgba(255,255,255,0.6)"
                      >
                        {point.period}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
            <div className="absolute right-5 top-5 flex items-center gap-4 rounded-full border border-white/10 bg-midnight/60 px-3 py-2 text-xs text-white/60 backdrop-blur">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2 w-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
                Revenue
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-2 w-4 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" />
                Bookings
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-2 w-4 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400" />
                Profit
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-sm font-semibold text-white">Quick metrics</h3>
          <div className="mt-5 space-y-4">
            {[
              {
                label: 'Total bookings',
                value: trendData.reduce((sum, item) => sum + item.bookings, 0),
                icon: '🗓️',
              },
              {
                label: 'Revenue',
                value: `$${trendData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}`,
                icon: '💳',
              },
              {
                label: 'Profit',
                value: `$${trendData.reduce((sum, item) => sum + item.profit, 0).toLocaleString()}`,
                icon: '💰',
              },
              {
                label: 'Repeat rate',
                value: `${Math.round(
                  (trendData.reduce((sum, item) => sum + item.repeat, 0) / trendData.length) * 100,
                )}%`,
                icon: '🔁',
              },
              {
                label: 'Peak day',
                value: trendData.reduce(
                  (max, item) => (item.revenue > max.revenue ? item : max),
                  trendData[0],
                ).period,
                icon: '⭐',
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-500/10 text-lg text-white">
                    {metric.icon}
                  </span>
                  <span>{metric.label}</span>
                </div>
                <span className="text-white font-semibold">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpaSalesTable() {
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
          <Button variant="secondary" className="border-white/20">
            Download CSV
          </Button>
          <Button>Manage Services</Button>
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

function DashboardPanel({ currentUser, onViewStorefront, onViewSpaStorefront }) {
  return (
    <div className="space-y-6">
      <DashboardHero currentUser={currentUser} onViewStorefront={onViewStorefront} onViewSpaStorefront={onViewSpaStorefront} />
      <MetricRow />
      <AnalyticsSummary />
      <SalesTrend />
      <RecentOrders />
    </div>
  );
}

export function DashboardLayout({ currentUser, onSignOut, onViewStorefront, onViewSpaStorefront }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const isOwner = currentUser?.role === 'owner';

  const renderSection = () => {
    switch (activeSection) {
      case 'products':
        return <ProductsTable isOwner={isOwner} />;
      case 'spaServices':
        return <SpaServicesPanel />;
      case 'bookings':
        return <SpaAnalyticsPanel />;
      case 'storefront':
        return <StorefrontPanel />;
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
        return <DashboardPanel currentUser={currentUser} onViewStorefront={onViewStorefront} onViewSpaStorefront={onViewSpaStorefront} />;
    }
  };

  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-[1200px] gap-6 px-6 py-10">
      <Sidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        onSignOut={onSignOut}
        currentUser={currentUser}
      />
      <main className="flex-1 space-y-6 pb-16">{renderSection()}</main>
    </div>
  );
}
