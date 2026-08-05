import { useMemo } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs } from "@/components/common/FilterTabs";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { useCampaigns, useMarketingSummary } from "@/services/marketing/useMarketing";

import { MarketingStats } from "./ui/MarketingStats";
import { CampaignsTable } from "./ui/CampaignsTable";
import { toRow, FILTER_TABS } from "./lib/marketing.helpers";

export default function MarketingPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useCampaigns();
  const { data: summary } = useMarketingSummary();

  // URL state: /marketing?status=active — shareable & survives refresh.
  const [params, setParams] = useSearchParams();
  const filter = params.get("status") ?? "all";

  const rows = useMemo(() => {
    const all = (data ?? []).map(toRow);
    return filter === "all" ? all : all.filter((r) => r.st === filter);
  }, [data, filter]);

  function setFilter(key: string) {
    setParams(key === "all" ? {} : { status: key }, { replace: true });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.marketing.title")}
        subtitle={t("page.marketing.subtitle")}
        action={<FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />}
      />

      {summary ? <MarketingStats summary={summary} /> : null}

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("marketing.empty")} />
      ) : (
        <CampaignsTable rows={rows} />
      )}
    </div>
  );
}
