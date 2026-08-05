import { Wallet, ShoppingBag, Receipt, Target } from "lucide-react";
import { useT } from "@/i18n/useT";
import { StatCard } from "@/components/common/StatCard";
import { money, fmt } from "@/lib/format";
import type { Kpis } from "@/services/analytics/analytics.types";

export function DashboardStats({ kpis }: { kpis: Kpis }) {
  const t = useT();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label={t("metric.revenue")}
        value={money(kpis.rev)}
        delta={kpis.dRev}
        icon={Wallet}
      />
      <StatCard
        label={t("metric.orders")}
        value={fmt(kpis.orders)}
        delta={kpis.dOrders}
        icon={ShoppingBag}
      />
      <StatCard
        label={t("metric.avgCheck")}
        value={money(kpis.avg)}
        delta={kpis.dAvg}
        icon={Receipt}
      />
      <StatCard
        label={t("metric.conversion")}
        value={kpis.conv.toFixed(1) + "%"}
        delta={kpis.dConv}
        icon={Target}
      />
    </div>
  );
}
