import { Pencil, Trash2, Home, Hash } from "lucide-react";

import { Card } from "@/components/ui/Card";
import type { Brand } from "@/services/brands/brands.types";
import type { BrandView } from "../lib/brands.helpers";

type BrandCardProps = {
  brand: BrandView;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
};

export function BrandCard({ brand, onEdit, onDelete }: BrandCardProps) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-4">
      <div className="flex items-start gap-3">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.name}
            className="h-12 w-12 shrink-0 rounded-xl object-contain p-1 border border-line bg-white"
          />
        ) : (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-soft font-display text-sm font-bold text-brand-dark">
            {brand.initials}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-display text-base font-bold text-ink">
              {brand.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
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

          {brand.description ? (
            <p className="mt-1 line-clamp-2 text-xs text-muted">
              {brand.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-line/60 pt-3 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <Hash className="h-3.5 w-3.5 text-muted/70" />
          <span>Порядок: {brand.sortOrder}</span>
        </div>

        {brand.homepageShow ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
            <Home className="h-3 w-3" />
            На главной
          </span>
        ) : (
          <span className="text-muted/60">Скрыт с главной</span>
        )}
      </div>

      {brand.tags && brand.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1 pt-1">
          {brand.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded bg-canvas p-1 px-1.5 text-[10px] font-medium text-muted border border-line/50"
            >
              {tag.nameRu || tag.nameTk}
            </span>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
