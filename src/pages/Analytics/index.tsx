import { PageHeader } from "@/components/common/PageHeader";
import { useT } from "@/i18n/useT";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { useAnalyticsBoard } from "@/services/analyticsBoard/useAnalyticsBoard";

import { AnalyticsStats } from "./ui/AnalyticsStats";
import { RevenueBars } from "./ui/RevenueBars";
import { CategoryBreakdown } from "./ui/CategoryBreakdown";

export default function AnalyticsPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useAnalyticsBoard();

  return (
    <div>
      <PageHeader
        title={t("page.analytics.title")}
        subtitle={t("page.analytics.subtitle")}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="flex flex-col gap-5">
          <AnalyticsStats kpis={data.kpis} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <RevenueBars months={data.months} />
            </div>
            <CategoryBreakdown categories={data.categories} />
          </div>
        </div>
      )}
    </div>
  );
}
