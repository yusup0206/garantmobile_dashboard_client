import { describe, it, expect } from "vitest";
import { productSchema } from "./product.schema";

describe("productSchema", () => {
  it("accepts a valid product and coerces numeric strings", () => {
    const res = productSchema.safeParse({
      nameRu: "iPhone 15 Pro",
      nameTk: "iPhone 15 Pro",
      shortRu: "Смартфон Apple",
      shortTk: "Apple smartfony",
      price: "34500",
      oldPrice: "36000",
      stock: "24",
      brandId: "brand_1",
      categoryId: "1",
      unitId: "unit_1",
      photos: [],
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.price).toBe(34500);
      expect(res.data.oldPrice).toBe(36000);
      expect(res.data.stock).toBe(24);
    }
  });

  it("rejects a too-short name", () => {
    const res = productSchema.safeParse({
      nameRu: "x",
      nameTk: "iPhone 15 Pro",
      shortRu: "Short",
      shortTk: "Short",
      price: 100,
      oldPrice: 0,
      stock: 1,
      brandId: "brand_1",
      categoryId: "1",
      unitId: "unit_1",
    });
    expect(res.success).toBe(false);
  });

  it("rejects negative price and non-integer stock", () => {
    expect(
      productSchema.safeParse({
        nameRu: "Товар",
        nameTk: "Haryt",
        shortRu: "Короткое",
        shortTk: "Gysga",
        price: -1,
        oldPrice: 0,
        stock: 1,
        brandId: "b1",
        categoryId: "c1",
        unitId: "u1",
      }).success,
    ).toBe(false);
    expect(
      productSchema.safeParse({
        nameRu: "Товар",
        nameTk: "Haryt",
        shortRu: "Короткое",
        shortTk: "Gysga",
        price: 1,
        oldPrice: 0,
        stock: 1.5,
        brandId: "b1",
        categoryId: "c1",
        unitId: "u1",
      }).success,
    ).toBe(false);
  });

  it("rejects missing brand, category or unit ID", () => {
    const res = productSchema.safeParse({
      nameRu: "Товар",
      nameTk: "Haryt",
      shortRu: "Короткое",
      shortTk: "Gysga",
      price: 1,
      oldPrice: 0,
      stock: 1,
      brandId: "",
      categoryId: "",
      unitId: "",
    });
    expect(res.success).toBe(false);
  });
});
