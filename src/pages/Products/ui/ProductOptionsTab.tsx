import { useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { ChevronRight, Edit2, Plus, Trash2, Settings2 } from "lucide-react";

import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";

import {
  useProductOptions,
  useCreateProductOption,
  useUpdateProductOption,
  useDeleteProductOption,
} from "@/services/productOptions/useProductOptions";
import type { ProductOption } from "@/services/productOptions/productOptions.types";

import { ProductOptionFormDialog } from "./ProductOptionFormDialog";
import { ProductOptionValuesPanel } from "./ProductOptionValuesPanel";
import type { ProductOptionFormValues } from "../lib/productOption.schema";

type ProductOptionsTabProps = {
  productId: string;
};

export function ProductOptionsTab({ productId }: ProductOptionsTabProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const {
    data: optionsData,
    isLoading,
    isError,
    refetch,
  } = useProductOptions({ productId });

  const options = useMemo(
    () => optionsData?.options ?? [],
    [optionsData?.options],
  );

  const createMutation = useCreateProductOption();
  const updateMutation = useUpdateProductOption();
  const deleteMutation = useDeleteProductOption();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductOption | null>(null);
  const [deleting, setDeleting] = useState<ProductOption | null>(null);
  // null = show list, non-null = show that option's values panel
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);

  function nameOf(item: ProductOption) {
    return (lang as string) === "tm"
      ? item.nameTm || item.nameRu
      : item.nameRu || item.nameTm;
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: ProductOption) {
    setEditing(item);
    setFormOpen(true);
  }

  function submitForm(values: ProductOptionFormValues) {
    if (editing) {
      updateMutation.mutate(
        {
          id: editing.id,
          input: {
            productId,
            nameRu: values.nameRu,
            nameTm: values.nameTm,
            sortOrder: values.sortOrder,
          },
        },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createMutation.mutate(
        {
          productId,
          nameRu: values.nameRu,
          nameTm: values.nameTm,
          sortOrder: values.sortOrder,
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

  // ── If an option is selected, show its values panel ──────────────────────
  if (selectedOption) {
    return (
      <ProductOptionValuesPanel
        option={selectedOption}
        onBack={() => setSelectedOption(null)}
      />
    );
  }

  // ── Options list ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Опции товара</h2>
          <p className="text-sm text-muted">
            Управление опциями для фильтрации и выбора (цвет, размер и т.д.)
          </p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить опцию
        </Button>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : options.length === 0 ? (
        <EmptyState
          title="Опции товара не найдены"
          hint="Добавьте опции для настройки фильтров и вариантов выбора товара"
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-12">#</Table.Head>
                <Table.Head>Название</Table.Head>
                <Table.Head className="text-right">Сортировка</Table.Head>
                <Table.Head className="text-right">{t("common.actions")}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {options.map((opt, index) => (
                <Table.Row
                  key={opt.id}
                  className="cursor-pointer hover:bg-canvas/60 transition-colors"
                  onClick={() => setSelectedOption(opt)}
                >
                  <Table.Cell className="text-muted tabular-nums">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand/10">
                        <Settings2 className="h-3.5 w-3.5 text-brand" />
                      </span>
                      <span className="font-semibold text-ink">
                        {nameOf(opt) || "—"}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-right tabular-nums text-muted">
                    {opt.sortOrder}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(opt)}
                        title="Редактировать"
                      >
                        <Edit2 className="h-4 w-4 text-muted" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleting(opt)}
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOption(opt)}
                        title="Значения опции"
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

      <ProductOptionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        option={editing}
        onSubmit={submitForm}
        pending={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Удалить опцию товара?"
        description={
          deleting
            ? `Вы действительно хотите удалить опцию "${nameOf(deleting)}"?`
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
