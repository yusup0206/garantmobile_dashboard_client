import { Pencil, Trash2 } from "lucide-react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { HeroSlideRow } from "../lib/heroSlides.helpers";

type HeroSlidesTableProps = {
  rows: HeroSlideRow[];
  onEdit: (row: HeroSlideRow) => void;
  onDelete: (row: HeroSlideRow) => void;
};

export function HeroSlidesTable({ rows, onEdit, onDelete }: HeroSlidesTableProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const nameOf = (r: HeroSlideRow) =>
    lang === "ru" ? r.title.ru : r.title.tm || r.title.ru;

  return (
    <Card className="p-0">
      <div className="px-5 pt-5">
        <CardHeader title={t("hero.table.title")} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-y border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-semibold">{t("hero.table.slide")}</th>
              <th className="px-5 py-3 text-right font-semibold">
                {t("hero.table.price")}
              </th>
              <th className="px-5 py-3 font-semibold">{t("hero.table.link")}</th>
              <th className="px-5 py-3 text-right font-semibold">
                {t("hero.table.order")}
              </th>
              <th className="px-5 py-3 font-semibold">{t("form.status")}</th>
              <th className="px-5 py-3 text-right font-semibold">
                {t("common.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-line last:border-0 hover:bg-canvas/40"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {r.img ? (
                      <img
                        src={r.img}
                        alt=""
                        className="h-9 w-14 shrink-0 rounded-md border border-line object-cover"
                      />
                    ) : (
                      <div className="h-9 w-14 shrink-0 rounded-md border border-line bg-canvas" />
                    )}
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-semibold text-ink">
                        {nameOf(r) || "—"}
                      </span>
                      {r.tag.ru ? (
                        <span className="truncate text-xs text-faint">{r.tag.ru}</span>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right text-muted">
                  {r.priceFmt}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                  {r.href || (r.productId ? `/product/${r.productId}` : "—")}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right text-muted">
                  {r.sortOrder}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge meta={r.meta} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(r)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
                      aria-label={"Редактировать " + nameOf(r)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(r)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={"Удалить " + nameOf(r)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
