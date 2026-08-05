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
  useDrivers,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
} from "@/services/drivers/useDrivers";
import type { Driver, DriverInput } from "@/services/drivers/drivers.types";

import { DriversTable } from "./ui/DriversTable";
import { DriverFormDialog } from "./ui/DriverFormDialog";
import { toRow, FILTER_TABS } from "./lib/drivers.helpers";

export default function DriversPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useDrivers();
  const createDriver = useCreateDriver();
  const updateDriver = useUpdateDriver();
  const deleteDriver = useDeleteDriver();

  // URL state: /drivers?status=busy — shareable & survives refresh.
  const [params, setParams] = useSearchParams();
  const filter = params.get("status") ?? "all";

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [deleting, setDeleting] = useState<Driver | null>(null);

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

  function openEdit(driver: Driver) {
    setEditing(driver);
    setFormOpen(true);
  }

  function submitForm(values: DriverInput) {
    if (editing) {
      updateDriver.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createDriver.mutate(values, { onSuccess: () => setFormOpen(false) });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteDriver.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  }

  return (
    <div>
      <PageHeader
        title={t("page.drivers.title")}
        subtitle={t("page.drivers.subtitle")}
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
        <EmptyState title={t("drivers.empty")} />
      ) : (
        <>
          <DriversTable rows={pg.slice} onEdit={openEdit} onDelete={setDeleting} />
          <Pagination
            page={pg.page}
            pageCount={pg.pageCount}
            total={pg.total}
            pageSize={pg.pageSize}
            onPage={pg.setPage}
          />
        </>
      )}

      <DriverFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        driver={editing}
        onSubmit={submitForm}
        pending={createDriver.isPending || updateDriver.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t("drivers.confirm.title")}
        description={
          deleting
            ? `«${deleting.name}» ${t("common.deleteWarnM")}`
            : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deleteDriver.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
