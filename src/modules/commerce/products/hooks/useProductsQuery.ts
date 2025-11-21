import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchProducts } from '../api';
import type { Product, ProductFilter } from '../types';

const PRODUCTS_QUERY_KEY = ['commerce', 'products'];

export function useProductsQuery(filter?: ProductFilter, options?: UseQueryOptions<Product[], Error>) {
  return useQuery<Product[], Error>({
    queryKey: [...PRODUCTS_QUERY_KEY, filter ?? {}],
    queryFn: () => fetchProducts(filter),
    ...options,
  });
}
