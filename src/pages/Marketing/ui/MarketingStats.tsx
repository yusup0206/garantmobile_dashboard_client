import { Megaphone, Users, Wallet, Target } from "lucide-react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { StatCard } from "@/components/common/StatCard";
import { money, fmt, compact } from "@/lib/format";
import type { MarketingSummary } from "@/services/marketing/marketing.types";

export function MarketingStats({ summary }: { summary: MarketingSummary }) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label={t("metric.activePromos")}
        value={fmt(summary.active, lang)}
        icon={Megaphone}
      />
      <StatCard label={t("form.reach")} value={compact(summary.reach, lang)} icon={Users} />
      <StatCard
        label={t("metric.promoRevenue")}
        value={money(summary.revenue, lang)}
        icon={Wallet}
      />
      <StatCard
        label={t("metric.conversion")}
        value={summary.conversion.toFixed(1) + "%"}
        icon={Target}
      />
    </div>
  );
}
