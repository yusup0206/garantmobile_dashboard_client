import { useMemo, useState } from "react";
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
import { Select } from "@/components/ui/Select";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

import {
  usePreordersList,
  useCreatePreorder,
  useUpdatePreorder,
  useDeletePreorder,
  usePreorderTags,
} from "@/services/preorders/usePreorders";
import { useBrands } from "@/services/brands/useBrands";
import { useCategories } from "@/services/categories/useCategories";
import type { PreorderItem, PreorderInput } from "@/services/preorders/preorders.types";
import { PreorderDialog } from "./PreorderDialog";

const PAGE_SIZE = 10;

export function PreordersTab() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagId, setTagId] = useState("");

  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();
  const { data: tagsData } = usePreorderTags({ pageSize: 100 });

  const brands = useMemo(() => brandsData?.brands ?? [], [brandsData]);
  const categories = useMemo(() => categoriesData?.categories ?? [], [categoriesData]);
  const tags = useMemo(() => tagsData?.preorderTags ?? [], [tagsData]);

  const { data, isLoading, isError, refetch } = usePreordersList({
    page,
    pageSize: PAGE_SIZE,
    search: search.trim() || undefined,
    brandId: brandId || undefined,
    categoryId: categoryId || undefined,
    tagId: tagId || undefined,
  });

  const createPreorder = useCreatePreorder();
  const updatePreorder = useUpdatePreorder();
  const deletePreorder = useDeletePreorder();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PreorderItem | null>(null);
  const [deleting, setDeleting] = useState<PreorderItem | null>(null);

  const preorders = data?.preorders ?? [];
  const total = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: PreorderItem) {
    setEditing(item);
    setFormOpen(true);
  }

  function submitForm(values: PreorderInput) {
    if (editing) {
      updatePreorder.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createPreorder.mutate(
        { input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deletePreorder.mutate(
      { id: deleting.id },
      { onSuccess: () => setDeleting(null) },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Unified Filter & Search Bar */}
      <Card className="p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 flex-1">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder={t("common.search")}
          />

          <Select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
          >
            <option value="">{t("preorders.list.allCategories")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {lang === "tk" ? c.nameTk || c.nameRu : c.nameRu || c.nameTk}
              </option>
            ))}
          </Select>

          <Select
            value={brandId}
            onChange={(e) => {
              setBrandId(e.target.value);
              setPage(1);
            }}
          >
            <option value="">{t("preorders.list.allBrands")}</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>

          <Select
            value={tagId}
            onChange={(e) => {
              setTagId(e.target.value);
              setPage(1);
            }}
          >
            <option value="">{t("preorders.list.allTags")}</option>
            {tags.map((tg) => (
              <option key={tg.id} value={tg.id}>
                {lang === "tk" ? tg.nameTk : tg.nameRu}
              </option>
            ))}
          </Select>
        </div>

        <Button size="sm" onClick={openAdd} className="shrink-0">
          <Plus className="h-4 w-4" />
          {t("preorders.list.add")}
        </Button>
      </Card>

      {/* Content */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : preorders.length === 0 ? (
        <EmptyState title={t("preorders.list.empty")} />
      ) : (
        <>
          <Table className="min-w-[850px]" containerClassName="rounded-2xl border border-line bg-surface">
            <Table.Header>
              <Table.Row>
                <Table.Head>{t("form.product")}</Table.Head>
                <Table.Head>{t("preorders.list.field.category")}</Table.Head>
                <Table.Head>{t("preorders.list.field.brand")}</Table.Head>
                <Table.Head>{t("preorders.list.field.tag")}</Table.Head>
                <Table.Head>{t("preorders.list.col.releaseDate")}</Table.Head>
                <Table.Head className="text-right">{t("preorders.list.col.targetSize")}</Table.Head>
                <Table.Head className="text-right">{t("preorders.list.col.waitingCount")}</Table.Head>
                <Table.Head className="text-right">{t("common.actions")}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {preorders.map((item) => {
                const title = lang === "tk" ? item.titleTk || item.titleRu : item.titleRu || item.titleTk;
                const catName = item.category
                  ? lang === "tk"
                    ? item.category.nameTk || item.category.nameRu
                    : item.category.nameRu || item.category.nameTk
                  : "—";
                const brandName = item.brand?.name || "—";
                const tagName = item.tag
                  ? lang === "tk"
                    ? item.tag.nameTk
                    : item.tag.nameRu
                  : "—";

                return (
                  <Table.Row key={item.id}>
                    <Table.Cell className="font-semibold text-ink">
                      <div>{title}</div>
                      {item.variant?.barcode ? (
                        <span className="font-mono text-xs text-muted">
                          {item.variant.barcode}
                        </span>
                      ) : null}
                    </Table.Cell>
                    <Table.Cell className="text-ink">{catName}</Table.Cell>
                    <Table.Cell className="text-ink">{brandName}</Table.Cell>
                    <Table.Cell>
                      {item.tag ? (
                        <Badge variant="neutral" className="font-medium">
                          {tagName}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-muted">
                      {item.releaseDate ? item.releaseDate.split("T")[0] : "—"}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-right font-display font-semibold text-ink">
                      {item.targetSize}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-right font-display font-bold text-brand">
                      {item.waitingCount}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted hover:text-ink"
                          onClick={() => openEdit(item)}
                          title={t("common.edit")}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted hover:text-red-500"
                          onClick={() => setDeleting(item)}
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

      {/* Preorder Dialog */}
      <PreorderDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        preorder={editing}
        onSubmit={submitForm}
        pending={createPreorder.isPending || updatePreorder.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={t("preorders.list.confirm.deleteTitle")}
        description={t("preorders.list.confirm.deleteDesc")}
        confirmLabel={t("common.delete")}
        onConfirm={confirmDelete}
        pending={deletePreorder.isPending}
        danger
      />
    </div>
  );
}
