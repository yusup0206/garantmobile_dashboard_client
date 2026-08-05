import { useMemo } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs } from "@/components/common/FilterTabs";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { usePagination } from "@/lib/usePagination";
import { useTradein, useUpdateTradeinStatus } from "@/services/tradein/useTradein";
import type { TradeinStatusKey } from "@/services/tradein/tradein.types";

import { TradeinTable } from "./ui/TradeinTable";
import { toRow, FILTER_TABS, STATUS_OPTIONS } from "./lib/tradein.helpers";

export default function TradeinPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useTradein();
  const updateStatus = useUpdateTradeinStatus();
  // URL state: /tradein?status=new — shareable & survives refresh.
  const [params, setParams] = useSearchParams();
  const filter = params.get("status") ?? "all";

  const rows = useMemo(() => {
    const all = (data ?? []).map(toRow);
    return filter === "all" ? all : all.filter((r) => r.st === filter);
  }, [data, filter]);

  const pg = usePagination(rows, 8, filter);

  function setFilter(key: string) {
    setParams(key === "all" ? {} : { status: key }, { replace: true });
  }

  return (
    <div>
      <PageHeader
        title={t("page.tradein.title")}
        subtitle={t("page.tradein.subtitle")}
        action={<FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("claims.empty")} />
      ) : (
        <>
          <TradeinTable
            rows={pg.slice}
            options={STATUS_OPTIONS}
            onStatus={(id, st) => updateStatus.mutate({ id, st: st as TradeinStatusKey })}
          />
          <Pagination
            page={pg.page}
            pageCount={pg.pageCount}
            total={pg.total}
            pageSize={pg.pageSize}
            onPage={pg.setPage}
          />
        </>
      )}
    </div>
  );
}
