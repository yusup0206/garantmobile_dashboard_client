import { Users, Wallet, ShoppingBag, Receipt } from "lucide-react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { StatCard } from "@/components/common/StatCard";
import { money, fmt, compact } from "@/lib/format";
import type { AnalyticsStatsProps } from "../types";

export function AnalyticsStats({ kpis }: AnalyticsStatsProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label={t("metric.visitors")} value={compact(kpis.visitors, lang)} icon={Users} />
      <StatCard label={t("metric.revenue")} value={money(kpis.revenue, lang)} icon={Wallet} />
      <StatCard label={t("metric.orders")} value={fmt(kpis.orders, lang)} icon={ShoppingBag} />
      <StatCard label={t("metric.avgCheck")} value={money(kpis.avgCheck, lang)} icon={Receipt} />
    </div>
  );
}
