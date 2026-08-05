import { Pencil, Trash2, Truck, Store, Clock, Hash, Percent } from "lucide-react";
import { useT } from "@/i18n/useT";
import type { DeliveryRow } from "../lib/delivery.helpers";

type DeliveryTableProps = {
  rows: DeliveryRow[];
  onEdit: (row: DeliveryRow) => void;
  onDelete: (row: DeliveryRow) => void;
};

export function DeliveryTable({ rows, onEdit, onDelete }: DeliveryTableProps) {
  const t = useT();

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[800px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">Название</th>
            <th className="px-5 py-3 font-semibold">Тип</th>
            <th className="px-5 py-3 font-semibold">Стоимость</th>
            <th className="px-5 py-3 font-semibold">Срок доставки</th>
            <th className="px-5 py-3 font-semibold">Скидка / Бесплатно от</th>
            <th className="px-5 py-3 font-semibold">Порядок</th>
            <th className="px-5 py-3 font-semibold">{t("form.status")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("common.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-line last:border-0 hover:bg-canvas/40"
            >
              <td className="max-w-xs px-5 py-3.5">
                <div className="flex items-center gap-3">
                  {r.icon ? (
                    <img
                      src={r.icon}
                      alt={r.titleRu || r.titleTk}
                      className="h-9 w-9 shrink-0 rounded-lg object-contain p-1 border border-line bg-white"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      {r.isSelfPickup ? <Store className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-display font-bold text-ink">
                      {r.titleRu || r.titleTk}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {r.descriptionRu || r.descriptionTk || r.titleTk}
                    </p>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5">
                {String(r.isSelfPickup) === "true" || r.isSelfPickup === true ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 font-medium text-xs text-purple-700 border border-purple-200">
                    <Store className="h-3 w-3" />
                    Самовывоз
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 font-medium text-xs text-blue-700 border border-blue-200">
                    <Truck className="h-3 w-3" />
                    Доставка
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 font-display font-bold text-ink">
                {Number(r.price) === 0 ? "Бесплатно" : `${r.price} TMT`}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                {r.deliveryTime ? (
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Clock className="h-3.5 w-3.5 text-muted" />
                    {r.deliveryTime}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-xs text-muted">
                <div>
                  {r.discountForMethod > 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold">
                      <Percent className="h-3 w-3" />
                      Скидка {r.discountForMethod}%
                    </span>
                  ) : null}
                  {r.freeFrom ? (
                    <p className="text-muted">Бесплатно от: {r.freeFrom}</p>
                  ) : null}
                  {!r.discountForMethod && !r.freeFrom ? "—" : null}
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                <span className="inline-flex items-center gap-1 text-xs">
                  <Hash className="h-3.5 w-3.5 text-muted/70" />
                  {r.sortOrder ?? 0}
                </span>
              </td>
              <td className="px-5 py-3.5">
                {String(r.isActive) === "true" || r.isActive === true ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    Активен
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    Неактивен
                  </span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(r)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
                    aria-label={"Редактировать " + (r.titleRu || r.titleTk)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(r)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={"Удалить " + (r.titleRu || r.titleTk)}
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
  );
}
