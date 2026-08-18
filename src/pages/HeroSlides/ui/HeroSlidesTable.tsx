import { Pencil, Trash2 } from "lucide-react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Table } from "@/components/ui/Table";
import { getImageUrl } from "@/lib/imageUrl";
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
    <Card className="p-0 overflow-hidden">
      <div className="px-5 pt-5">
        <CardHeader title={t("hero.table.title")} />
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>{t("hero.table.slide")}</Table.Head>
            <Table.Head className="text-right">{t("hero.table.price")}</Table.Head>
            <Table.Head>{t("hero.table.link")}</Table.Head>
            <Table.Head className="text-right">{t("hero.table.order")}</Table.Head>
            <Table.Head>{t("form.status")}</Table.Head>
            <Table.Head className="text-right">{t("common.actions")}</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((r) => (
            <Table.Row key={r.id}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  {r.img ? (
                    <img
                      src={getImageUrl(r.img)}
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
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-right text-muted">
                {r.priceFmt}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-muted">
                {r.href || (r.productId ? `/product/${r.productId}` : "—")}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-right text-muted">
                {r.sortOrder}
              </Table.Cell>
              <Table.Cell>
                <StatusBadge meta={r.meta} />
              </Table.Cell>
              <Table.Cell>
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
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
}
