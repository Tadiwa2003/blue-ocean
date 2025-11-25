import api from '../../../services/api.js';
import type { Product, ProductFilter } from './types';

export async function fetchProducts(filter?: ProductFilter): Promise<Product[]> {
  const params = new URLSearchParams();

  if (filter?.search) params.set('search', filter.search);
  if (filter?.status) params.set('status', filter.status);
  if (filter?.inventoryStatus) params.set('inventoryStatus', filter.inventoryStatus);
  if (filter?.collectionId) params.set('collectionId', filter.collectionId);

  const queryString = params.toString();
  const url = queryString ? `/products?${queryString}` : '/products';
  const response = await api.get(url);
  return response.data;
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const response = await api.post('/products', payload);
  return response.data;
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const response = await api.put(`/products/${id}`, payload);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
