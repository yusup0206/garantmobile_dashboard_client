import { useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { Plus, Search, Tag as TagIcon, Pencil, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import {
  useTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from "@/services/tags/useTags";
import { useBrands } from "@/services/brands/useBrands";
import type { Tag, TagInput } from "@/services/tags/tags.types";
import { TagFormDialog } from "./ui/TagFormDialog";

export default function TagsPage() {
  const t = useT();
  const [search, setSearch] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");

  const queryParams = useMemo(() => {
    const p: { search?: string; brandId?: string } = {};
    if (search.trim()) p.search = search.trim();
    if (selectedBrandId) p.brandId = selectedBrandId;
    return p;
  }, [search, selectedBrandId]);

  const { data, isLoading, isError, refetch } = useTags(queryParams);
  const { data: brandsData } = useBrands();
  const brands = brandsData?.brands ?? [];

  const brandMap = useMemo(() => {
    const map = new Map<string, string>();
    brands.forEach((b) => map.set(b.id, b.name));
    return map;
  }, [brands]);

  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState<Tag | null>(null);

  const tagsList = useMemo(() => data?.tags ?? [], [data?.tags]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(tag: Tag) {
    setEditing(tag);
    setFormOpen(true);
  }

  function submitForm(values: TagInput) {
    if (editing) {
      updateTag.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createTag.mutate(
        { input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteTag.mutate(
      { id: deleting.id },
      { onSuccess: () => setDeleting(null) },
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Теги"
        subtitle="Управление тегами для товаров и публикаций блога"
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" />
            {t("common.add")}
          </Button>
        }
      />

      {/* Standard filter controls card */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted font-medium text-sm shrink-0">
          <Search className="h-4 w-4" />
          <span>Gözleg we Filter:</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Поиск по названию…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 text-sm"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className="h-10 text-sm"
            >
              <option value="">— Все бренды —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : tagsList.length === 0 ? (
        <EmptyState title="Теги не найдены" />
      ) : (
        <Table containerClassName="rounded-2xl border border-line bg-surface">
          <Table.Header>
            <Table.Row>
              <Table.Head>Название (RU)</Table.Head>
              <Table.Head>Название (TK)</Table.Head>
              <Table.Head>Бренд</Table.Head>
              <Table.Head className="text-right">{t("common.actions")}</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tagsList.map((tag) => (
              <Table.Row key={tag.id}>
                <Table.Cell className="font-display font-bold text-ink">
                  <span className="inline-flex items-center gap-1.5">
                    <TagIcon className="h-4 w-4 text-brand" />
                    {tag.nameRu}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-ink font-medium">{tag.nameTk}</Table.Cell>
                <Table.Cell className="text-muted">
                  {tag.brandId && brandMap.has(tag.brandId) ? (
                    <span className="inline-flex items-center rounded-md bg-canvas px-2.5 py-1 text-xs border border-line/60 font-semibold text-ink">
                      {brandMap.get(tag.brandId)}
                    </span>
                  ) : (
                    "—"
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(tag)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
                      aria-label={"Редактировать " + tag.nameRu}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(tag)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={"Удалить " + tag.nameRu}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <TagFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        tag={editing}
        onSubmit={submitForm}
        pending={createTag.isPending || updateTag.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Удалить тег?"
        description={
          deleting
            ? `Вы действительно хотите удалить тег «${deleting.nameRu}»?`
            : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deleteTag.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
