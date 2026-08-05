import { Pencil, Trash2 } from "lucide-react";

import { useT } from "@/i18n/useT";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { usePlural } from "@/i18n/usePlural";
import type { UnitView } from "../lib/units.helpers";

type UnitCardProps = {
  unit: UnitView;
  onEdit: (unit: UnitView) => void;
  onDelete: (unit: UnitView) => void;
};

export function UnitCard({ unit, onEdit, onDelete }: UnitCardProps) {
  const t = useT();
  const plural = usePlural();
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-bold text-ink">
            {unit.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted">{unit.city}</p>
        </div>
        <div className="flex items-center gap-1">
          <StatusBadge meta={unit.meta} />
          <button
            type="button"
            onClick={() => onEdit(unit)}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
            aria-label={"Редактировать " + unit.name}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(unit)}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={"Удалить " + unit.name}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">{t(unit.typeLabel)}</p>

      <p className="mt-1 text-sm text-muted">{plural(unit.staff, "plural.staff")}</p>
    </Card>
  );
}
