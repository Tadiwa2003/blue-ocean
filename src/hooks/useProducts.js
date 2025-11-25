import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

export function useProducts(storefrontId = null) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (process.env.NODE_ENV === 'development') {
        console.log('🛍️ Fetching products from API...', storefrontId ? `(storefront: ${storefrontId})` : '');
      }
      const response = await api.products.getProducts(storefrontId);
      
      // Handle null or undefined response
      if (!response) {
        console.warn('⚠️ Products API returned null/undefined response');
        setProducts([]);
        setError('No data received from server');
        return;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🛍️ Products response:', response.success ? `✅ ${response.data?.products?.length || 0} products` : '❌ Failed');
      }
      
      if (response && response.success) {
        const productsList = response.data?.products || [];
        setProducts(productsList);
        if (process.env.NODE_ENV === 'development') {
          console.log('🛍️ Products loaded:', productsList.length);
        }
      } else {
        const errorMsg = response?.message || 'Failed to load products';
        setError(errorMsg);
        setProducts([]);
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error fetching products:', err);
      }
      const errorMessage = err.message || 'Failed to load products';
      setError(errorMessage);
      // Fallback to empty array on error
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [storefrontId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refresh: fetchProducts };
}

export default useProducts;

