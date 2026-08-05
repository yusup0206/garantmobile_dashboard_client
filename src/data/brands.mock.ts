/**
 * Mock brand data. In production a feature API would return this shape from the
 * backend; the page code never changes.
 */
import type { Brand } from "@/services/brands/brands.types";

export const BRANDS: Brand[] = [
  { id: 1, name: "Apple", country: "США", products: 64, st: "active" },
  { id: 2, name: "Samsung", country: "Корея", products: 58, st: "active" },
  { id: 3, name: "Xiaomi", country: "Китай", products: 47, st: "active" },
  { id: 4, name: "Sony", country: "Япония", products: 23, st: "active" },
  { id: 5, name: "Anker", country: "Китай", products: 31, st: "active" },
  { id: 6, name: "Huawei", country: "Китай", products: 19, st: "inactive" },
  { id: 7, name: "Realme", country: "Китай", products: 14, st: "active" },
  { id: 8, name: "Asus", country: "Тайвань", products: 12, st: "active" },
  { id: 9, name: "LG", country: "Корея", products: 9, st: "inactive" },
  { id: 10, name: "JBL", country: "США", products: 17, st: "active" },
];
