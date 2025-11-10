import { useState, useEffect } from 'react';
import api from '../services/api.js';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🛍️ Fetching products from API...');
        const response = await api.products.getProducts();
        console.log('🛍️ Products response:', response.success ? `✅ ${response.data?.products?.length || 0} products` : '❌ Failed');
        if (response.success) {
          const productsList = response.data.products || [];
          setProducts(productsList);
          console.log('🛍️ Products loaded:', productsList.length);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError(err.message || 'Failed to load products');
        // Fallback to empty array on error
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}

export default useProducts;

