import { useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { ArrowLeft, Edit2, Plus, Trash2 } from "lucide-react";

import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";

import {
  useProductOptionValues,
  useCreateProductOptionValue,
  useUpdateProductOptionValue,
  useDeleteProductOptionValue,
} from "@/services/productOptionValues/useProductOptionValues";
import type { ProductOptionValue } from "@/services/productOptionValues/productOptionValues.types";
import type { ProductOption } from "@/services/productOptions/productOptions.types";

import { ProductOptionValueFormDialog } from "./ProductOptionValueFormDialog";
import type { ProductOptionValueFormValues } from "../lib/productOptionValue.schema";

type Props = {
  option: ProductOption;
  onBack: () => void;
};

export function ProductOptionValuesPanel({ option, onBack }: Props) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const optionName =
    (lang as string) === "tm"
      ? option.nameTm || option.nameRu
      : option.nameRu || option.nameTm;

  const {
    data: valuesData,
    isLoading,
    isError,
    refetch,
  } = useProductOptionValues({ optionId: option.id });

  const values = useMemo(
    () => valuesData?.values ?? [],
    [valuesData?.values],
  );

  const createMutation = useCreateProductOptionValue();
  const updateMutation = useUpdateProductOptionValue();
  const deleteMutation = useDeleteProductOptionValue();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductOptionValue | null>(null);
  const [deleting, setDeleting] = useState<ProductOptionValue | null>(null);

  function valueNameOf(item: ProductOptionValue) {
    return (lang as string) === "tm"
      ? item.valueTm || item.valueRu
      : item.valueRu || item.valueTm;
  }

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: ProductOptionValue) {
    setEditing(item);
    setFormOpen(true);
  }

  function submitForm(vals: ProductOptionValueFormValues) {
    if (editing) {
      updateMutation.mutate(
        {
          id: editing.id,
          input: {
            optionId: option.id,
            valueRu: vals.valueRu,
            valueTm: vals.valueTm,
            hex: vals.hex ?? "",
            sortOrder: vals.sortOrder,
          },
        },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createMutation.mutate(
        {
          optionId: option.id,
          valueRu: vals.valueRu,
          valueTm: vals.valueTm,
          hex: vals.hex ?? "",
          sortOrder: vals.sortOrder,
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

  return (
    <div className="space-y-6">
      {/* Sub-header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:bg-canvas hover:text-ink"
            aria-label="Назад к опциям"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-ink">
              Значения опции:{" "}
              <span className="text-brand">{optionName}</span>
            </h2>
            <p className="text-sm text-muted">
              Управление значениями — цвета, размеры и другие варианты выбора
            </p>
          </div>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить значение
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : values.length === 0 ? (
        <EmptyState
          title="Значения не найдены"
          hint="Добавьте значения для этой опции (например: красный, синий, S, M, L)"
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-12">#</Table.Head>
                <Table.Head>Значение</Table.Head>
                <Table.Head>Цвет (HEX)</Table.Head>
                <Table.Head className="text-right">Сортировка</Table.Head>
                <Table.Head className="text-right">{t("common.actions")}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {values.map((v, index) => (
                <Table.Row key={v.id}>
                  <Table.Cell className="text-muted tabular-nums">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      {v.hex ? (
                        <span
                          className="h-5 w-5 shrink-0 rounded-full border border-line shadow-sm"
                          style={{ backgroundColor: v.hex }}
                          title={v.hex}
                        />
                      ) : (
                        <span className="h-5 w-5 shrink-0 rounded-full border border-dashed border-line bg-canvas" />
                      )}
                      <span className="font-semibold text-ink">
                        {valueNameOf(v) || "—"}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {v.hex ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="h-4 w-4 shrink-0 rounded border border-line"
                          style={{ backgroundColor: v.hex }}
                        />
                        <span className="font-mono text-xs text-muted">
                          {v.hex}
                        </span>
                      </div>
                    ) : (
                      <span className="text-faint text-xs">—</span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="text-right tabular-nums text-muted">
                    {v.sortOrder}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end gap-2">
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
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      )}

      <ProductOptionValueFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        value={editing}
        onSubmit={submitForm}
        pending={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Удалить значение опции?"
        description={
          deleting
            ? `Вы действительно хотите удалить значение "${valueNameOf(deleting)}"?`
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
