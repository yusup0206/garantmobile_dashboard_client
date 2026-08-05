/**
 * Mock data layer for the trade-in feature.
 * In production, services/tradein/*.api.ts would return this shape from a backend.
 */
import type { TradeinRequest, TradeinStatusKey } from "@/services/tradein/tradein.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const TRADEIN_STATUS: Record<TradeinStatusKey, StatusMeta> = {
  new: { labelKey: "status.tradein.new", fg: "#1f5f8b", bg: "#e6f1f8", dot: "#3b91d6" },
  review: { labelKey: "status.tradein.review", fg: "#a86a1f", bg: "#fbf1e2", dot: "#e0a144" },
  approved: { labelKey: "status.tradein.approved", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  rejected: { labelKey: "status.tradein.rejected", fg: "#b4453a", bg: "#fbecea", dot: "#e05a4a" },
};

export const TRADEIN_REQUESTS: TradeinRequest[] = [
  {
    id: "TI-2075",
    device: "iPhone 13 128 ГБ",
    customer: "Мерет Аннаев",
    estimate: 8200,
    date: "4 июл",
    st: "new",
  },
  {
    id: "TI-2074",
    device: "Samsung Galaxy S22",
    customer: "Гульнара Оразова",
    estimate: 6400,
    date: "4 июл",
    st: "review",
  },
  {
    id: "TI-2073",
    device: 'MacBook Air M1 13"',
    customer: "Батыр Гурбанов",
    estimate: 14500,
    date: "3 июл",
    st: "approved",
  },
  {
    id: "TI-2072",
    device: "iPhone 12 Pro",
    customer: "Айна Реджепова",
    estimate: 7100,
    date: "3 июл",
    st: "new",
  },
  {
    id: "TI-2071",
    device: "Xiaomi Redmi Note 11",
    customer: "Довлет Аширов",
    estimate: 2300,
    date: "2 июл",
    st: "rejected",
  },
  {
    id: "TI-2070",
    device: "Samsung Galaxy S21 FE",
    customer: "Огулджан Ханова",
    estimate: 4900,
    date: "2 июл",
    st: "review",
  },
  {
    id: "TI-2069",
    device: 'iPad Pro 11" 2021',
    customer: "Сердар Бердиев",
    estimate: 9800,
    date: "1 июл",
    st: "approved",
  },
  {
    id: "TI-2068",
    device: "iPhone 11 64 ГБ",
    customer: "Джерен Мурадова",
    estimate: 4200,
    date: "1 июл",
    st: "new",
  },
  {
    id: "TI-2067",
    device: "Huawei MateBook D15",
    customer: "Максат Атаев",
    estimate: 5600,
    date: "30 июн",
    st: "rejected",
  },
  {
    id: "TI-2066",
    device: "Samsung Galaxy A53",
    customer: "Лейли Сапарова",
    estimate: 3100,
    date: "30 июн",
    st: "review",
  },
];
