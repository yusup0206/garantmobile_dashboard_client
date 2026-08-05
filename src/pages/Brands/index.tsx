import { useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import {
  useBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from "@/services/brands/useBrands";
import type { Brand, BrandInput } from "@/services/brands/brands.types";

import { BrandCard } from "./ui/BrandCard";
import { BrandFormDialog } from "./ui/BrandFormDialog";
import { toView } from "./lib/brands.helpers";

export default function BrandsPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [deleting, setDeleting] = useState<Brand | null>(null);

  const brands = useMemo(() => (data ?? []).map(toView), [data]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(brand: Brand) {
    setEditing(brand);
    setFormOpen(true);
  }

  function submitForm(values: BrandInput) {
    if (editing) {
      updateBrand.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createBrand.mutate(values, { onSuccess: () => setFormOpen(false) });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteBrand.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  }

  return (
    <div>
      <PageHeader
        title={t("page.brands.title")}
        subtitle={t("page.brands.subtitle")}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            {t("common.add")}
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : brands.length === 0 ? (
        <EmptyState title={t("brands.empty")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <BrandFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        brand={editing}
        onSubmit={submitForm}
        pending={createBrand.isPending || updateBrand.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t("brands.confirm.title")}
        description={
          deleting
            ? `«${deleting.name}» ${t("common.deleteWarnM")}`
            : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deleteBrand.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
