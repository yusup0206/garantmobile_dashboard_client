import { useT } from "@/i18n/useT";
import { Card, CardHeader } from "@/components/ui/Card";
import { money } from "@/lib/format";
import type { CategoryBreakdownProps } from "../types";

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const t = useT();
  return (
    <Card>
      <CardHeader title={t("analytics.revenueByCategory")} />
      <ul className="flex flex-col gap-3.5">
        {categories.map((c) => (
          <li key={c.name} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-sm font-semibold text-ink">{c.name}</span>
              <span className="shrink-0 font-display text-sm font-bold text-brand-dark">
                {money(c.revenue)}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-canvas">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: c.share + "%" }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-xs text-muted">
                {c.share}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
