import { useState } from "react";
import { useT } from "@/i18n/useT";

import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { usePeriod } from "@/services/analytics/useAnalytics";
import type { PeriodKey } from "@/services/analytics/analytics.types";

import { PeriodTabs } from "./ui/PeriodTabs";
import { DashboardStats } from "./ui/DashboardStats";
import { RevenueChart } from "./ui/RevenueChart";
import { RecentOrders } from "./ui/RecentOrders";
import { TopProducts } from "./ui/TopProducts";

export default function DashboardPage() {
  const t = useT();
  const [period, setPeriod] = useState<PeriodKey>("d30");
  const { data, isLoading, isError, refetch } = usePeriod(period);

  return (
    <div>
      <PageHeader
        title={t("page.dashboard.title")}
        subtitle={t("page.dashboard.subtitle")}
        action={<PeriodTabs value={period} onChange={setPeriod} />}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="flex flex-col gap-5">
          <DashboardStats kpis={data.kpis} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <RevenueChart series={data.series} labels={data.pLabels} />
            </div>
            <TopProducts />
          </div>
          <RecentOrders />
        </div>
      )}
    </div>
  );
}
