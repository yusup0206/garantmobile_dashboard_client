import { Pencil, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { usePlural } from "@/i18n/usePlural";
import type { Brand } from "@/services/brands/brands.types";
import type { BrandView } from "../lib/brands.helpers";

type BrandCardProps = {
  brand: BrandView;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
};

export function BrandCard({ brand, onEdit, onDelete }: BrandCardProps) {
  const plural = usePlural();
  return (
    <Card className="flex items-start gap-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-soft font-display text-sm font-bold text-brand-dark">
        {brand.initials}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-bold text-ink">
              {brand.name}
            </h3>
            <p className="mt-0.5 text-sm text-muted">{brand.country}</p>
          </div>
          <div className="flex items-center gap-1">
            <StatusBadge meta={brand.meta} />
            <button
              type="button"
              onClick={() => onEdit(brand)}
              className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
              aria-label={"Редактировать " + brand.name}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(brand)}
              className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={"Удалить " + brand.name}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mt-3 text-sm text-muted">
          {plural(brand.products, "plural.product")}
        </p>
      </div>
    </Card>
  );
}
