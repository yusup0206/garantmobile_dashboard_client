import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";

export type FilterTab = {
  key: string;
  label: TKey;
};

type FilterTabsProps = {
  tabs: FilterTab[];
  value: string;
  onChange: (key: string) => void;
};

/** Reusable pill-style tab switcher used by list pages (orders, catalog, warranty). */
export function FilterTabs({ tabs, value, onChange }: FilterTabsProps) {
  const t = useT();
  return (
    <div className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors",
            value === tab.key
              ? "bg-brand text-white"
              : "bg-surface text-muted hover:bg-brand-soft hover:text-brand-dark",
          )}
        >
          {t(tab.label)}
        </button>
      ))}
    </div>
  );
}
