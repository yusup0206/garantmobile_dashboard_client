import { useMemo, useState } from "react";
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
import { usePagination } from "@/lib/usePagination";
import {
  usePromocodes,
  useCreatePromocode,
  useUpdatePromocode,
  useDeletePromocode,
} from "@/services/promocodes/usePromocodes";
import type { Promocode, PromocodeInput } from "@/services/promocodes/promocodes.types";

import { PromocodesTable } from "./ui/PromocodesTable";
import { PromocodeFormDialog } from "./ui/PromocodeFormDialog";
import { toRow, FILTER_TABS } from "./lib/promocodes.helpers";

export default function PromocodesPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = usePromocodes();
  const createPromocode = useCreatePromocode();
  const updatePromocode = useUpdatePromocode();
  const deletePromocode = useDeletePromocode();

  // URL state: /promocodes?status=active — shareable & survives refresh.
  const [params, setParams] = useSearchParams();
  const filter = params.get("status") ?? "all";

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Promocode | null>(null);
  const [deleting, setDeleting] = useState<Promocode | null>(null);

  const rows = useMemo(() => {
    const all = (data ?? []).map(toRow);
    return filter === "all" ? all : all.filter((r) => r.st === filter);
  }, [data, filter]);

  const pg = usePagination(rows, 8, filter);

  function setFilter(key: string) {
    setParams(key === "all" ? {} : { status: key }, { replace: true });
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
        { code: editing.code, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createPromocode.mutate(values, { onSuccess: () => setFormOpen(false) });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deletePromocode.mutate(deleting.code, { onSuccess: () => setDeleting(null) });
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
          <PromocodesTable rows={pg.slice} onEdit={openEdit} onDelete={setDeleting} />
          <Pagination
            page={pg.page}
            pageCount={pg.pageCount}
            total={pg.total}
            pageSize={pg.pageSize}
            onPage={pg.setPage}
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
