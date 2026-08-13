import { useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { Plus, Search } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
  useUnits,
  useCreateUnit,
  useUpdateUnit,
  useDeleteUnit,
} from "@/services/units/useUnits";
import type { Unit, UnitInput } from "@/services/units/units.types";

import { UnitCard } from "./ui/UnitCard";
import { UnitFormDialog } from "./ui/UnitFormDialog";
import { toView } from "./lib/units.helpers";

export default function UnitsPage() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useUnits({ search, lang });
  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();
  const deleteUnit = useDeleteUnit();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Unit | null>(null);
  const [deleting, setDeleting] = useState<Unit | null>(null);

  const units = useMemo(
    () => (data?.units ?? []).map((u) => toView(u, lang)),
    [data?.units, lang],
  );

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(unit: Unit) {
    setEditing(unit);
    setFormOpen(true);
  }

  function submitForm(values: UnitInput) {
    if (editing) {
      updateUnit.mutate(
        { id: editing.id, input: values, lang },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createUnit.mutate(
        { input: values, lang },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteUnit.mutate(
      { id: deleting.id, lang },
      { onSuccess: () => setDeleting(null) },
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("page.units.title")}
        subtitle={t("page.units.subtitle")}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" />
            {t("common.add")}
          </Button>
        }
      />

      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted font-medium text-sm shrink-0">
          <Search className="h-4 w-4" />
          <span>Search:</span>
        </div>
        <div className="w-full sm:w-72">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search units…"
            className="h-10 text-sm"
          />
        </div>
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : units.length === 0 ? (
        <EmptyState title={t("units.empty")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {units.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <UnitFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        unit={editing}
        onSubmit={submitForm}
        pending={createUnit.isPending || updateUnit.isPending}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t("units.confirm.title")}
        description={
          deleting
            ? `«${deleting.nameRu || deleting.nameTk}» ${t("common.deleteWarnM")}`
            : undefined
        }
        confirmLabel={t("common.delete")}
        danger
        pending={deleteUnit.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
