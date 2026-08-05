import { describe, it, expect } from "vitest";
import { I18N, type Lang } from "./dict";

const langs = Object.keys(I18N) as Lang[];

describe("i18n dict", () => {
  it("every language has the same set of keys as ru", () => {
    const ruKeys = Object.keys(I18N.ru).sort();
    for (const lang of langs) {
      expect(Object.keys(I18N[lang]).sort(), `keys for "${lang}"`).toEqual(ruKeys);
    }
  });

  it("has no empty values", () => {
    for (const lang of langs) {
      for (const [key, value] of Object.entries(I18N[lang])) {
        expect(value, `${lang}."${key}"`).toBeTruthy();
      }
    }
  });

  it("{placeholders} match across languages", () => {
    const ph = (s: string) => (s.match(/\{(\w+)\}/g) ?? []).sort().join(",");
    for (const key of Object.keys(I18N.ru) as (keyof typeof I18N.ru)[]) {
      const base = ph(I18N.ru[key]);
      for (const lang of langs) {
        expect(ph(I18N[lang][key]), `placeholders for ${lang}."${String(key)}"`).toBe(base);
      }
    }
  });
});
