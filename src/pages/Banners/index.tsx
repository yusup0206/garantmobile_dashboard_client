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
  useBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from "@/services/banners/useBanners";
import type { Banner, BannerInput } from "@/services/banners/banners.types";

import { BannersTable } from "./ui/BannersTable";
import { BannerFormDialog } from "./ui/BannerFormDialog";
import { toRow, FILTER_TABS, type BannerRow } from "./lib/banners.helpers";

export default function BannersPage() {
  const t = useT();
  const [params, setParams] = useSearchParams();
  const filter = params.get("status") ?? "all";
  const search = params.get("search") ?? "";

  const { data, isLoading, isError, refetch } = useBanners({
    search: search.trim() || undefined,
  });
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [deleting, setDeleting] = useState<BannerRow | null>(null);

  const rows = useMemo(() => {
    const list = Array.isArray(data)
      ? data
      : (data?.banners ?? []);
    let all = list.map(toRow);
    if (filter === "active") all = all.filter((r) => r.isActive);
    if (filter === "inactive") all = all.filter((r) => !r.isActive);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      all = all.filter(
        (r) =>
          r.displayTitle.toLowerCase().includes(q) ||
          r.displaySubtitle.toLowerCase().includes(q),
      );
    }
    return all;
  }, [data, filter, search]);

  const pg = usePagination(rows, 10, `${filter}-${search}`);

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

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(row: BannerRow) {
    setEditing(row);
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
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            {t("common.add")}
          </Button>
        }
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
            ? `«${deleting.displayTitle}» ${t("common.deleteWarnM")}`
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
