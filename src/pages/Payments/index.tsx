import { useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs } from "@/components/common/FilterTabs";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { usePagination } from "@/lib/usePagination";
import {
  usePayments,
  useCreatePaymentType,
  useUpdatePaymentType,
  useDeletePaymentType,
} from "@/services/payments/usePayments";
import type { PaymentType, PaymentTypeInput } from "@/services/payments/payments.types";

import { PaymentsTable } from "./ui/PaymentsTable";
import { PaymentFormDialog } from "./ui/PaymentFormDialog";
import { toRow, FILTER_TABS } from "./lib/payments.helpers";

export default function PaymentsPage() {
  const t = useT();
  const [params, setParams] = useSearchParams();
  const filter = params.get("status") ?? "all";
  const [search, setSearch] = useState("");

  const queryParams = useMemo(() => {
    const p: { search?: string; isActive?: boolean } = {};
    if (search.trim()) p.search = search.trim();
    if (filter === "active") p.isActive = true;
    if (filter === "inactive") p.isActive = false;
    return p;
  }, [filter, search]);

  const { data, isLoading, isError, refetch } = usePayments(queryParams);
  const createPayment = useCreatePaymentType();
  const updatePayment = useUpdatePaymentType();
  const deletePayment = useDeletePaymentType();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentType | null>(null);
  const [deleting, setDeleting] = useState<PaymentType | null>(null);

  const paymentTypes = useMemo(() => data?.paymentTypes ?? [], [data?.paymentTypes]);

  const rows = useMemo(() => {
    return paymentTypes.map(toRow);
  }, [paymentTypes]);

  const pg = usePagination(rows, 8, filter);

  function setFilter(key: string) {
    setParams(key === "all" ? {} : { status: key }, { replace: true });
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(pt: PaymentType) {
    setEditing(pt);
    setFormOpen(true);
  }

  function submitForm(values: PaymentTypeInput) {
    if (editing) {
      updatePayment.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createPayment.mutate(
        { input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deletePayment.mutate(
      { id: deleting.id },
      { onSuccess: () => setDeleting(null) },
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("page.payments.title")}
        subtitle={t("page.payments.subtitle")}
        action={
          <div className="flex items-center gap-3">
            <FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />
            <Button size="sm" onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" />
              {t("common.add")}
            </Button>
          </div>
        }
      />

      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted font-medium text-sm shrink-0">
          <Search className="h-4 w-4" />
          <span>Gözleg:</span>
        </div>
        <div className="w-full sm:w-72">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию…"
            className="h-10 text-sm"
          />
        </div>
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("payments.empty")} />
      ) : (
        <>
          <PaymentsTable rows={pg.slice} onEdit={openEdit} onDelete={setDeleting} />
          <Pagination
            page={pg.page}
            pageCount={pg.pageCount}
            total={pg.total}
            pageSize={pg.pageSize}
            onPage={pg.setPage}
          />
        </>
      )}

      <PaymentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        paymentType={editing}
        onSubmit={submitForm}
        pending={createPayment.isPending || updatePayment.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Удалить способ оплаты?"
        description={
          deleting ? `«${deleting.titleRu || deleting.titleTk}» ${t("common.deleteWarnM")}` : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deletePayment.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
