import { useState } from "react";
import { Plus } from "lucide-react";
import { useT } from "@/i18n/useT";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { useCategories } from "@/services/categories/useCategories";
import {
  useHomeBlocks,
  useCreateHomeBlock,
  useUpdateHomeBlock,
  useReorderHomeBlocks,
  useDeleteHomeBlock,
} from "@/services/home/useHome";
import type {
  HomeBlock,
  CreateHomeBlockInput,
  UpdateHomeBlockInput,
} from "@/services/home/home.types";
import { BlockList } from "./ui/BlockList";
import { BlockFormDialog } from "./ui/BlockFormDialog";

export default function HomeBuilderPage() {
  const t = useT();

  const { data, isLoading, isError, refetch } = useHomeBlocks();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.categories ?? [];

  const createBlock = useCreateHomeBlock();
  const updateBlock = useUpdateHomeBlock();
  const reorderBlocks = useReorderHomeBlocks();
  const deleteBlock = useDeleteHomeBlock();

  const [formOpen, setFormOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<HomeBlock | null>(null);
  const [deletingBlock, setDeletingBlock] = useState<HomeBlock | null>(null);

  const blocks = data?.blocks ?? [];

  function openAdd() {
    setEditingBlock(null);
    setFormOpen(true);
  }

  function openEdit(block: HomeBlock) {
    setEditingBlock(block);
    setFormOpen(true);
  }

  function handleSubmit(values: CreateHomeBlockInput | UpdateHomeBlockInput) {
    if (editingBlock) {
      updateBlock.mutate(
        { id: editingBlock.id, input: values as UpdateHomeBlockInput },
        {
          onSuccess: () => setFormOpen(false),
        },
      );
    } else {
      createBlock.mutate(values as CreateHomeBlockInput, {
        onSuccess: () => setFormOpen(false),
      });
    }
  }

  function handleMove(index: number, dir: -1 | 1) {
    const targetIndex = index + dir;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const reordered = [...blocks];
    const item = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = item;

    const blockIds = reordered.map((b) => b.id);
    reorderBlocks.mutate(blockIds);
  }

  function handleToggleStatus(block: HomeBlock) {
    const nextStatus = block.status === "active" ? "hidden" : "active";
    updateBlock.mutate({
      id: block.id,
      input: { status: nextStatus },
    });
  }

  function handleConfirmDelete() {
    if (!deletingBlock) return;
    deleteBlock.mutate(deletingBlock.id, {
      onSuccess: () => setDeletingBlock(null),
    });
  }

  const isMutating =
    createBlock.isPending ||
    updateBlock.isPending ||
    reorderBlocks.isPending ||
    deleteBlock.isPending;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.home.title")}
        subtitle={t("page.home.subtitle")}
        action={
          <Button size="sm" onClick={openAdd} disabled={isMutating}>
            <Plus className="h-4 w-4 mr-1.5" />
            {t("home.addBlock")}
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : blocks.length === 0 ? (
        <EmptyState
          title={t("common.empty")}
          subtitle={t("page.home.subtitle")}
          action={
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-1.5" />
              {t("home.addBlock")}
            </Button>
          }
        />
      ) : (
        <BlockList
          blocks={blocks}
          onMove={handleMove}
          onToggleStatus={handleToggleStatus}
          onEdit={openEdit}
          onDelete={(block) => setDeletingBlock(block)}
          isReordering={reorderBlocks.isPending}
        />
      )}

      <BlockFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        block={editingBlock}
        categories={categories}
        onSubmit={handleSubmit}
        isSaving={createBlock.isPending || updateBlock.isPending}
      />

      <ConfirmDialog
        open={Boolean(deletingBlock)}
        onOpenChange={(open) => !open && setDeletingBlock(null)}
        title={t("common.delete")}
        description={
          deletingBlock
            ? `${deletingBlock.titleRu || deletingBlock.titleTk || deletingBlock.kind} ${t("common.deleteWarnM")}`
            : ""
        }
        confirmLabel={t("common.delete")}
        onConfirm={handleConfirmDelete}
        isDestructive
        isLoading={deleteBlock.isPending}
      />
    </div>
  );
}
