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
import { usePreorders, useUpdatePreorderStatus } from "@/services/preorders/usePreorders";
import type { PreorderStatusKey } from "@/services/preorders/preorders.types";

import { PreordersTable } from "./ui/PreordersTable";
import { toRow, FILTER_TABS, STATUS_OPTIONS } from "./lib/preorders.helpers";

export default function PreordersPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = usePreorders();
  const updateStatus = useUpdatePreorderStatus();
  // URL state: /preorders?status=new — shareable & survives refresh.
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
        title={t("page.preorders.title")}
        subtitle={t("page.preorders.subtitle")}
        action={<FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("preorders.empty")} />
      ) : (
        <>
          <PreordersTable
            rows={pg.slice}
            options={STATUS_OPTIONS}
            onStatus={(num, st) =>
              updateStatus.mutate({ num, st: st as PreorderStatusKey })
            }
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
