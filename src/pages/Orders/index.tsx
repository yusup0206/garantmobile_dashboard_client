import { useState, useMemo } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs } from "@/components/common/FilterTabs";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { useOrders, useUpdateOrderStatus } from "@/services/orders/useOrders";
import type { Order, OrderStatusKey } from "@/services/orders/orders.types";
import { usePagination } from "@/lib/usePagination";

import { OrdersTable } from "./ui/OrdersTable";
import { OrderDetailDialog } from "./ui/OrderDetailDialog";
import { toRow, FILTER_TABS, STATUS_OPTIONS, type OrderRow } from "./lib/orders.helpers";

export default function OrdersPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

  // URL state: /orders?status=pending — shareable & survives refresh.
  const [params, setParams] = useSearchParams();
  const filter = params.get("status") ?? "all";

  const rows = useMemo(() => {
    const list: Order[] = Array.isArray(data) ? data : (data?.orders ?? []);
    const all = list.map((o) => toRow(o));
    return filter === "all" ? all : all.filter((r) => r.status === filter);
  }, [data, filter]);

  const pg = usePagination(rows, 8, filter);

  function setFilter(key: string) {
    setParams(key === "all" ? {} : { status: key }, { replace: true });
  }

  return (
    <div>
      <PageHeader
        title={t("page.orders.title")}
        subtitle={t("page.orders.subtitle")}
        action={<FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />}
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("orders.empty")} />
      ) : (
        <>
          <OrdersTable
            rows={pg.slice}
            options={STATUS_OPTIONS}
            onStatus={(id, st) => updateStatus.mutate({ id, status: st as OrderStatusKey })}
            onViewDetails={(order) => setSelectedOrder(order)}
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

      <OrderDetailDialog
        order={selectedOrder}
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
        options={STATUS_OPTIONS}
        onStatusChange={(id, st) => updateStatus.mutate({ id, status: st })}
      />
    </div>
  );
}
