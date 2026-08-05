export type AnalyticsKpis = {
  visitors: number;
  revenue: number;
  orders: number;
  avgCheck: number;
};

export type AnalyticsMonth = {
  label: string;
  value: number;
};

export type AnalyticsCategory = {
  name: string;
  revenue: number;
  share: number;
};

export type AnalyticsBoard = {
  kpis: AnalyticsKpis;
  months: AnalyticsMonth[];
  categories: AnalyticsCategory[];
};
