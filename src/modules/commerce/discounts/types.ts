export type DiscountType = 'percentage' | 'fixed_amount' | 'buy_x_get_y';

export interface Discount {
  id: string;
  title: string;
  code: string;
  type: DiscountType;
  value: number;
  appliesTo: 'entire_order' | 'collections' | 'products';
  usageLimit?: number;
  used?: number;
  minimumRequirement?: {
    type: 'amount' | 'quantity';
    value: number;
  };
  startsAt: string;
  endsAt?: string;
  status: 'scheduled' | 'active' | 'expired';
  createdAt: string;
  updatedAt: string;
}
