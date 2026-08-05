import type { Campaign, MarketingSummary } from "@/services/marketing/marketing.types";

export const MARKETING_SUMMARY: MarketingSummary = {
  active: 4,
  reach: 128400,
  revenue: 612000,
  conversion: 4.6,
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: "c-1",
    name: "Летняя распродажа техники",
    channel: "promo",
    period: "1 – 31 июл",
    reach: 42800,
    st: "active",
  },
  {
    id: "c-2",
    name: "Баннер на главной: iPhone 15",
    channel: "banner",
    period: "20 июн – 20 июл",
    reach: 31200,
    st: "active",
  },
  {
    id: "c-3",
    name: "Push: скидка на аксессуары",
    channel: "push",
    period: "5 – 8 июл",
    reach: 18600,
    st: "active",
  },
  {
    id: "c-4",
    name: "Рассрочка 0-0-12",
    channel: "promo",
    period: "постоянно",
    reach: 35800,
    st: "active",
  },
  {
    id: "c-5",
    name: "Обратно в школу",
    channel: "banner",
    period: "10 – 31 авг",
    reach: 0,
    st: "scheduled",
  },
  {
    id: "c-6",
    name: "Push: новинки Samsung",
    channel: "push",
    period: "25 авг",
    reach: 0,
    st: "scheduled",
  },
  {
    id: "c-7",
    name: "Весенние скидки",
    channel: "promo",
    period: "1 – 30 апр",
    reach: 51200,
    st: "finished",
  },
  {
    id: "c-8",
    name: "Баннер: PlayStation 5",
    channel: "banner",
    period: "1 – 20 июн",
    reach: 27400,
    st: "finished",
  },
];
