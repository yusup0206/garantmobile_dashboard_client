/**
 * Mock data layer for notifications — mirrors the shape a notifications API
 * (services/notifications/*) would return from a backend.
 */
import type { AppNotification } from "@/services/notifications/notifications.types";

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    kind: "order",
    text: "Новый заказ № GM-204818 на 34 500 m",
    time: "5 мин назад",
    read: false,
  },
  {
    id: 2,
    kind: "payment",
    text: "Платёж PAY-88214 подтверждён",
    time: "18 мин назад",
    read: false,
  },
  {
    id: 3,
    kind: "review",
    text: "Новый отзыв на iPhone 15 Pro Max",
    time: "42 мин назад",
    read: false,
  },
  {
    id: 4,
    kind: "order",
    text: "Заказ № GM-204791 передан в доставку",
    time: "1 ч назад",
    read: true,
  },
  {
    id: 5,
    kind: "system",
    text: "Обновление системы завершено",
    time: "2 ч назад",
    read: false,
  },
  {
    id: 6,
    kind: "payment",
    text: "Платёж PAY-88190 ожидает подтверждения",
    time: "3 ч назад",
    read: true,
  },
  {
    id: 7,
    kind: "review",
    text: "Новый отзыв на Samsung Galaxy S24 Ultra",
    time: "4 ч назад",
    read: true,
  },
  {
    id: 8,
    kind: "order",
    text: "Заказ № GM-204762 отменён клиентом",
    time: "6 ч назад",
    read: true,
  },
  {
    id: 9,
    kind: "system",
    text: "Резервное копирование базы данных выполнено",
    time: "Вчера",
    read: true,
  },
  {
    id: 10,
    kind: "payment",
    text: "Возврат средств по заказу GM-204705 обработан",
    time: "Вчера",
    read: true,
  },
  {
    id: 11,
    kind: "order",
    text: "Новый заказ № GM-204688 на 12 900 m",
    time: "Вчера",
    read: true,
  },
  {
    id: 12,
    kind: "review",
    text: "Новый отзыв на AirPods Pro 2",
    time: "2 дня назад",
    read: true,
  },
];
