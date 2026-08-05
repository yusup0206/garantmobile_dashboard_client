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
import { useDelivery, useUpdateShipmentStatus } from "@/services/delivery/useDelivery";
import type { DeliveryStatusKey } from "@/services/delivery/delivery.types";

import { DeliveryTable } from "./ui/DeliveryTable";
import { toRow, FILTER_TABS, STATUS_OPTIONS } from "./lib/delivery.helpers";

export default function DeliveryPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useDelivery();
  const updateStatus = useUpdateShipmentStatus();
  // URL state: /delivery?status=transit — shareable & survives refresh.
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
        title={t("page.delivery.title")}
        subtitle={t("page.delivery.subtitle")}
        action={<FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("delivery.empty")} />
      ) : (
        <>
          <DeliveryTable
            rows={pg.slice}
            options={STATUS_OPTIONS}
            onStatus={(id, st) =>
              updateStatus.mutate({ id, st: st as DeliveryStatusKey })
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
