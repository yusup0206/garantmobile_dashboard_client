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
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/services/categories/useCategories";
import type { Category, CategoryInput } from "@/services/categories/categories.types";

import { CategoryCard } from "./ui/CategoryCard";
import { CategoryFormDialog } from "./ui/CategoryFormDialog";
import { toView } from "./lib/categories.helpers";

export default function CategoriesPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const cards = useMemo(() => (data ?? []).map(toView), [data]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setFormOpen(true);
  }

  function submitForm(values: CategoryInput) {
    if (editing) {
      updateCategory.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createCategory.mutate(values, { onSuccess: () => setFormOpen(false) });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteCategory.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  }

  return (
    <div>
      <PageHeader
        title={t("page.categories.title")}
        subtitle={t("page.categories.subtitle")}
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
      ) : cards.length === 0 ? (
        <EmptyState title={t("categories.empty")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        onSubmit={submitForm}
        pending={createCategory.isPending || updateCategory.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t("categories.confirm.title")}
        description={
          deleting
            ? `«${deleting.name}» ${t("common.deleteWarnF")}`
            : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deleteCategory.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
