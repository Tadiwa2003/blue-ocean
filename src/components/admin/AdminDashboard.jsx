import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { ProductManagement } from './ProductManagement.jsx';
import { OrderManagement } from './OrderManagement.jsx';
import { CustomerManagement } from './CustomerManagement.jsx';
import { DiscountManagement } from './DiscountManagement.jsx';
import { AnalyticsDashboard } from './AnalyticsDashboard.jsx';
import { StoreSettings } from './StoreSettings.jsx';

/**
 * Main Admin Dashboard Component - Shopify-style admin interface
 */
export function AdminDashboard({ storeId }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'discounts', label: 'Discounts', icon: Tag },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AnalyticsDashboard storeId={storeId} />;
      case 'products':
        return <ProductManagement storeId={storeId} />;
      case 'orders':
        return <OrderManagement storeId={storeId} />;
      case 'customers':
        return <CustomerManagement storeId={storeId} />;
      case 'discounts':
        return <DiscountManagement storeId={storeId} />;
      case 'analytics':
        return <AnalyticsDashboard storeId={storeId} />;
      case 'settings':
        return <StoreSettings storeId={storeId} />;
      default:
        return <AnalyticsDashboard storeId={storeId} />;
    }
  };

  return (
    <div className="min-h-screen bg-midnight">
      {/* Mobile Header */}
      <div className="lg:hidden border-b border-white/10 bg-ocean/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white font-display">Admin Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-2xl hover:bg-white/10 text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 rounded-[32px] border border-white/10 bg-ocean/75 backdrop-blur-xl
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}
        >
          <div className="h-full flex flex-col p-6">
            {/* Logo/Brand */}
            <div className="pb-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white font-display">Admin</h2>
              <p className="text-sm text-white/50 mt-1">Store Management</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 pt-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false); // Close mobile sidebar on click
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-2xl
                      transition-colors duration-200
                      ${
                        isActive
                          ? 'bg-brand-500/20 text-white font-semibold'
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-400/30">
                  <span className="text-brand-300 font-semibold">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Admin User</p>
                  <p className="text-xs text-white/50 truncate">admin@store.com</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

