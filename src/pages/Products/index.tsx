import { useState } from "react";
import { useT } from "@/i18n/useT";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.products.title")}
        subtitle={t("page.products.subtitle")}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            {t("common.add")}
          </Button>
        }
      />

      {/* Unified Filter & Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-end gap-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder={t("common.search")}
        />
      </Card>

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
