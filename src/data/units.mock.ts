/**
 * Mock unit data. In production a feature API would return this shape from the
 * backend; the page code never changes.
 */
import type { Unit } from "@/services/units/units.types";

export const UNITS: Unit[] = [
  { id: 1, name: "Гарант Центр", city: "Ашхабад", kind: "store", staff: 18, st: "open" },
  { id: 2, name: "Беркарар", city: "Ашхабад", kind: "store", staff: 14, st: "open" },
  { id: 3, name: "Оптовый", city: "Ашхабад", kind: "warehouse", staff: 9, st: "open" },
  { id: 4, name: "Сервис-центр", city: "Ашхабад", kind: "service", staff: 7, st: "open" },
  { id: 5, name: "Магазин", city: "Дашогуз", kind: "store", staff: 11, st: "open" },
  { id: 6, name: "Гарант Мары", city: "Мары", kind: "store", staff: 10, st: "closed" },
  { id: 7, name: "Склад", city: "Туркменабат", kind: "warehouse", staff: 6, st: "open" },
  { id: 8, name: "Сервис", city: "Балканабат", kind: "service", staff: 4, st: "open" },
];
