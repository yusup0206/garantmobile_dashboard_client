import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { ArrowLeft, Edit2, Plus, Search, Trash2 } from "lucide-react";

import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";

import { useProductSpecDefinitionDetail } from "@/services/productSpecDefinitions/useProductSpecDefinitions";
import {
  useProductSpecValues,
  useCreateProductSpecValue,
  useUpdateProductSpecValue,
  useDeleteProductSpecValue,
} from "@/services/productSpecValues/useProductSpecValues";
import type { ProductSpecValue } from "@/services/productSpecValues/productSpecValues.types";

import { ProductSpecValueFormDialog } from "./ui/ProductSpecValueFormDialog";
import type { ProductSpecValueFormValues } from "./lib/productSpecValue.schema";

export default function ProductSpecDefinitionDetailPage() {
  const { id: specId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const [search, setSearch] = useState("");

  // ── Spec definition ──
  const {
    data: definition,
    isLoading: defLoading,
    isError: defError,
  } = useProductSpecDefinitionDetail(specId);

  const defName =
    definition
      ? (lang as string) === "tm"
        ? definition.nameTm || definition.nameRu
        : definition.nameRu || definition.nameTm
      : "…";

  // ── Spec values ──
  const {
    data: valuesData,
    isLoading: valuesLoading,
    isError: valuesError,
    refetch: refetchValues,
  } = useProductSpecValues({ specId, search });

  const values = useMemo(() => valuesData?.values ?? [], [valuesData?.values]);

  const createMutation = useCreateProductSpecValue();
  const updateMutation = useUpdateProductSpecValue();
  const deleteMutation = useDeleteProductSpecValue();

  // ── UI state ──
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductSpecValue | null>(null);
  const [deleting, setDeleting] = useState<ProductSpecValue | null>(null);

  const valueOf = (v: ProductSpecValue) =>
    (lang as string) === "tm" ? v.valueTm || v.valueRu : v.valueRu || v.valueTm;

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: ProductSpecValue) {
    setEditing(item);
    setFormOpen(true);
  }

  function submitForm(formValues: ProductSpecValueFormValues) {
    if (!specId) return;
    const input = { specId, ...formValues };
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, input },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createMutation.mutate(input, { onSuccess: () => setFormOpen(false) });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => setDeleting(null),
    });
  }

  // ── Render ──
  const isLoading = defLoading || valuesLoading;
  const isError = defError || valuesError;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/product-spec-definitions")}
            className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
              {defName}
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              Значения спецификации
            </p>
          </div>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          {t("common.add")}
        </Button>
      </header>

      {/* Search */}
      <Card className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
        <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted">
          <Search className="h-4 w-4" />
          <span>Поиск:</span>
        </div>
        <div className="w-full sm:w-72">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по значению…"
            className="h-10 text-sm"
          />
        </div>
      </Card>

      {/* Content */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetchValues()} />
      ) : values.length === 0 ? (
        <EmptyState title="Значения не найдены" />
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t("form.name")}</Table.Head>
                <Table.Head className="text-right w-28">Порядок</Table.Head>
                <Table.Head className="text-right">
                  {t("common.actions")}
                </Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {values.map((v) => (
                <Table.Row key={v.id}>
                  <Table.Cell className="font-medium text-ink">
                    {valueOf(v)}
                  </Table.Cell>
                  <Table.Cell className="text-right text-muted tabular-nums">
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

      {/* Form dialog */}
      <ProductSpecValueFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        specValue={editing}
        onSubmit={submitForm}
        pending={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Удалить значение?"
        description={
          deleting
            ? `Вы действительно хотите удалить "${valueOf(deleting)}"?`
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
