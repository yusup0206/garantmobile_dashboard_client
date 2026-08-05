import { Pencil, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { usePlural } from "@/i18n/usePlural";
import type { CategoryView } from "../lib/categories.helpers";

type CategoryCardProps = {
  category: CategoryView;
  onEdit: (category: CategoryView) => void;
  onDelete: (category: CategoryView) => void;
};

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const plural = usePlural();
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-bold text-ink">{category.name}</h3>
        <div className="flex items-center gap-1">
          <StatusBadge meta={category.meta} />
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
            aria-label={"Редактировать " + category.name}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={"Удалить " + category.name}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-sm text-muted">{plural(category.products, "plural.product")}</p>
    </Card>
  );
}
