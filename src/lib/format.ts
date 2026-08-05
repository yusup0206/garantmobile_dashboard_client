/**
 * Formatting helpers shared across the app. Currency is Turkmen manat "m" for
 * all languages. Number grouping and plural forms follow the active language.
 */
import type { Lang } from "@/i18n/dict";

const LOCALE: Record<Lang, string> = { ru: "ru-RU", en: "en-US" };

function locale(lang: Lang): string {
  return LOCALE[lang] ?? "ru-RU";
}

export function fmt(n: number, lang: Lang = "ru"): string {
  return Math.round(n).toLocaleString(locale(lang));
}

export function money(n: number, lang: Lang = "ru"): string {
  return fmt(n, lang) + " m";
}

/** Compact number: 12000 → "12k"/"12к", 2_500_000 → "2.5M"/"2,5 млн".
 *  Suffixes default per language; pass `sfx` to inject translated ones. */
export function compact(
  n: number,
  lang: Lang = "ru",
  sfx?: { thousand: string; million: string },
): string {
  const en = lang === "en";
  const million = sfx?.million ?? (en ? "M" : "млн");
  const thousand = sfx?.thousand ?? (en ? "k" : "к");
  if (n >= 1e6) {
    const v = (n / 1e6).toFixed(1);
    const num = en ? v.replace(".0", "") : v.replace(".", ",").replace(",0", "");
    return en ? num + million : num + " " + million;
  }
  if (n >= 1e3) return Math.round(n / 1e3) + thousand;
  return String(Math.round(n));
}

export function initials(name: string): string {
  const parts = String(name).trim().split(" ").filter(Boolean);
  const a = (parts[0] || "")[0] || "";
  const b = (parts[1] || "")[0] || "";
  return (a + b).toUpperCase();
}

/** CLDR plural category for `n` in `lang` — ru returns one|few|many|other,
 *  en returns one|other. Used to build a `plural.<base>.<category>` key. */
export function pluralCategory(n: number, lang: Lang): Intl.LDMLPluralRule {
  return new Intl.PluralRules(locale(lang)).select(n);
}
