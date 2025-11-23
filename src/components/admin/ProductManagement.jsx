import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Package } from 'lucide-react';
import api from '../../services/api.js';
import { Button } from '../Button.jsx';

/**
 * Product Management Component - Shopify-style product management
 */
export function ProductManagement({ storeId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [storeId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.products.getProducts(storeId);
      // setProducts(response.data);
      
      // Mock data for now
      setProducts([
        {
          _id: '1',
          title: 'Sample Product 1',
          status: 'active',
          price: 29.99,
          inventory: 50,
          variants: 3,
          createdAt: new Date(),
        },
        {
          _id: '2',
          title: 'Sample Product 2',
          status: 'draft',
          price: 49.99,
          inventory: 0,
          variants: 1,
          createdAt: new Date(),
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleBulkAction = (action) => {
    if (selectedProducts.length === 0) return;
    
    switch (action) {
      case 'delete':
        if (confirm(`Delete ${selectedProducts.length} product(s)?`)) {
          // TODO: Implement bulk delete
          console.log('Bulk delete:', selectedProducts);
        }
        break;
      case 'publish':
        // TODO: Implement bulk publish
        console.log('Bulk publish:', selectedProducts);
        break;
      case 'unpublish':
        // TODO: Implement bulk unpublish
        console.log('Bulk unpublish:', selectedProducts);
        break;
    }
    setSelectedProducts([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Products</h1>
          <p className="text-white/70 mt-1">Manage your product catalog</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Product
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="rounded-3xl border border-white/10 bg-ocean/65 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
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
            <option value="active" className="bg-ocean">Active</option>
            <option value="draft" className="bg-ocean">Draft</option>
            <option value="archived" className="bg-ocean">Archived</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-white/60">
              {selectedProducts.length} selected
            </span>
            <button
              onClick={() => handleBulkAction('publish')}
              className="px-3 py-1 text-sm bg-emerald-500/20 text-emerald-300 rounded-xl hover:bg-emerald-500/30 border border-emerald-500/30"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkAction('unpublish')}
              className="px-3 py-1 text-sm bg-amber-500/20 text-amber-300 rounded-xl hover:bg-amber-500/30 border border-amber-500/30"
            >
              Unpublish
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 text-sm bg-rose-500/20 text-rose-300 rounded-xl hover:bg-rose-500/30 border border-rose-500/30"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="rounded-3xl border border-white/10 bg-ocean/65 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-400 mx-auto"></div>
            <p className="mt-4 text-white/60">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No products found</p>
            <Button className="mt-4">Add Your First Product</Button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(filteredProducts.map(p => p._id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                    className="rounded border-white/20 bg-white/5"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Inventory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product._id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                        }
                      }}
                      className="rounded border-white/20 bg-white/5"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-white/40" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{product.title}</p>
                        <p className="text-sm text-white/50">SKU: {product.sku || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : product.status === 'draft'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-white/10 text-white/60 border border-white/10'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">
                    ${product.price?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={product.inventory === 0 ? 'text-rose-400 font-medium' : 'text-white'}>
                      {product.inventory || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">
                    {product.variants || 1}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-white/40 hover:text-brand-300 rounded-xl hover:bg-white/5">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-white/40 hover:text-brand-300 rounded-xl hover:bg-white/5">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-white/40 hover:text-rose-400 rounded-xl hover:bg-white/5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
