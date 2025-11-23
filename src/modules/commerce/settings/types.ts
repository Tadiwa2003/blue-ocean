export interface PaymentSettings {
  provider: 'stripe' | 'paypal' | 'manual';
  status: 'connected' | 'disconnected';
  displayName?: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rate: number;
  deliveryEstimate: string;
}

export interface TaxSettings {
  region: string;
  rate: number;
  applyAutomatically: boolean;
}

export interface CommerceSettings {
  payments: PaymentSettings[];
  shippingZones: ShippingZone[];
  taxes: TaxSettings[];
  notificationsEmail: string;
}
