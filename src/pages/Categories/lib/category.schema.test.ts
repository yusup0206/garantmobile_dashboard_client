import { describe, it, expect } from "vitest";
import { categorySchema } from "./category.schema";

describe("categorySchema", () => {
  it("accepts a valid category", () => {
    const res = categorySchema.safeParse({
      name: "Смартфоны",
      slug: "smartphones",
      st: "active",
    });
    expect(res.success).toBe(true);
  });

  it("rejects a slug with non-latin / spaces / uppercase", () => {
    for (const slug of ["Смартфоны", "smart phones", "Smart", "phones!"]) {
      expect(categorySchema.safeParse({ name: "Тест", slug, st: "active" }).success).toBe(
        false,
      );
    }
  });

  it("rejects an unknown status", () => {
    expect(
      categorySchema.safeParse({ name: "Тест", slug: "test", st: "gone" }).success,
    ).toBe(false);
  });
});
