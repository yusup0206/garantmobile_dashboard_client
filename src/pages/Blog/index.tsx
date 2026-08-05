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
  useBlog,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
} from "@/services/blog/useBlog";
import type { Post, PostInput } from "@/services/blog/blog.types";

import { BlogTable } from "./ui/BlogTable";
import { PostFormDialog } from "./ui/PostFormDialog";
import { toRow, FILTER_TABS } from "./lib/blog.helpers";

export default function BlogPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useBlog();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  // URL state: /blog?status=draft — shareable & survives refresh.
  const [params, setParams] = useSearchParams();
  const filter = params.get("status") ?? "all";

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState<Post | null>(null);

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

  function openEdit(post: Post) {
    setEditing(post);
    setFormOpen(true);
  }

  function submitForm(values: PostInput) {
    if (editing) {
      updatePost.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createPost.mutate(values, { onSuccess: () => setFormOpen(false) });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deletePost.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  }

  return (
    <div>
      <PageHeader
        title={t("page.blog.title")}
        subtitle={t("page.blog.subtitle")}
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
        <EmptyState title={t("blog.empty")} />
      ) : (
        <>
          <BlogTable rows={pg.slice} onEdit={openEdit} onDelete={setDeleting} />
          <Pagination
            page={pg.page}
            pageCount={pg.pageCount}
            total={pg.total}
            pageSize={pg.pageSize}
            onPage={pg.setPage}
          />
        </>
      )}

      <PostFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        post={editing}
        onSubmit={submitForm}
        pending={createPost.isPending || updatePost.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t("blog.confirm.title")}
        description={
          deleting
            ? `«${deleting.title}» ${t("common.deleteWarnF")}`
            : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deletePost.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
