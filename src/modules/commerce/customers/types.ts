export interface CustomerAddress {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone?: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  filter: Record<string, unknown>;
  customers: number;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  tags: string[];
  segments: string[];
  totalSpent: number;
  totalOrders: number;
  marketingOptIn: boolean;
  defaultAddress?: CustomerAddress;
  addresses: CustomerAddress[];
  createdAt: string;
  updatedAt: string;
}
