import type { FilterTab } from "@/components/common/FilterTabs";
import { Bell, CreditCard, ShoppingCart, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { NotificationKind } from "@/services/notifications/notifications.types";

export type NotificationMeta = {
  label: string;
  icon: LucideIcon;
  fg: string;
  bg: string;
};

export const TYPE_META: Record<NotificationKind, NotificationMeta> = {
  order: { label: "Заказ", icon: ShoppingCart, fg: "#1f6b49", bg: "#e9f4ee" },
  payment: { label: "Платёж", icon: CreditCard, fg: "#a86a1f", bg: "#fbf1e2" },
  review: { label: "Отзыв", icon: Star, fg: "#1f5f8b", bg: "#e6f1f8" },
  system: { label: "Система", icon: Bell, fg: "#6d7c74", bg: "#eef2f0" },
};

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "order", label: "notifications.filter.order" },
  { key: "payment", label: "notifications.filter.payment" },
  { key: "review", label: "notifications.filter.review" },
  { key: "system", label: "notifications.filter.system" },
];
