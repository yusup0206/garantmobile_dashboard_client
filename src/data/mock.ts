/**
 * Mock data layer — ported from the prototype's data dictionary.
 * In production, feature APIs (services/*) would return this shape from a backend.
 */
import type { Order, OrderStatusKey } from "@/services/orders/orders.types";
import type {
  PeriodData,
  PeriodKey,
  TopProduct,
} from "@/services/analytics/analytics.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const ORDER_STATUS: Record<OrderStatusKey, StatusMeta> = {
  proc: { labelKey: "status.order.proc", fg: "#a86a1f", bg: "#fbf1e2", dot: "#e0a144" },
  done: { labelKey: "status.order.done", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  cancel: { labelKey: "status.order.cancel", fg: "#b4453a", bg: "#fbecea", dot: "#e05a4a" },
};

export const ORDERS: Order[] = [
  {
    num: "№ GM-204817",
    date: "4 июл",
    st: "proc",
    ids: [1],
    total: 34500,
  },
  {
    num: "№ GM-204816",
    date: "4 июл",
    st: "done",
    ids: [11, 19],
    total: 4720,
  },
  {
    num: "№ GM-204815",
    date: "3 июл",
    st: "proc",
    ids: [13],
    total: 11200,
  },
  {
    num: "№ GM-204814",
    date: "3 июл",
    st: "done",
    ids: [5],
    total: 29800,
  },
  {
    num: "№ GM-204813",
    date: "3 июл",
    st: "cancel",
    ids: [17],
    total: 12600,
  },
  {
    num: "№ GM-204812",
    date: "2 июл",
    st: "done",
    ids: [9, 11],
    total: 14100,
  },
  {
    num: "№ GM-204811",
    date: "2 июл",
    st: "proc",
    ids: [3],
    total: 6300,
  },
  {
    num: "№ GM-204810",
    date: "1 июл",
    st: "done",
    ids: [12],
    total: 5900,
  },
  {
    num: "№ GM-204809",
    date: "1 июл",
    st: "proc",
    ids: [7],
    total: 17800,
  },
  {
    num: "№ GM-204808",
    date: "30 июн",
    st: "cancel",
    ids: [2],
    total: 28900,
  },
  {
    num: "№ GM-204807",
    date: "30 июн",
    st: "done",
    ids: [10, 18],
    total: 6850,
  },
  {
    num: "№ GM-204806",
    date: "29 июн",
    st: "done",
    ids: [4],
    total: 27900,
  },
];

/** Minimal product lookup for order item names. */
export const PRODUCT_NAMES: Record<number, string> = {
  1: "iPhone 15 Pro Max 256 ГБ",
  2: "Samsung Galaxy S24 Ultra",
  3: "Xiaomi Redmi Note 13",
  4: "iPhone 15 128 ГБ",
  5: 'MacBook Air M3 13"',
  7: 'iPad Air 11" M2',
  9: "Apple Watch Series 9",
  10: "Samsung Galaxy Watch 6",
  11: "AirPods Pro 2",
  12: "Sony WH-1000XM5",
  13: 'Samsung QLED 55" 4K',
  17: "PlayStation 5 Slim",
  18: "Anker Power Bank 20000",
  19: "Anker зарядка 65 Вт",
};

export const PERIODS: Record<PeriodKey, PeriodData> = {
  d7: {
    kpis: {
      rev: 623000,
      orders: 318,
      avg: 1959,
      conv: 3.6,
      dRev: 9.2,
      dOrders: 6.0,
      dAvg: 2.1,
      dConv: 0.3,
    },
    series: [78000, 82000, 85000, 91000, 88000, 97000, 102000],
    pLabels: ["28 июн", "29 июн", "30 июн", "1 июл", "2 июл", "3 июл", "4 июл"],
  },
  d30: {
    kpis: {
      rev: 2586000,
      orders: 1284,
      avg: 2014,
      conv: 3.8,
      dRev: 12.4,
      dOrders: 8.1,
      dAvg: 3.7,
      dConv: 0.4,
    },
    series: [
      178000, 192000, 186000, 205000, 199000, 214000, 221000, 209000, 231000, 238000,
      252000, 261000,
    ],
    pLabels: [
      "5 июн",
      "7 июн",
      "10 июн",
      "13 июн",
      "16 июн",
      "19 июн",
      "22 июн",
      "25 июн",
      "28 июн",
      "30 июн",
      "2 июл",
      "4 июл",
    ],
  },
  d90: {
    kpis: {
      rev: 7142000,
      orders: 3690,
      avg: 1936,
      conv: 3.9,
      dRev: 15.8,
      dOrders: 11.2,
      dAvg: 2.9,
      dConv: 0.5,
    },
    series: [
      521000, 548000, 532000, 571000, 559000, 588000, 602000, 585000, 631000, 648000,
      662000, 695000,
    ],
    pLabels: [
      "5 апр",
      "15 апр",
      "25 апр",
      "5 май",
      "15 май",
      "25 май",
      "4 июн",
      "14 июн",
      "21 июн",
      "28 июн",
      "1 июл",
      "4 июл",
    ],
  },
};

export const TOP_PRODUCTS: TopProduct[] = [
  { id: 1, name: PRODUCT_NAMES[1], sales: 142, rev: 4906000 },
  { id: 2, name: PRODUCT_NAMES[2], sales: 98, rev: 2842000 },
  { id: 3, name: PRODUCT_NAMES[3], sales: 210, rev: 1260000 },
  { id: 17, name: PRODUCT_NAMES[17], sales: 76, rev: 958000 },
  { id: 11, name: PRODUCT_NAMES[11], sales: 180, rev: 774000 },
  { id: 13, name: PRODUCT_NAMES[13], sales: 64, rev: 717000 },
];
