import { describe, it, expect } from "vitest";
import { categorySchema } from "./category.schema";

describe("categorySchema", () => {
  it("accepts a valid category", () => {
    const res = categorySchema.safeParse({
      nameTk: "Smartfonlar",
      nameRu: "Смартфоны",
      slug: "smartphones",
      homepageShow: true,
      sortOrder: 0,
    });
    expect(res.success).toBe(true);
  });

  it("rejects a slug with non-latin / spaces / uppercase", () => {
    for (const slug of ["Смартфоны", "smart phones", "Smart", "phones!"]) {
      expect(
        categorySchema.safeParse({
          nameTk: "Test",
          nameRu: "Тест",
          slug,
        }).success,
      ).toBe(false);
    }
  });

  it("rejects a short name", () => {
    expect(
      categorySchema.safeParse({
        nameTk: "A",
        nameRu: "Б",
        slug: "test",
      }).success,
    ).toBe(false);
  });
});
