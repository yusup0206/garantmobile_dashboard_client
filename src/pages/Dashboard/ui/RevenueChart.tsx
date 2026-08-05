import { useMemo } from "react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { Card, CardHeader } from "@/components/ui/Card";
import { buildChart } from "../lib/dashboard.helpers";

type RevenueChartProps = {
  series: number[];
  labels: string[];
};

export function RevenueChart({ series, labels }: RevenueChartProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const chart = useMemo(() => buildChart(series, lang), [series, lang]);

  return (
    <Card>
      <CardHeader title={t("dashboard.revenueTrend")} />
      <div className="relative">
        <svg viewBox="0 0 1000 260" preserveAspectRatio="none" className="h-56 w-full">
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2f8b63" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2f8b63" stopOpacity="0" />
            </linearGradient>
          </defs>
          {chart.ticks.map((t, i) => (
            <line
              key={i}
              x1="0"
              x2="1000"
              y1={(t.top / 100) * 260}
              y2={(t.top / 100) * 260}
              stroke="#e7ece9"
              strokeWidth="1"
            />
          ))}
          <path d={chart.area} fill="url(#revFill)" />
          <path
            d={chart.line}
            fill="none"
            stroke="#2f8b63"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {chart.points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#fff"
              stroke="#2f8b63"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-faint">
        {labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </Card>
  );
}
