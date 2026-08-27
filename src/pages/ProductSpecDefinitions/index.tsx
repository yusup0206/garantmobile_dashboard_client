import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { ChevronRight, Edit2, Plus, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import {
  useProductSpecDefinitions,
  useCreateProductSpecDefinition,
  useUpdateProductSpecDefinition,
  useDeleteProductSpecDefinition,
} from "@/services/productSpecDefinitions/useProductSpecDefinitions";
import type {
  ProductSpecDefinition,
  ProductSpecDefinitionInput,
} from "@/services/productSpecDefinitions/productSpecDefinitions.types";
import { useInnerCategories } from "@/services/innerCategories/useInnerCategories";

import { ProductSpecDefinitionFormDialog } from "./ui/ProductSpecDefinitionFormDialog";

import { Table } from "@/components/ui/Table";

export default function ProductSpecDefinitionsPage() {
  const navigate = useNavigate();
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const [search, setSearch] = useState("");
  const [innerCategoryId, setInnerCategoryId] = useState("");

  const nameOf = (item: ProductSpecDefinition) =>
    (lang as string) === "tk" ? item.nameTk || item.nameRu : item.nameRu || item.nameTk;

  const { data: innerCatsData } = useInnerCategories({ pageSize: 200 });
  const innerCategories = useMemo(
    () => innerCatsData?.innerCategories ?? [],
    [innerCatsData?.innerCategories],
  );

  const { data, isLoading, isError, refetch } = useProductSpecDefinitions({
    search,
    innerCategoryId: innerCategoryId || undefined,
  });
  const createMutation = useCreateProductSpecDefinition();
  const updateMutation = useUpdateProductSpecDefinition();
  const deleteMutation = useDeleteProductSpecDefinition();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductSpecDefinition | null>(null);
  const [deleting, setDeleting] = useState<ProductSpecDefinition | null>(null);

  const definitions = useMemo(() => data?.definitions ?? [], [data?.definitions]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: ProductSpecDefinition) {
    setEditing(item);
    setFormOpen(true);
  }

  function submitForm(values: ProductSpecDefinitionInput) {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, input: values },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createMutation.mutate(values, { onSuccess: () => setFormOpen(false) });
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("page.productSpecDefinitions.title")}
        subtitle={t("page.productSpecDefinitions.subtitle")}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" />
            {t("common.add")}
          </Button>
        }
      />

      <Card className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("spec.search")}
            className="h-10 text-sm"
          />
        </div>
        <div className="w-full sm:w-64">
          <Select
            value={innerCategoryId}
            onChange={(e) => setInnerCategoryId(e.target.value)}
            className="h-10 text-sm"
          >
            <option value="">{t("spec.filterByInnerCategory")}</option>
            {innerCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : definitions.length === 0 ? (
        <EmptyState title={t("spec.empty")} />
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head className="px-6 py-3">{t("form.name")}</Table.Head>
                <Table.Head className="px-6 py-3 text-right">
                  {t("common.actions")}
                </Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {definitions.map((item) => (
                <Table.Row
                  key={item.id}
                  className="cursor-pointer transition-colors hover:bg-canvas/60"
                  onClick={() => navigate(`/product-spec-definitions/${item.id}`)}
                >
                  <Table.Cell className="px-6 py-4 font-medium text-ink">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold hover:text-brand transition-colors">
                        {nameOf(item)}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="px-6 py-4 text-right">
                    <div
                      className="flex items-center justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(item)}
                        title={t("common.edit")}
                      >
                        <Edit2 className="h-4 w-4 text-muted" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleting(item)}
                        title={t("common.delete")}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/product-spec-definitions/${item.id}`)}
                        className="bg-brand-soft text-brand-dark hover:bg-brand hover:text-white"
                        title={t("spec.btn.openValues")}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      )}

      <ProductSpecDefinitionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        definition={editing}
        onSubmit={submitForm}
        pending={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t("spec.confirm.title")}
        description={
          deleting ? `${t("tags.confirm.desc")} "${nameOf(deleting)}"?` : undefined
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
