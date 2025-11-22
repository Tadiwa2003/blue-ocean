export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'archived';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  trackInventory: boolean;
}

export interface ProductMedia {
  id: string;
  url: string;
  alt?: string;
  featured?: boolean;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  status: 'draft' | 'active';
  description?: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  trackInventory: boolean;
  inventoryStatus: InventoryStatus;
  inventory: number;
  variants: ProductVariant[];
  media: ProductMedia[];
  collections: string[];
  tags: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  search?: string;
  status?: Product['status'];
  inventoryStatus?: InventoryStatus;
  collectionId?: string;
}
