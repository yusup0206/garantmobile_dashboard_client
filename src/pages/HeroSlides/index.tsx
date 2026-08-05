import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useT } from "@/i18n/useT";
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
  useHeroSlides,
  useCreateHeroSlide,
  useUpdateHeroSlide,
  useDeleteHeroSlide,
} from "@/services/heroSlides/useHeroSlides";
import type { HeroSlide, HeroSlideInput } from "@/services/heroSlides/heroSlides.types";
import { HeroSlidesTable } from "./ui/HeroSlidesTable";
import { HeroSlideFormDialog } from "./ui/HeroSlideFormDialog";
import { toRow, FILTER_TABS } from "./lib/heroSlides.helpers";

export default function HeroSlidesPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useHeroSlides();
  const createSlide = useCreateHeroSlide();
  const updateSlide = useUpdateHeroSlide();
  const deleteSlide = useDeleteHeroSlide();

  const [params, setParams] = useSearchParams();
  const filter = params.get("status") ?? "all";

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [deleting, setDeleting] = useState<HeroSlide | null>(null);

  const rows = useMemo(() => {
    const all = (data ?? []).map(toRow);
    if (filter === "on") return all.filter((r) => r.active);
    if (filter === "off") return all.filter((r) => !r.active);
    return all;
  }, [data, filter]);

  const pg = usePagination(rows, 8, filter);

  function setFilter(key: string) {
    setParams(key === "all" ? {} : { status: key }, { replace: true });
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(slide: HeroSlide) {
    setEditing(slide);
    setFormOpen(true);
  }

  function submitForm(values: HeroSlideInput) {
    if (editing) {
      updateSlide.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createSlide.mutate(values, { onSuccess: () => setFormOpen(false) });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteSlide.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.hero.title")}
        subtitle={t("page.hero.subtitle")}
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
        <EmptyState title={t("hero.empty")} />
      ) : (
        <>
          <HeroSlidesTable rows={pg.slice} onEdit={openEdit} onDelete={setDeleting} />
          <Pagination
            page={pg.page}
            pageCount={pg.pageCount}
            total={pg.total}
            pageSize={pg.pageSize}
            onPage={pg.setPage}
          />
        </>
      )}

      <HeroSlideFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        slide={editing}
        onSubmit={submitForm}
        pending={createSlide.isPending || updateSlide.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t("hero.confirm.title")}
        description={
          deleting ? `«${deleting.title.ru}» ${t("common.deleteWarnM")}` : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deleteSlide.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
