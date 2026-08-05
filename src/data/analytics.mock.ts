/**
 * Mock data layer for the Analytics board — ported from the prototype's data
 * dictionary. In production, services/analyticsBoard/* would return this shape
 * from a backend.
 */
import type { AnalyticsBoard } from "@/services/analyticsBoard/analyticsBoard.types";

export const ANALYTICS_BOARD: AnalyticsBoard = {
  kpis: {
    visitors: 48120,
    revenue: 2586000,
    orders: 1284,
    avgCheck: 2014,
  },
  months: [
    { label: "Мар", value: 1842000 },
    { label: "Апр", value: 1976000 },
    { label: "Май", value: 2105000 },
    { label: "Июн", value: 2214000 },
    { label: "Июл", value: 2331000 },
    { label: "Авг", value: 2408000 },
    { label: "Сен", value: 2497000 },
    { label: "Окт", value: 2586000 },
  ],
  categories: [
    { name: "Смартфоны", revenue: 1086000, share: 42 },
    { name: "Ноутбуки", revenue: 517000, share: 20 },
    { name: "ТВ", revenue: 362000, share: 14 },
    { name: "Аудио", revenue: 258000, share: 10 },
    { name: "Аксессуары", revenue: 207000, share: 8 },
    { name: "Часы", revenue: 156000, share: 6 },
  ],
};
