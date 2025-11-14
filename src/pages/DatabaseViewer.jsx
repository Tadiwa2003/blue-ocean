import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { AlertCircle, Database, Users, Calendar, ShoppingBag, Package, Mail, CreditCard, Store } from 'lucide-react';

const COLLECTIONS = [
  { name: 'users', label: 'Users', icon: Users, color: 'text-blue-400' },
  { name: 'bookings', label: 'Bookings', icon: Calendar, color: 'text-green-400' },
  { name: 'services', label: 'Services', icon: ShoppingBag, color: 'text-purple-400' },
  { name: 'products', label: 'Products', icon: Package, color: 'text-orange-400' },
  { name: 'orders', label: 'Orders', icon: ShoppingBag, color: 'text-yellow-400' },
  { name: 'contacts', label: 'Contacts', icon: Mail, color: 'text-pink-400' },
  { name: 'subscriptions', label: 'Subscriptions', icon: CreditCard, color: 'text-indigo-400' },
  { name: 'storefronts', label: 'Storefronts', icon: Store, color: 'text-teal-400' },
];

export function DatabaseViewer() {
  const [stats, setStats] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionData, setCollectionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/stats');
      if (response.success) {
        setStats(response.data);
      } else {
        setError('Failed to load database stats');
      }
    } catch (err) {
      setError(err.message || 'Failed to load database stats. Make sure you are signed in as admin/owner.');
    } finally {
      setLoading(false);
    }
  };

  const loadCollection = async (collectionName) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/admin/collection/${collectionName}`);
      if (response.success) {
        setCollectionData(response.data);
        setSelectedCollection(collectionName);
      } else {
        setError(`Failed to load ${collectionName}`);
      }
    } catch (err) {
      setError(err.message || `Failed to load ${collectionName}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-midnight text-white">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand-400 border-t-transparent mx-auto"></div>
          <p>Loading database...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-midnight text-white">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-200">{error}</p>
          <p className="text-sm text-white/60 mt-2">Make sure you are signed in as an admin or owner.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-8 w-8 text-brand-400" />
            <h1 className="text-3xl font-bold">Database Viewer</h1>
          </div>
          <p className="text-white/60">View and manage your MongoDB database collections</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {COLLECTIONS.map((collection) => {
              const Icon = collection.icon;
              const count = stats[collection.name] || 0;
              return (
                <button
                  key={collection.name}
                  onClick={() => loadCollection(collection.name)}
                  className={`p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left ${
                    selectedCollection === collection.name ? 'ring-2 ring-brand-400' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`h-5 w-5 ${collection.color}`} />
                    <span className="text-sm font-semibold text-white/70">{collection.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{count}</p>
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {/* Collection Data */}
        {selectedCollection && collectionData && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold capitalize">
                {COLLECTIONS.find((c) => c.name === selectedCollection)?.label || selectedCollection}
              </h2>
              <span className="text-sm text-white/60">
                {collectionData.total} total • Showing {collectionData.items.length}
              </span>
            </div>

            {collectionData.items.length === 0 ? (
              <p className="text-white/60 text-center py-8">No items found in this collection</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {collectionData.items.map((item, index) => (
                  <div
                    key={item._id || item.id || index}
                    className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <pre className="text-xs text-white/80 overflow-x-auto">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedCollection && (
          <div className="text-center py-12 text-white/60">
            <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Select a collection above to view its data</p>
          </div>
        )}
      </div>
    </div>
  );
}

