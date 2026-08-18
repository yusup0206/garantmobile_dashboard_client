import { useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { ChevronRight, Edit2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";

import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";

import {
  useProductVariants,
  useCreateProductVariant,
  useUpdateProductVariant,
  useDeleteProductVariant,
} from "@/services/productVariants/useProductVariants";
import type { ProductVariant } from "@/services/productVariants/productVariants.types";

import { ProductVariantFormDialog } from "./ProductVariantFormDialog";
import { ProductVariantOptionValuesPanel } from "./ProductVariantOptionValuesPanel";
import type { ProductVariantFormValues } from "../lib/productVariant.schema";

type ProductVariantsTabProps = {
  productId: string;
};

export function ProductVariantsTab({ productId }: ProductVariantsTabProps) {
  const t = useT();

  const {
    data: variantsData,
    isLoading,
    isError,
    refetch,
  } = useProductVariants({ productId });

  const variants = useMemo(() => variantsData?.variants ?? [], [variantsData?.variants]);

  const createMutation = useCreateProductVariant();
  const updateMutation = useUpdateProductVariant();
  const deleteMutation = useDeleteProductVariant();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductVariant | null>(null);
  const [deleting, setDeleting] = useState<ProductVariant | null>(null);
  // null = show list, non-null = show that variant's option-values panel
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: ProductVariant) {
    setEditing(item);
    setFormOpen(true);
  }

  function submitForm(values: ProductVariantFormValues) {
    if (editing) {
      updateMutation.mutate(
        {
          id: editing.id,
          input: {
            productId,
            barcode: values.barcode,
            price: values.price,
            oldPrice: values.oldPrice,
            stock: values.stock,
            isActive: values.isActive,
            photos: values.photos,
          },
        },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createMutation.mutate(
        {
          productId,
          barcode: values.barcode,
          price: values.price,
          oldPrice: values.oldPrice,
          stock: values.stock,
          isActive: values.isActive,
          photos: values.photos,
        },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => setDeleting(null),
    });
  }

  // ── Detail panel ────────────────────────────────────────────────────────
  if (selectedVariant) {
    return (
      <ProductVariantOptionValuesPanel
        variant={selectedVariant}
        productId={productId}
        onBack={() => setSelectedVariant(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Варианты товара</h2>
          <p className="text-sm text-muted">
            Управление ценами, штрихкодами, остатками и фотографиями вариантов
          </p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить вариант
        </Button>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : variants.length === 0 ? (
        <EmptyState
          title="Варианты товара не найдены"
          hint="Добавьте хотя бы один вариант товара (штрихкод, цена, фото)"
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Фото</Table.Head>
                <Table.Head>Штрихкод</Table.Head>
                <Table.Head className="text-right">Цена</Table.Head>
                <Table.Head className="text-right">Старая цена</Table.Head>
                <Table.Head className="text-right">Остаток</Table.Head>
                <Table.Head>Статус</Table.Head>
                <Table.Head className="text-right">{t("common.actions")}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {variants.map((v) => (
                <Table.Row
                  key={v.id}
                  className="cursor-pointer hover:bg-canvas/60 transition-colors"
                  onClick={() => setSelectedVariant(v)}
                >
                  <Table.Cell>
                    <div className="flex items-center gap-1.5">
                      {v.photos && v.photos.length > 0 ? (
                        <div className="relative">
                          <img
                            src={getImageUrl(v.photos[0])}
                            alt=""
                            className="h-10 w-10 rounded-lg border border-line object-cover"
                          />
                          {v.photos.length > 1 && (
                            <span className="absolute -bottom-1 -right-1 rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                              +{v.photos.length - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-canvas text-muted">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="font-mono font-semibold text-ink">
                    {v.barcode || "—"}
                  </Table.Cell>
                  <Table.Cell className="text-right font-display font-bold text-ink">
                    {Number(v.price).toLocaleString()} TMT
                  </Table.Cell>
                  <Table.Cell className="text-right text-muted line-through">
                    {Number(v.oldPrice) > 0
                      ? `${Number(v.oldPrice).toLocaleString()} TMT`
                      : "—"}
                  </Table.Cell>
                  <Table.Cell className="text-right text-muted tabular-nums">
                    {v.stock} шт
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        v.isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {v.isActive ? "Активен" : "Неактивен"}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(v)}
                        title="Редактировать"
                      >
                        <Edit2 className="h-4 w-4 text-muted" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleting(v)}
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedVariant(v)}
                        title="Опции варианта"
                      >
                        <ChevronRight className="h-4 w-4 text-muted" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      )}

      <ProductVariantFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        variant={editing}
        onSubmit={submitForm}
        pending={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Удалить вариант товара?"
        description={
          deleting
            ? `Вы действительно хотите удалить вариант со штрихкодом "${deleting.barcode}"?`
            : undefined
        }
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onConfirm={confirmDelete}
        pending={deleteMutation.isPending}
        danger
      />
    </div>
  );
}
