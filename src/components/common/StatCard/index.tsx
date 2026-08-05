import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { useT } from "@/i18n/useT";

type StatCardProps = {
  label: string;
  value: string;
  delta?: number; // percent change vs previous period
  icon: LucideIcon;
};

export function StatCard({ label, value, delta, icon: Icon }: StatCardProps) {
  const t = useT();
  const up = (delta ?? 0) >= 0;
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand-dark">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.9} />
        </span>
      </div>
      <div className="font-display text-[26px] font-extrabold leading-none text-ink">
        {value}
      </div>
      {delta !== undefined ? (
        <div
          className={cn("text-xs font-semibold", up ? "text-brand-dark" : "text-red-600")}
        >
          {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% {t("metric.vsPrevPeriod")}
        </div>
      ) : null}
    </Card>
  );
}
