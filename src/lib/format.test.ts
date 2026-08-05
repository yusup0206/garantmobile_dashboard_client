import { describe, it, expect } from "vitest";
import { fmt, money, compact, initials, pluralCategory } from "./format";

// ru-RU groups thousands with a non-breaking space (U+00A0); normalize to a
// plain space so the expected literals below stay readable ASCII.
const ns = (s: string) => s.replace(/\u00A0/g, " ");

describe("fmt", () => {
  it("groups thousands per locale", () => {
    expect(ns(fmt(1234567, "ru"))).toBe("1 234 567");
    expect(fmt(1234567, "en")).toBe("1,234,567");
    expect(ns(fmt(999.6, "ru"))).toBe("1 000");
  });
  it("defaults to ru when no lang is given", () => {
    expect(ns(fmt(1234))).toBe("1 234");
  });
});

describe("money", () => {
  it("appends the manat suffix in every language", () => {
    expect(ns(money(4500, "ru"))).toBe("4 500 m");
    expect(money(4500, "en")).toBe("4,500 m");
  });
});

describe("compact", () => {
  it("shortens with localized suffixes", () => {
    expect(compact(950, "ru")).toBe("950");
    expect(compact(12000, "ru")).toBe("12к");
    expect(compact(2_500_000, "ru")).toBe("2,5 млн");
    expect(compact(12000, "en")).toBe("12k");
    expect(compact(2_500_000, "en")).toBe("2.5M");
  });
});

describe("initials", () => {
  it("takes the first letter of the first two words, uppercased", () => {
    expect(initials("Ага Мурадов")).toBe("АМ");
    expect(initials("single")).toBe("S");
    expect(initials("")).toBe("");
  });
});

describe("pluralCategory", () => {
  it("returns CLDR categories for ru", () => {
    expect(pluralCategory(1, "ru")).toBe("one");
    expect(pluralCategory(2, "ru")).toBe("few");
    expect(pluralCategory(5, "ru")).toBe("many");
    expect(pluralCategory(11, "ru")).toBe("many");
    expect(pluralCategory(21, "ru")).toBe("one");
  });
  it("returns one|other for en", () => {
    expect(pluralCategory(1, "en")).toBe("one");
    expect(pluralCategory(2, "en")).toBe("other");
  });
});
