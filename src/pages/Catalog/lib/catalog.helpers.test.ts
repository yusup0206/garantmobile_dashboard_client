import { describe, it, expect } from "vitest";
import { stockLevel, toRow, STOCK_META } from "./catalog.helpers";
import type { CatalogItem } from "@/services/catalog/catalog.types";

describe("stockLevel", () => {
  it("classifies stock into in / low / out", () => {
    expect(stockLevel(0)).toBe("out");
    expect(stockLevel(3)).toBe("low");
    expect(stockLevel(5)).toBe("low");
    expect(stockLevel(6)).toBe("in");
    expect(stockLevel(40)).toBe("in");
  });
});

describe("toRow", () => {
  it("maps a catalog item to a display row", () => {
    const item: CatalogItem = {
      id: 1,
      name: "iPhone",
      cat: "phones",
      price: 34500,
      stock: 0,
    };
    const row = toRow(item);
    expect(row.categoryLabel).toBe("Смартфоны");
    expect(row.priceFmt.replace(/\u00A0/g, " ")).toBe("34 500 m");
    expect(row.level).toBe("out");
    expect(row.meta).toBe(STOCK_META.out);
  });
});
