import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { useT } from "@/i18n/useT";
import { Card } from "@/components/ui/Card";
import type { Unit } from "@/services/units/units.types";
import type { UnitView } from "../lib/units.helpers";

type UnitCardProps = {
  unit: UnitView;
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
};

export function UnitCard({ unit, onEdit, onDelete }: UnitCardProps) {
  const t = useT();
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-base font-bold text-ink">
              {unit.displayName}
            </h3>
            {unit.isDefault && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                {t("units.badge.default")}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted">
            TK: <span className="text-ink">{unit.nameTk}</span> • RU:{" "}
            <span className="text-ink">{unit.nameRu}</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(unit)}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
            aria-label={t("common.edit")}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(unit)}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={t("common.delete")}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2 text-xs text-muted">
        <span>{t("units.field.shortName")}:</span>
        <span className="font-semibold text-ink">{unit.shortName}</span>
      </div>
    </Card>
  );
}
