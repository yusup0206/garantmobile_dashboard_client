import { useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { useCustomers } from "@/services/customers/useCustomers";
import type { Customer } from "@/services/customers/customers.types";

import { CustomersSearch } from "./ui/CustomersSearch";
import { CustomersTable } from "./ui/CustomersTable";
import { AdjustBonusDialog } from "./ui/AdjustBonusDialog";
import { toRow, matches } from "./lib/customers.helpers";

export default function CustomersPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useCustomers();
  const [adjusting, setAdjusting] = useState<Customer | null>(null);

  // URL state: /customers?q=айна — shareable & survives refresh.
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";

  const rows = useMemo(
    () => (data ?? []).filter((c) => matches(c, query)).map(toRow),
    [data, query],
  );

  function setQuery(value: string) {
    setParams(value.trim() ? { q: value } : {}, { replace: true });
  }

  return (
    <div>
      <PageHeader
        title={t("page.customers.title")}
        subtitle={t("page.customers.subtitle")}
        action={<CustomersSearch value={query} onChange={setQuery} />}
      />

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
        <CustomersTable rows={rows} onAdjustBonus={setAdjusting} />
      )}

      <AdjustBonusDialog
        customer={adjusting}
        onOpenChange={(open) => !open && setAdjusting(null)}
      />
    </div>
  );
}
