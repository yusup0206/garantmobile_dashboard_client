import { useState } from "react";
import { useT } from "@/i18n/useT";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/Button";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/services/products/useProducts";
import type { Product, ProductInput } from "@/services/products/products.types";

import { ProductsTable } from "./ui/ProductsTable";
import { ProductFormDialog } from "./ui/ProductFormDialog";
import { toRow } from "./lib/products.helpers";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const t = useT();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useProducts({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const rows = (data?.products ?? []).map(toRow);
  const total = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setFormOpen(true);
  }

  function submitForm(values: ProductInput) {
    if (editing) {
      updateProduct.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createProduct.mutate(
        { input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteProduct.mutate(
      { id: deleting.id },
      { onSuccess: () => setDeleting(null) },
    );
  }

  return (
    <div>
      <PageHeader
        title={t("page.products.title")}
        subtitle={t("page.products.subtitle")}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t("common.search")}
              className="rounded-xl border border-line bg-canvas px-3 py-1.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
            />
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
        <EmptyState
          title={t("products.empty")}
          hint={t("products.emptyHint")}
        />
      ) : (
        <>
          <ProductsTable rows={rows} onEdit={openEdit} onDelete={setDeleting} />
          <Pagination
            page={page}
            pageCount={pageCount}
            total={total}
            pageSize={PAGE_SIZE}
            onPage={setPage}
          />
        </>
      )}

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        onSubmit={submitForm}
        pending={createProduct.isPending || updateProduct.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t("products.confirm.title")}
        description={
          deleting
            ? `«${deleting.nameRu || deleting.nameTm}» ${t("common.deleteWarnM")}`
            : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deleteProduct.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
