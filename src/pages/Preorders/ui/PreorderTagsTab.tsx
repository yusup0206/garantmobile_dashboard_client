import { useState } from "react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { Plus, Edit2, Trash2 } from "lucide-react";

import { SearchInput } from "@/components/common/SearchInput";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";

import {
  usePreorderTags,
  useCreatePreorderTag,
  useUpdatePreorderTag,
  useDeletePreorderTag,
} from "@/services/preorders/usePreorders";
import type { PreorderTag, PreorderTagInput } from "@/services/preorders/preorders.types";
import { PreorderTagDialog } from "./PreorderTagDialog";

const PAGE_SIZE = 10;

export function PreorderTagsTab() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = usePreorderTags({
    page,
    pageSize: PAGE_SIZE,
    search: search.trim() || undefined,
  });

  const createTag = useCreatePreorderTag();
  const updateTag = useUpdatePreorderTag();
  const deleteTag = useDeletePreorderTag();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PreorderTag | null>(null);
  const [deleting, setDeleting] = useState<PreorderTag | null>(null);

  const tags = data?.preorderTags ?? [];
  const total = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(tag: PreorderTag) {
    setEditing(tag);
    setFormOpen(true);
  }

  function submitForm(values: PreorderTagInput) {
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
    <div className="flex flex-col gap-6">
      {/* Search & Actions Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder={t("common.search")}
        />
        <Button size="sm" onClick={openAdd} className="w-full sm:w-auto shrink-0">
          <Plus className="h-4 w-4" />
          {t("preorders.tags.add")}
        </Button>
      </Card>

      {/* Content */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : tags.length === 0 ? (
        <EmptyState title={t("preorders.tags.empty")} />
      ) : (
        <>
          <Table className="min-w-[500px]" containerClassName="rounded-2xl border border-line bg-surface">
            <Table.Header>
              <Table.Row>
                <Table.Head>{t("preorders.tags.col.name")}</Table.Head>
                <Table.Head className="text-right">{t("common.actions")}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tags.map((tag) => {
                const tagName = lang === "tk" ? tag.nameTk || tag.nameRu : tag.nameRu || tag.nameTk;
                return (
                  <Table.Row key={tag.id}>
                    <Table.Cell className="font-semibold text-ink">
                      {tagName}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted hover:text-ink"
                          onClick={() => openEdit(tag)}
                          title={t("common.edit")}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted hover:text-red-500"
                          onClick={() => setDeleting(tag)}
                          title={t("common.delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
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

      {/* Form Dialog */}
      <PreorderTagDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        tag={editing}
        onSubmit={submitForm}
        pending={createTag.isPending || updateTag.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={t("preorders.tags.confirm.deleteTitle")}
        description={t("preorders.tags.confirm.deleteDesc")}
        confirmLabel={t("common.delete")}
        onConfirm={confirmDelete}
        pending={deleteTag.isPending}
        danger
      />
    </div>
  );
}
