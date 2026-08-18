import { useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";

import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";

import {
  useProductSpecs,
  useCreateProductSpec,
  useUpdateProductSpec,
  useDeleteProductSpec,
} from "@/services/productSpecs/useProductSpecs";
import { useProductSpecDefinitions } from "@/services/productSpecDefinitions/useProductSpecDefinitions";
import { useProductSpecValues } from "@/services/productSpecValues/useProductSpecValues";
import type { ProductSpec } from "@/services/productSpecs/productSpecs.types";

import { ProductSpecFormDialog } from "./ProductSpecFormDialog";
import type { ProductSpecFormValues } from "../lib/productSpec.schema";

type ProductSpecsTabProps = {
  productId: string;
};

export function ProductSpecsTab({ productId }: ProductSpecsTabProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const [search, setSearch] = useState("");

  // Fetch product specs for this product
  const {
    data: specsData,
    isLoading: specsLoading,
    isError: specsError,
    refetch: refetchSpecs,
  } = useProductSpecs({ productId });

  // Fetch all spec definitions for resolving labels
  const { data: defsData } = useProductSpecDefinitions();
  const definitions = useMemo(() => defsData?.definitions ?? [], [defsData?.definitions]);

  // Fetch all spec values for resolving labels
  const { data: allValuesData } = useProductSpecValues();
  const allValues = useMemo(() => allValuesData?.values ?? [], [allValuesData?.values]);

  const createMutation = useCreateProductSpec();
  const updateMutation = useUpdateProductSpec();
  const deleteMutation = useDeleteProductSpec();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductSpec | null>(null);
  const [deleting, setDeleting] = useState<ProductSpec | null>(null);

  const defName = (defId: string) => {
    const d = definitions.find((item) => item.id === defId);
    if (!d) return defId || "—";
    return (lang as string) === "tm" ? d.nameTm || d.nameRu : d.nameRu || d.nameTm;
  };

  const valName = (valId: string) => {
    const v = allValues.find((item) => item.id === valId);
    if (!v) return valId || "—";
    return (lang as string) === "tm" ? v.valueTm || v.valueRu : v.valueRu || v.valueTm;
  };

  const specs = useMemo(() => {
    const list = specsData?.specs ?? [];
    if (!search.trim()) return list;
    const s = search.toLowerCase();
    return list.filter((item) => {
      const dName = defName(item.specId).toLowerCase();
      const vName = valName(item.specValueId).toLowerCase();
      return dName.includes(s) || vName.includes(s);
    });
  }, [specsData?.specs, search, definitions, allValues, lang]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: ProductSpec) {
    setEditing(item);
    setFormOpen(true);
  }

  function submitForm(values: ProductSpecFormValues) {
    if (editing) {
      updateMutation.mutate(
        {
          id: editing.id,
          input: {
            productId,
            specValueId: values.specValueId,
            sortOrder: values.sortOrder,
          },
        },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createMutation.mutate(
        {
          productId,
          specValueId: values.specValueId,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Card className="flex flex-1 items-center gap-3 p-3 sm:max-w-md">
          <Search className="h-4 w-4 text-muted shrink-0" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по характеристикам…"
            className="h-8 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          />
        </Card>
        <Button size="sm" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить характеристику
        </Button>
      </div>

      {specsLoading ? (
        <LoadingState />
      ) : specsError ? (
        <ErrorState onRetry={() => refetchSpecs()} />
      ) : specs.length === 0 ? (
        <EmptyState
          title="Характеристики не назначены"
          hint="Добавьте характеристики для этого товара"
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Характеристика</Table.Head>
                <Table.Head>Значение</Table.Head>
                <Table.Head className="text-right w-28">Порядок</Table.Head>
                <Table.Head className="text-right">{t("common.actions")}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {specs.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell className="font-semibold text-ink">
                    {defName(item.specId)}
                  </Table.Cell>
                  <Table.Cell className="text-ink">
                    <span className="inline-flex items-center rounded-lg bg-brand-soft/70 px-2.5 py-1 text-xs font-semibold text-brand-dark">
                      {valName(item.specValueId)}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-right text-muted tabular-nums">
                    {item.sortOrder}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(item)}
                        title="Редактировать"
                      >
                        <Edit2 className="h-4 w-4 text-muted" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleting(item)}
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

      <ProductSpecFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        spec={editing}
        onSubmit={submitForm}
        pending={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Удалить характеристику товара?"
        description="Вы уверены, что хотите удалить эту характеристику товара?"
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onConfirm={confirmDelete}
        pending={deleteMutation.isPending}
        danger
      />
    </div>
  );
}
