import { useLangStore } from "@/store/i18n.store";
import { useT } from "./useT";
import { fmt, pluralCategory } from "@/lib/format";
import type { TKey } from "./dict";

/**
 * Localized pluralization. `usePlural()(3, "plural.product")` →
 * "3 товара" / "3 products". `Intl.PluralRules` picks the CLDR category
 * (one|few|many|other for ru, one|other for en); the forms live in the dict
 * as `plural.<base>.<category>`.
 */
export function usePlural() {
  const lang = useLangStore((s) => s.lang);
  const t = useT();
  return (n: number, base: string): string =>
    `${fmt(n, lang)} ${t(`${base}.${pluralCategory(n, lang)}` as TKey)}`;
}
