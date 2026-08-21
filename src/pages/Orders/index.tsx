import { useState, useMemo } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs } from "@/components/common/FilterTabs";
import { SearchInput } from "@/components/common/SearchInput";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { Card } from "@/components/ui/Card";
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

  // URL state: /orders?status=pending&search=... — shareable & survives refresh.
  const [params, setParams] = useSearchParams();
  const filter = params.get("status") ?? "all";
  const search = params.get("search") ?? "";

  const rows = useMemo(() => {
    const list: Order[] = Array.isArray(data) ? data : (data?.orders ?? []);
    let all = list.map((o) => toRow(o));
    if (filter !== "all") {
      all = all.filter((r) => r.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      all = all.filter(
        (r) =>
          r.orderNumber.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q),
      );
    }
    return all;
  }, [data, filter, search]);

  const pg = usePagination(rows, 8, `${filter}-${search}`);

  function setFilter(key: string) {
    const next = new URLSearchParams(params);
    if (key === "all") next.delete("status");
    else next.set("status", key);
    setParams(next, { replace: true });
  }

  function setSearch(value: string) {
    const next = new URLSearchParams(params);
    if (!value.trim()) next.delete("search");
    else next.set("search", value);
    setParams(next, { replace: true });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.orders.title")}
        subtitle={t("page.orders.subtitle")}
      />

      {/* Unified Filter & Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("common.search")}
        />
      </Card>

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
