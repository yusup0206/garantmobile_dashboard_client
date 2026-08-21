import { useCallback } from "react";
import { useLangStore } from "@/store/i18n.store";
import { I18N, DEFAULT_LANG, type TKey } from "./dict";

type Vars = Record<string, string | number>;

/** Replace `{name}` placeholders with values from `vars`. */
function interpolate(str: string, vars?: Vars): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export type TFunction = (key: TKey, vars?: Vars) => string;

/**
 * Translation hook. `t("nav.dashboard")` returns the string for the active
 * language, falling back to the base language, then to the key itself.
 * Supports `{name}`-style interpolation: `t("greeting", { name })`.
 *
 * `key` is typed as `TKey`, so an unknown key is a compile error.
 */
export function useT(): TFunction {
  const lang = useLangStore((s) => s.lang);
  return useCallback(
    (key: TKey, vars?: Vars) => {
      const dict = (I18N[lang] ?? I18N[DEFAULT_LANG]) as Record<TKey, string>;
      return interpolate(dict?.[key] ?? I18N[DEFAULT_LANG][key] ?? key, vars);
    },
    [lang],
  );
}
