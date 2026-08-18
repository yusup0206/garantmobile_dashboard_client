import { Pencil, Trash2, Truck, Store, Clock, Hash, Percent } from "lucide-react";
import { useT } from "@/i18n/useT";
import { Table } from "@/components/ui/Table";
import type { DeliveryRow } from "../lib/delivery.helpers";

type DeliveryTableProps = {
  rows: DeliveryRow[];
  onEdit: (row: DeliveryRow) => void;
  onDelete: (row: DeliveryRow) => void;
};

export function DeliveryTable({ rows, onEdit, onDelete }: DeliveryTableProps) {
  const t = useT();

  return (
    <Table className="min-w-[800px]" containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>Название</Table.Head>
          <Table.Head>Тип</Table.Head>
          <Table.Head>Стоимость</Table.Head>
          <Table.Head>Срок доставки</Table.Head>
          <Table.Head>Скидка / Бесплатно от</Table.Head>
          <Table.Head>Порядок</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          <Table.Head className="text-right">{t("common.actions")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.id}>
            <Table.Cell className="max-w-xs">
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
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap">
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
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-display font-bold text-ink">
              {Number(r.price) === 0 ? "Бесплатно" : `${r.price} TMT`}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">
              {r.deliveryTime ? (
                <span className="inline-flex items-center gap-1 text-xs">
                  <Clock className="h-3.5 w-3.5 text-muted" />
                  {r.deliveryTime}
                </span>
              ) : (
                "—"
              )}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-xs text-muted">
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
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">
              <span className="inline-flex items-center gap-1 text-xs">
                <Hash className="h-3.5 w-3.5 text-muted/70" />
                {r.sortOrder ?? 0}
              </span>
            </Table.Cell>
            <Table.Cell>
              {String(r.isActive) === "true" || r.isActive === true ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  Активен
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  Неактивен
                </span>
              )}
            </Table.Cell>
            <Table.Cell>
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
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
