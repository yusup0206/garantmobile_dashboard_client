import { useEffect, useState } from "react";
import { Plus, Eye } from "lucide-react";
import { useT } from "@/i18n/useT";
import { env } from "@/config/env";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/Button";
import { useCategories } from "@/services/categories/useCategories";
import { getHomePreviewToken } from "@/services/home/home.api";
import {
  useHomeDraft,
  useHomeDraftStatus,
  useSaveHomeDraft,
  usePublishHome,
  useDiscardHomeDraft,
} from "@/services/home/useHome";
import type { HomeBlock } from "@/services/home/home.types";
import { BlockList } from "./ui/BlockList";
import { BlockFormDialog } from "./ui/BlockFormDialog";
import { move } from "./lib/home.helpers";

export default function HomeBuilderPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useHomeDraft();
  const { data: status } = useHomeDraftStatus();
  const { data: categories } = useCategories();
  const saveDraft = useSaveHomeDraft();
  const publish = usePublishHome();
  const discard = useDiscardHomeDraft();

  const [blocks, setBlocks] = useState<HomeBlock[] | null>(null);
  const [dirty, setDirty] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<HomeBlock | null>(null);
  const [previewing, setPreviewing] = useState(false);

  // Load the working copy once; refreshed explicitly on save / publish / reset.
  useEffect(() => {
    if (data && blocks === null) setBlocks(data.blocks);
  }, [data, blocks]);

  const busy = saveDraft.isPending || publish.isPending || discard.isPending;
  const hasDraft = status?.hasDraft ?? false;

  const renumber = (list: HomeBlock[]): HomeBlock[] =>
    list.map((b, i) => ({ ...b, order: i + 1 }));

  function onMove(id: number, dir: -1 | 1) {
    setBlocks((prev) => (prev ? move(prev, id, dir) : prev));
    setDirty(true);
  }

  function onToggle(id: number) {
    setBlocks((prev) =>
      prev ? prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)) : prev,
    );
    setDirty(true);
  }

  function onDelete(block: HomeBlock) {
    setBlocks((prev) => (prev ? renumber(prev.filter((b) => b.id !== block.id)) : prev));
    setDirty(true);
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(block: HomeBlock) {
    setEditing(block);
    setFormOpen(true);
  }

  function submitBlock(draft: HomeBlock) {
    setBlocks((prev) => {
      const list = prev ?? [];
      const exists = list.some((b) => b.id === draft.id);
      const next = exists
        ? list.map((b) => (b.id === draft.id ? draft : b))
        : [...list, draft];
      return renumber(next.sort((a, b) => a.order - b.order));
    });
    setDirty(true);
    setFormOpen(false);
  }

  function onSaveDraft() {
    if (!blocks) return;
    saveDraft.mutate(blocks, {
      onSuccess: (layout) => {
        setBlocks(layout.blocks);
        setDirty(false);
      },
    });
  }

  function onPublish() {
    publish.mutate(undefined, {
      onSuccess: (layout) => {
        setBlocks(layout.blocks);
        setDirty(false);
      },
    });
  }

  function onDiscard() {
    discard.mutate(undefined, {
      onSuccess: (layout) => {
        setBlocks(layout.blocks);
        setDirty(false);
      },
    });
  }

  function onReset() {
    if (data) {
      setBlocks(data.blocks);
      setDirty(false);
    }
  }

  // Preview reflects the saved draft, so save any local edits first, then open
  // the storefront in preview mode with a fresh short-lived token.
  async function onPreview() {
    if (!env.storefrontUrl) return;
    setPreviewing(true);
    try {
      if (dirty && blocks) {
        const layout = await saveDraft.mutateAsync(blocks);
        setBlocks(layout.blocks);
        setDirty(false);
      }
      const { token } = await getHomePreviewToken();
      const base = env.storefrontUrl.replace(/\/$/, "");
      window.open(
        `${base}/?preview=${encodeURIComponent(token)}`,
        "_blank",
        "noopener",
      );
    } catch {
      // best-effort; a failed preview leaves the editor untouched
    } finally {
      setPreviewing(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.home.title")}
        subtitle={t("page.home.subtitle")}
        action={
          <div className="flex flex-wrap items-center gap-3">
            {env.storefrontUrl ? (
              <Button
                size="sm"
                variant="outline"
                onClick={onPreview}
                disabled={busy || previewing}
              >
                <Eye className="h-4 w-4" />
                {previewing ? t("home.previewing") : t("home.preview")}
              </Button>
            ) : null}
            {dirty ? (
              <>
                <Button size="sm" variant="outline" onClick={onReset} disabled={busy}>
                  {t("common.reset")}
                </Button>
                <Button size="sm" onClick={onSaveDraft} disabled={busy}>
                  {saveDraft.isPending ? t("common.saving") : t("home.saveDraft")}
                </Button>
              </>
            ) : hasDraft ? (
              <>
                <Button size="sm" variant="outline" onClick={onDiscard} disabled={busy}>
                  {t("home.discard")}
                </Button>
                <Button size="sm" onClick={onPublish} disabled={busy}>
                  {publish.isPending ? t("home.publishing") : t("home.publish")}
                </Button>
              </>
            ) : null}
            <Button
              size="sm"
              variant={dirty || hasDraft ? "outline" : "primary"}
              onClick={openAdd}
            >
              <Plus className="h-4 w-4" />
              {t("home.addBlock")}
            </Button>
          </div>
        }
      />

      {dirty ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800">
          {t("home.unsaved")}
        </div>
      ) : hasDraft ? (
        <div className="rounded-xl border border-sky-300 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-800">
          {t("home.draftPending")}
        </div>
      ) : null}

      {isLoading || blocks === null ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <BlockList
          blocks={blocks}
          onMove={onMove}
          onToggle={onToggle}
          onEdit={openEdit}
          onDelete={onDelete}
        />
      )}

      <BlockFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        block={editing}
        categories={categories ?? []}
        onSubmit={submitBlock}
      />
    </div>
  );
}
