import { useState } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs } from "@/components/common/FilterTabs";
import { SearchInput } from "@/components/common/SearchInput";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import {
  useTradein,
  useUpdateTradeinStatus,
  useDeleteTradein,
} from "@/services/tradein/useTradein";
import type {
  TradeinStatusKey,
  TradeinConditionKey,
} from "@/services/tradein/tradein.types";

import { TradeinTable } from "./ui/TradeinTable";
import {
  toRow,
  FILTER_TABS,
  STATUS_OPTIONS,
  CONDITION_OPTIONS,
  type TradeinRow,
} from "./lib/tradein.helpers";

const PAGE_SIZE = 20;

export default function TradeinPage() {
  const t = useT();

  // URL state: /tradein?status=new&condition=all&page=1&search=...
  const [params, setParams] = useSearchParams();
  const statusFilter = (params.get("status") ?? "all") as "all" | TradeinStatusKey;
  const conditionFilter = (params.get("condition") ?? "all") as
    "all" | TradeinConditionKey;
  const search = params.get("search") ?? "";
  const page = Number(params.get("page") ?? "1");

  // Query params for API
  const queryParams = {
    page,
    pageSize: PAGE_SIZE,
    ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    ...(conditionFilter !== "all" ? { condition: conditionFilter } : {}),
    ...(search.trim() ? { search: search.trim() } : {}),
  };

  const { data, isLoading, isError, refetch } = useTradein(queryParams);
  const updateStatus = useUpdateTradeinStatus();
  const deleteTradein = useDeleteTradein();

  const [deleting, setDeleting] = useState<TradeinRow | null>(null);

  const rawList = Array.isArray(data) ? data : (data?.tradeIn ?? []);
  const rows = rawList.map(toRow);
  const totalCount =
    !Array.isArray(data) && data?.count !== undefined ? data.count : rows.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function updateUrlParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([k, v]) => {
      if (!v || v === "all") {
        next.delete(k);
      } else {
        next.set(k, v);
      }
    });
    // Reset page to 1 when changing filters or search
    if (!("page" in updates)) {
      next.delete("page");
    }
    setParams(next, { replace: true });
  }

  function setStatusFilter(key: string) {
    updateUrlParams({ status: key });
  }

  function setConditionFilter(key: string) {
    updateUrlParams({ condition: key });
  }

  function setSearch(value: string) {
    updateUrlParams({ search: value });
  }

  function setPage(p: number) {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next, { replace: true });
  }

  function handleStatusChange(id: string, status: string) {
    updateStatus.mutate({ id, status: status as TradeinStatusKey });
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteTradein.mutate(deleting.id, {
      onSuccess: () => setDeleting(null),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t("page.tradein.title")} subtitle={t("page.tradein.subtitle")} />

      {/* Filter and Search Bar — inside Card */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <FilterTabs
            tabs={FILTER_TABS}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          {/* Condition select filter */}
          <div className="w-full sm:w-44">
            <Select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value as "all" | TradeinConditionKey)}
              className="h-10 rounded-xl text-sm"
            >
              {CONDITION_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {t(c.labelKey)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("tradein.searchPlaceholder")}
        />
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("tradein.empty")} />
      ) : (
        <>
          <TradeinTable
            rows={rows}
            options={STATUS_OPTIONS}
            onStatus={handleStatusChange}
            onDelete={setDeleting}
          />
          <Pagination
            page={page}
            pageCount={pageCount}
            total={totalCount}
            pageSize={PAGE_SIZE}
            onPage={setPage}
          />
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t("tradein.confirm.deleteTitle")}
        description={
          deleting
            ? `${deleting.displayDevice} (${deleting.displayCustomer}) — ${t("tradein.confirm.deleteDesc")}`
            : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deleteTradein.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
