import type { PeriodKey } from "@/services/analytics/analytics.types";

export type ChartPoint = {
  x: number;
  y: number;
  left: number;
  top: number;
  v: number;
  vfmt: string;
};

export type ChartModel = {
  line: string;
  area: string;
  points: ChartPoint[];
  ticks: { top: number; label: string }[];
};

export type { PeriodKey };
