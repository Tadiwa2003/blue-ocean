export interface KpiTile {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: 'up' | 'down' | 'flat';
}

export interface SalesDataPoint {
  period: string;
  sales: number;
  orders: number;
  customers: number;
}

export interface AnalyticsSnapshot {
  range: 'week' | 'month' | 'quarter';
  kpis: KpiTile[];
  sales: SalesDataPoint[];
}
