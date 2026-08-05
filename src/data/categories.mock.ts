/**
 * Mock category data. In production a feature API would return this shape
 * from the backend; the page code never changes.
 */
import type { Category } from "@/services/categories/categories.types";

export const CATEGORIES: Category[] = [
  { id: 1, name: "Смартфоны", slug: "phones", products: 128, st: "active" },
  { id: 2, name: "Ноутбуки", slug: "laptops", products: 64, st: "active" },
  { id: 3, name: "Планшеты", slug: "tablets", products: 37, st: "active" },
  { id: 4, name: "Телевизоры", slug: "tv", products: 45, st: "active" },
  { id: 5, name: "Аудио", slug: "audio", products: 92, st: "active" },
  { id: 6, name: "Часы", slug: "watch", products: 51, st: "active" },
  { id: 7, name: "Аксессуары", slug: "acc", products: 214, st: "hidden" },
  { id: 8, name: "Игровые приставки", slug: "consoles", products: 12, st: "hidden" },
];
