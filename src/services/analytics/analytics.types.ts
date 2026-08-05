export type PeriodKey = "d7" | "d30" | "d90";

export type Kpis = {
  rev: number;
  orders: number;
  avg: number;
  conv: number;
  dRev: number;
  dOrders: number;
  dAvg: number;
  dConv: number;
};

export type PeriodData = {
  kpis: Kpis;
  series: number[];
  pLabels: string[];
};

export type TopProduct = {
  id: number;
  name: string;
  sales: number;
  rev: number;
};
