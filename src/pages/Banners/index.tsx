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
  useBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from "@/services/banners/useBanners";
import type { Banner, BannerInput } from "@/services/banners/banners.types";

import { BannersTable } from "./ui/BannersTable";
import { BannerFormDialog } from "./ui/BannerFormDialog";
import { toRow, FILTER_TABS } from "./lib/banners.helpers";

export default function BannersPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  // URL state: /banners?status=active — shareable & survives refresh.
  const [params, setParams] = useSearchParams();
  const filter = params.get("status") ?? "all";

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [deleting, setDeleting] = useState<Banner | null>(null);

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

  function openEdit(banner: Banner) {
    setEditing(banner);
    setFormOpen(true);
  }

  function submitForm(values: BannerInput) {
    if (editing) {
      updateBanner.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createBanner.mutate(values, { onSuccess: () => setFormOpen(false) });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteBanner.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.banners.title")}
        subtitle={t("page.banners.subtitle")}
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
        <EmptyState title={t("banners.empty")} />
      ) : (
        <>
          <BannersTable rows={pg.slice} onEdit={openEdit} onDelete={setDeleting} />
          <Pagination
            page={pg.page}
            pageCount={pg.pageCount}
            total={pg.total}
            pageSize={pg.pageSize}
            onPage={pg.setPage}
          />
        </>
      )}

      <BannerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        banner={editing}
        onSubmit={submitForm}
        pending={createBanner.isPending || updateBanner.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t("banners.confirm.title")}
        description={
          deleting
            ? `«${deleting.title.ru || deleting.to}» ${t("common.deleteWarnM")}`
            : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deleteBanner.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
