import { cn } from "@/lib/cn";
import type { PeriodKey } from "@/services/analytics/analytics.types";

const OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "d7", label: "7 дней" },
  { key: "d30", label: "30 дней" },
  { key: "d90", label: "90 дней" },
];

export function PeriodTabs({
  value,
  onChange,
}: {
  value: PeriodKey;
  onChange: (p: PeriodKey) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-line bg-surface p-1">
      {OPTIONS.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          className={cn(
            "rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors",
            value === o.key ? "bg-brand text-white" : "text-muted hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
