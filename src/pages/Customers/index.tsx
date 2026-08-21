import { useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs } from "@/components/common/FilterTabs";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { usePagination } from "@/lib/usePagination";
import { useCustomers, useBlockCustomer } from "@/services/customers/useCustomers";
import type { Customer, CustomerFilterType } from "@/services/customers/customers.types";

import { CustomersSearch } from "./ui/CustomersSearch";
import { CustomersTable } from "./ui/CustomersTable";
import { toRow, matches, FILTER_TABS, type CustomerRow } from "./lib/customers.helpers";

export default function CustomersPage() {
  const t = useT();

  // URL state: /customers?q=айна&filter=createdDate
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const filter = params.get("filter") ?? "all";

  const { data, isLoading, isError, refetch } = useCustomers({
    search: query.trim() || undefined,
    filterType: filter === "all" ? undefined : (filter as CustomerFilterType),
  });

  const blockCustomerMutation = useBlockCustomer();
  const [blockingTarget, setBlockingTarget] = useState<CustomerRow | null>(null);

  const rows = useMemo(() => {
    const list: Customer[] = Array.isArray(data) ? data : (data?.customers ?? []);
    return list.filter((c) => matches(c, query)).map(toRow);
  }, [data, query]);

  const pg = usePagination(rows, 10, `${filter}-${query}`);

  function setQuery(value: string) {
    const next: Record<string, string> = {};
    if (value.trim()) next.q = value;
    if (filter !== "all") next.filter = filter;
    setParams(next, { replace: true });
  }

  function setFilter(key: string) {
    const next: Record<string, string> = {};
    if (query.trim()) next.q = query;
    if (key !== "all") next.filter = key;
    setParams(next, { replace: true });
  }

  function confirmToggleBlock() {
    if (!blockingTarget) return;
    blockCustomerMutation.mutate(blockingTarget.id, {
      onSuccess: () => setBlockingTarget(null),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.customers.title")}
        subtitle={t("page.customers.subtitle")}
        action={<CustomersSearch value={query} onChange={setQuery} />}
      />

      <FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={t("customers.empty")}
          hint={query ? t("customers.emptyHint") : undefined}
        />
      ) : (
        <>
          <CustomersTable rows={pg.slice} onToggleBlock={setBlockingTarget} />
          <Pagination
            page={pg.page}
            pageCount={pg.pageCount}
            total={pg.total}
            pageSize={pg.pageSize}
            onPage={pg.setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={blockingTarget !== null}
        onOpenChange={(open) => !open && setBlockingTarget(null)}
        title={
          blockingTarget?.isBlocked
            ? t("cust.confirm.unblockTitle")
            : t("cust.confirm.blockTitle")
        }
        description={
          blockingTarget?.isBlocked
            ? t("cust.confirm.unblockDesc")
            : t("cust.confirm.blockDesc")
        }
        confirmLabel={
          blockingTarget?.isBlocked
            ? t("cust.action.unblock")
            : t("cust.action.block")
        }
        danger={!blockingTarget?.isBlocked}
        pending={blockCustomerMutation.isPending}
        onConfirm={confirmToggleBlock}
      />
    </div>
  );
}
