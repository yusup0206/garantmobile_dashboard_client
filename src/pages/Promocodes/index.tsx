import { useState } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs } from "@/components/common/FilterTabs";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/Button";
import {
  usePromocodes,
  useCreatePromocode,
  useUpdatePromocode,
  useDeletePromocode,
} from "@/services/promocodes/usePromocodes";
import type { Promocode, PromocodeInput } from "@/services/promocodes/promocodes.types";

import { PromocodesTable } from "./ui/PromocodesTable";
import { PromocodeFormDialog } from "./ui/PromocodeFormDialog";
import { toRow, FILTER_TABS, type PromoStatusKey } from "./lib/promocodes.helpers";

const PAGE_SIZE = 20;

export default function PromocodesPage() {
  const t = useT();

  // URL state: /promocodes?status=active — shareable & survives refresh.
  const [params, setParams] = useSearchParams();
  const filter = (params.get("status") ?? "all") as "all" | PromoStatusKey;
  const page = Number(params.get("page") ?? "1");

  // Build query params for the API
  const queryParams = {
    page,
    pageSize: PAGE_SIZE,
    ...(filter !== "all"
      ? filter === "inactive"
        ? { isActive: false }
        : filter === "active"
          ? { isActive: true }
          : {}
      : {}),
  };

  const { data, isLoading, isError, refetch } = usePromocodes(queryParams);
  const createPromocode = useCreatePromocode();
  const updatePromocode = useUpdatePromocode();
  const deletePromocode = useDeletePromocode();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Promocode | null>(null);
  const [deleting, setDeleting] = useState<Promocode | null>(null);

  const rows = (data?.promocodes ?? []).map(toRow);
  const totalCount = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function setFilter(key: string) {
    setParams(
      key === "all" ? {} : { status: key },
      { replace: true },
    );
  }

  function setPage(p: number) {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next, { replace: true });
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(promocode: Promocode) {
    setEditing(promocode);
    setFormOpen(true);
  }

  function submitForm(values: PromocodeInput) {
    if (editing) {
      updatePromocode.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createPromocode.mutate(values, { onSuccess: () => setFormOpen(false) });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deletePromocode.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  }

  return (
    <div>
      <PageHeader
        title={t("page.promocodes.title")}
        subtitle={t("page.promocodes.subtitle")}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4" />
              {t("common.add")}
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("promocodes.empty")} />
      ) : (
        <>
          <PromocodesTable rows={rows} onEdit={openEdit} onDelete={setDeleting} />
          <Pagination
            page={page}
            pageCount={pageCount}
            total={totalCount}
            pageSize={PAGE_SIZE}
            onPage={setPage}
          />
        </>
      )}

      <PromocodeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        promocode={editing}
        onSubmit={submitForm}
        pending={createPromocode.isPending || updatePromocode.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t("promocodes.confirm.title")}
        description={
          deleting
            ? `«${deleting.code}» ${t("common.deleteWarnM")}`
            : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deletePromocode.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
