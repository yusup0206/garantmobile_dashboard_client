import { useT } from "@/i18n/useT";
import { Card, CardHeader } from "@/components/ui/Card";
import { money } from "@/lib/format";
import { usePlural } from "@/i18n/usePlural";
import { useTopProducts } from "@/services/analytics/useAnalytics";
import { LoadingState } from "@/components/common/LoadingState";

export function TopProducts() {
  const t = useT();
  const plural = usePlural();
  const { data, isLoading } = useTopProducts();
  if (isLoading || !data)
    return (
      <Card>
        <LoadingState />
      </Card>
    );

  const max = Math.max(...data.map((p) => p.sales));

  return (
    <Card>
      <CardHeader title={t("dashboard.topProducts")} />
      <ul className="flex flex-col gap-3.5">
        {data.map((p) => (
          <li key={p.id} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-sm font-semibold text-ink">{p.name}</span>
              <span className="shrink-0 font-display text-sm font-bold text-brand-dark">
                {money(p.rev)}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-canvas">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: (p.sales / max) * 100 + "%" }}
                />
              </div>
              <span className="w-24 shrink-0 text-right text-xs text-muted">
                {plural(p.sales, "plural.sale")}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
