import { useT } from "@/i18n/useT";
import { Card, CardHeader } from "@/components/ui/Card";
import { barHeight, maxMonthValue } from "../lib/analytics.helpers";
import type { RevenueBarsProps } from "../types";

export function RevenueBars({ months }: RevenueBarsProps) {
  const t = useT();
  const max = maxMonthValue(months);

  return (
    <Card>
      <CardHeader title={t("analytics.revenueByMonth")} />
      <div className="flex h-48 items-end gap-3">
        {months.map((m) => (
          <div key={m.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-full w-full items-end">
              <div
                className="w-full rounded-t bg-brand"
                style={{ height: barHeight(m.value, max) }}
              />
            </div>
            <span className="text-[11px] text-faint">{m.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
