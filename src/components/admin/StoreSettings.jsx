import { useState } from 'react';
import { Save, Store, Globe, CreditCard, Mail, Bell } from 'lucide-react';
import { Button } from '../Button.jsx';

/**
 * Store Settings Component - Shopify-style store settings
 */
export function StoreSettings({ storeId }) {
  const [settings, setSettings] = useState({
    storeName: 'My Store',
    storeEmail: 'store@example.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: {
      address1: '',
      city: '',
      province: '',
      country: 'US',
      zip: '',
    },
    currency: 'USD',
    timezone: 'America/New_York',
    taxSettings: {
      chargeTaxes: true,
      taxIncluded: false,
    },
    shippingSettings: {
      defaultWeightUnit: 'kg',
      defaultShippingRate: 0,
    },
    notificationSettings: {
      orderNotifications: true,
      lowStockAlerts: true,
      newCustomerNotifications: false,
    },
  });

  const handleSave = async () => {
    try {
      // TODO: Implement save functionality
      console.log('Saving settings:', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Store Settings</h1>
          <p className="text-white/70 mt-1">Manage your store configuration</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save Changes
        </Button>
      </div>

      {/* Store Information */}
      <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Store className="w-6 h-6 text-brand-300" />
          <h2 className="text-xl font-semibold text-white font-display">Store Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Store Name
            </label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Store Email
            </label>
            <input
              type="email"
              value={settings.storeEmail}
              onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
              className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Store Phone
            </label>
            <input
              type="tel"
              value={settings.storePhone}
              onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
              className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white"
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-brand-300" />
          <h2 className="text-xl font-semibold text-white font-display">General Settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white"
            >
              <option value="USD" className="bg-ocean">USD ($)</option>
              <option value="EUR" className="bg-ocean">EUR (€)</option>
              <option value="GBP" className="bg-ocean">GBP (£)</option>
              <option value="ZWG" className="bg-ocean">ZWG ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-4 py-2 border border-white/10 bg-white/5 rounded-2xl focus:ring-2 focus:ring-brand-400 focus:border-transparent text-white"
            >
              <option value="America/New_York" className="bg-ocean">Eastern Time (ET)</option>
              <option value="America/Chicago" className="bg-ocean">Central Time (CT)</option>
              <option value="America/Denver" className="bg-ocean">Mountain Time (MT)</option>
              <option value="America/Los_Angeles" className="bg-ocean">Pacific Time (PT)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tax Settings */}
      <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-brand-300" />
          <h2 className="text-xl font-semibold text-white font-display">Tax Settings</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.taxSettings.chargeTaxes}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  taxSettings: { ...settings.taxSettings, chargeTaxes: e.target.checked },
                })
              }
              className="w-5 h-5 text-brand-400 rounded border-white/20 bg-white/5"
            />
            <span className="text-sm font-medium text-white/80">Charge taxes on orders</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.taxSettings.taxIncluded}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  taxSettings: { ...settings.taxSettings, taxIncluded: e.target.checked },
                })
              }
              className="w-5 h-5 text-brand-400 rounded border-white/20 bg-white/5"
            />
            <span className="text-sm font-medium text-white/80">Prices include tax</span>
          </label>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="rounded-3xl border border-white/10 bg-ocean/65 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-brand-300" />
          <h2 className="text-xl font-semibold text-white font-display">Notification Settings</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.notificationSettings.orderNotifications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notificationSettings: {
                    ...settings.notificationSettings,
                    orderNotifications: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 text-brand-400 rounded border-white/20 bg-white/5"
            />
            <span className="text-sm font-medium text-white/80">Email me when I receive a new order</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.notificationSettings.lowStockAlerts}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notificationSettings: {
                    ...settings.notificationSettings,
                    lowStockAlerts: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 text-brand-400 rounded border-white/20 bg-white/5"
            />
            <span className="text-sm font-medium text-white/80">Email me when inventory is low</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.notificationSettings.newCustomerNotifications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notificationSettings: {
                    ...settings.notificationSettings,
                    newCustomerNotifications: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 text-brand-400 rounded border-white/20 bg-white/5"
            />
            <span className="text-sm font-medium text-white/80">Email me when a new customer registers</span>
          </label>
        </div>
      </div>
    </div>
  );
}
