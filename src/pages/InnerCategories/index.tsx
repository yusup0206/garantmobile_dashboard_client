import { useState } from "react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { Plus, Edit2, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

import {
  useInnerCategories,
  useCreateInnerCategory,
  useUpdateInnerCategory,
  useDeleteInnerCategory,
} from "@/services/innerCategories/useInnerCategories";
import type {
  InnerCategory,
  InnerCategoryInput,
} from "@/services/innerCategories/innerCategories.types";
import { InnerCategoryDialog } from "./ui/InnerCategoryDialog";

const PAGE_SIZE = 10;

export default function InnerCategoriesPage() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useInnerCategories({
    page,
    pageSize: PAGE_SIZE,
    search: search.trim() || undefined,
  });

  const createCategory = useCreateInnerCategory();
  const updateCategory = useUpdateInnerCategory();
  const deleteCategory = useDeleteInnerCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InnerCategory | null>(null);
  const [deleting, setDeleting] = useState<InnerCategory | null>(null);

  const items = data?.innerCategories ?? [];
  const total = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(category: InnerCategory) {
    setEditing(category);
    setFormOpen(true);
  }

  function submitForm(values: InnerCategoryInput) {
    if (editing) {
      updateCategory.mutate(
        { id: editing.id, input: values, lang },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createCategory.mutate(
        { input: values, lang },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteCategory.mutate(
      { id: deleting.id, lang },
      { onSuccess: () => setDeleting(null) },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.innerCategories.title")}
        subtitle={t("page.innerCategories.subtitle")}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            {t("common.add")}
          </Button>
        }
      />

      {/* Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder={t("common.search")}
          className="w-full sm:max-w-md"
        />
      </Card>

      {/* Content */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState title={t("innerCategories.empty")} />
      ) : (
        <>
          <Table className="min-w-[650px]" containerClassName="rounded-2xl border border-line bg-surface">
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-1/3">{t("innerCategories.col.name")}</Table.Head>
                <Table.Head>{t("innerCategories.col.specs")}</Table.Head>
                <Table.Head className="text-right">{t("common.actions")}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((cat) => (
                <Table.Row key={cat.id}>
                  <Table.Cell className="font-semibold text-ink">
                    {cat.name}
                  </Table.Cell>
                  <Table.Cell>
                    {cat.categorySpecs && cat.categorySpecs.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {cat.categorySpecs.map((s) => {
                          const specLabel =
                            lang === "tk"
                              ? s.nameTk || s.nameRu
                              : s.nameRu || s.nameTk;
                          return (
                            <Badge
                              key={s.id}
                              variant="neutral"
                              className="text-xs font-normal"
                            >
                              {specLabel}
                            </Badge>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-xs text-muted">
                        {t("innerCategories.noSpecs")}
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted hover:text-ink"
                        onClick={() => openEdit(cat)}
                        title={t("common.edit")}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted hover:text-red-500"
                        onClick={() => setDeleting(cat)}
                        title={t("common.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <Pagination
            page={page}
            pageCount={pageCount}
            total={total}
            pageSize={PAGE_SIZE}
            onPage={setPage}
          />
        </>
      )}

      {/* Modal Dialog */}
      <InnerCategoryDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        onSubmit={submitForm}
        pending={createCategory.isPending || updateCategory.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={t("innerCategories.confirm.deleteTitle")}
        description={
          deleting
            ? `«${deleting.name}» ${t("common.deleteWarnF")}`
            : t("innerCategories.confirm.deleteDesc")
        }
        confirmLabel={t("common.delete")}
        onConfirm={confirmDelete}
        pending={deleteCategory.isPending}
        danger
      />
    </div>
  );
}
