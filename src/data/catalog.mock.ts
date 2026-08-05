/**
 * Mock catalog / stock data. In production a feature API would return this
 * shape from the backend; the page code never changes.
 */
import type { CatalogItem, Category } from "@/services/catalog/catalog.types";
import type { TKey } from "@/i18n/dict";

export const CATEGORIES: Category[] = [
  { key: "phones", label: "Смартфоны" },
  { key: "laptops", label: "Ноутбуки" },
  { key: "tv", label: "Телевизоры" },
  { key: "audio", label: "Аудио" },
  { key: "tablets", label: "Планшеты" },
  { key: "watch", label: "Часы" },
  { key: "acc", label: "Аксессуары" },
];

// Category display names double as i18n keys (the RU label is a valid TKey).
export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
) as Record<string, TKey>;

export const CATALOG_ITEMS: CatalogItem[] = [
  { id: 1, name: "iPhone 15 Pro Max 256 ГБ", cat: "phones", price: 34500, stock: 18 },
  { id: 2, name: "Samsung Galaxy S24 Ultra", cat: "phones", price: 28900, stock: 7 },
  { id: 3, name: "Xiaomi Redmi Note 13", cat: "phones", price: 6300, stock: 54 },
  { id: 4, name: "iPhone 15 128 ГБ", cat: "phones", price: 27900, stock: 0 },
  { id: 5, name: 'MacBook Air M3 13"', cat: "laptops", price: 29800, stock: 12 },
  { id: 6, name: "ASUS Vivobook 15", cat: "laptops", price: 13400, stock: 3 },
  { id: 7, name: 'iPad Air 11" M2', cat: "tablets", price: 17800, stock: 9 },
  { id: 8, name: "Samsung Galaxy Tab S9", cat: "tablets", price: 15200, stock: 0 },
  { id: 9, name: "Apple Watch Series 9", cat: "watch", price: 9800, stock: 22 },
  { id: 10, name: "Samsung Galaxy Watch 6", cat: "watch", price: 6400, stock: 5 },
  { id: 11, name: "AirPods Pro 2", cat: "audio", price: 4300, stock: 40 },
  { id: 12, name: "Sony WH-1000XM5", cat: "audio", price: 5900, stock: 8 },
  { id: 13, name: 'Samsung QLED 55" 4K', cat: "tv", price: 11200, stock: 6 },
  { id: 14, name: 'LG OLED 65" C4', cat: "tv", price: 24600, stock: 2 },
  { id: 17, name: "PlayStation 5 Slim", cat: "acc", price: 12600, stock: 0 },
  { id: 18, name: "Anker Power Bank 20000", cat: "acc", price: 480, stock: 120 },
  { id: 19, name: "Anker зарядка 65 Вт", cat: "acc", price: 320, stock: 86 },
];
