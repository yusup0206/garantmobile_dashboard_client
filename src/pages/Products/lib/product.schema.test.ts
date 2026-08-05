import { describe, it, expect } from "vitest";
import { productSchema } from "./product.schema";

describe("productSchema", () => {
  it("accepts a valid product and coerces numeric strings", () => {
    const res = productSchema.safeParse({
      name: "iPhone 15 Pro",
      brand: "Apple",
      category: "Смартфоны",
      price: "34500",
      stock: "24",
      st: "active",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.price).toBe(34500);
      expect(res.data.stock).toBe(24);
    }
  });

  it("rejects a too-short name", () => {
    const res = productSchema.safeParse({
      name: "x",
      brand: "Apple",
      category: "Смартфоны",
      price: 100,
      stock: 1,
      st: "draft",
    });
    expect(res.success).toBe(false);
  });

  it("rejects negative price and non-integer stock", () => {
    expect(
      productSchema.safeParse({
        name: "Товар",
        brand: "A",
        category: "B",
        price: -1,
        stock: 1,
        st: "active",
      }).success,
    ).toBe(false);
    expect(
      productSchema.safeParse({
        name: "Товар",
        brand: "A",
        category: "B",
        price: 1,
        stock: 1.5,
        st: "active",
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown status", () => {
    const res = productSchema.safeParse({
      name: "Товар",
      brand: "A",
      category: "B",
      price: 1,
      stock: 1,
      st: "sold",
    });
    expect(res.success).toBe(false);
  });
});
