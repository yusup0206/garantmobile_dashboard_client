import { useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs } from "@/components/common/FilterTabs";
import { SearchInput } from "@/components/common/SearchInput";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { usePagination } from "@/lib/usePagination";
import {
  useDelivery,
  useCreateDeliveryType,
  useUpdateDeliveryType,
  useDeleteDeliveryType,
} from "@/services/delivery/useDelivery";
import type { DeliveryType, DeliveryTypeInput } from "@/services/delivery/delivery.types";

import { DeliveryTable } from "./ui/DeliveryTable";
import { DeliveryFormDialog } from "./ui/DeliveryFormDialog";
import { toRow, FILTER_TABS } from "./lib/delivery.helpers";

export default function DeliveryPage() {
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

  const { data, isLoading, isError, refetch } = useDelivery(queryParams);
  const createDelivery = useCreateDeliveryType();
  const updateDelivery = useUpdateDeliveryType();
  const deleteDelivery = useDeleteDeliveryType();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DeliveryType | null>(null);
  const [deleting, setDeleting] = useState<DeliveryType | null>(null);

  const deliveryTypes = useMemo(() => data?.deliveryTypes ?? [], [data?.deliveryTypes]);

  const rows = useMemo(() => {
    return deliveryTypes.map(toRow);
  }, [deliveryTypes]);

  const pg = usePagination(rows, 8, filter);

  function setFilter(key: string) {
    setParams(key === "all" ? {} : { status: key }, { replace: true });
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(dt: DeliveryType) {
    setEditing(dt);
    setFormOpen(true);
  }

  function submitForm(values: DeliveryTypeInput) {
    if (editing) {
      updateDelivery.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createDelivery.mutate({ input: values }, { onSuccess: () => setFormOpen(false) });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteDelivery.mutate({ id: deleting.id }, { onSuccess: () => setDeleting(null) });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("page.delivery.title")}
        subtitle={t("page.delivery.subtitle")}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" />
            {t("common.add")}
          </Button>
        }
      />

      {/* Standard filter controls card */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />

        <SearchInput
          placeholder="Поиск способов доставки…"
          value={search}
          onChange={setSearch}
        />
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("delivery.empty")} />
      ) : (
        <>
          <DeliveryTable rows={pg.slice} onEdit={openEdit} onDelete={setDeleting} />
          <Pagination
            page={pg.page}
            pageCount={pg.pageCount}
            total={pg.total}
            pageSize={pg.pageSize}
            onPage={pg.setPage}
          />
        </>
      )}

      <DeliveryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        deliveryType={editing}
        onSubmit={submitForm}
        pending={createDelivery.isPending || updateDelivery.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Удалить способ доставки?"
        description={
          deleting
            ? `«${deleting.titleRu || deleting.titleTk}» ${t("common.deleteWarnM")}`
            : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deleteDelivery.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
