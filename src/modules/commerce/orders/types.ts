export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'partially_fulfilled' | 'refunded';

export interface OrderTimelineEvent {
  id: string;
  type: 'note' | 'status_change' | 'payment';
  message: string;
  createdAt: string;
  actor: string;
}

export interface OrderLineItem {
  id: string;
  productId: string;
  title: string;
  quantity: number;
  price: number;
  variantTitle?: string;
}

export interface Order {
  id: string;
  name: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  customerId: string;
  email: string;
  phone?: string;
  shippingAddress?: string;
  billingAddress?: string;
  items: OrderLineItem[];
  tags: string[];
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}
