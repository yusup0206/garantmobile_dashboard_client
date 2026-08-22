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
  useBlog,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
} from "@/services/blog/useBlog";
import type { BlogPost, CreateBlogPostDto, BlogStatus } from "@/services/blog/blog.types";

import { BlogTable } from "./ui/BlogTable";
import { PostFormDialog } from "./ui/PostFormDialog";
import { toRow, FILTER_TABS } from "./lib/blog.helpers";

export default function BlogPage() {
  const t = useT();
  const [params, setParams] = useSearchParams();
  const filter = params.get("status") ?? "all";
  const [search, setSearch] = useState("");

  const queryParams = useMemo(() => {
    const p: { status?: BlogStatus; search?: string } = {};
    if (filter !== "all") p.status = filter as BlogStatus;
    if (search.trim()) p.search = search.trim();
    return p;
  }, [filter, search]);

  const { data, isLoading, isError, refetch } = useBlog(queryParams);
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState<BlogPost | null>(null);

  const posts = useMemo(() => data?.blogs ?? [], [data?.blogs]);

  const rows = useMemo(() => {
    return posts.map(toRow);
  }, [posts]);

  const pg = usePagination(rows, 8, filter);

  function setFilter(key: string) {
    setParams(key === "all" ? {} : { status: key }, { replace: true });
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditing(post);
    setFormOpen(true);
  }

  function submitForm(values: CreateBlogPostDto) {
    if (editing) {
      updatePost.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createPost.mutate(
        { input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deletePost.mutate(
      { id: deleting.id },
      { onSuccess: () => setDeleting(null) },
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("page.blog.title")}
        subtitle={t("page.blog.subtitle")}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" />
            {t("common.add")}
          </Button>
        }
      />

      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <FilterTabs tabs={FILTER_TABS} value={filter} onChange={setFilter} />
        <SearchInput
          placeholder={t("blog.search")}
          value={search}
          onChange={setSearch}
        />
      </Card>

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
            ? `«${deleting.titleRu || deleting.titleTk}» ${t("common.deleteWarnF")}`
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
