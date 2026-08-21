import { Pencil, Trash2 } from "lucide-react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Table } from "@/components/ui/Table";
import { getImageUrl } from "@/lib/imageUrl";
import type { BannerRow } from "../lib/banners.helpers";

type BannersTableProps = {
  rows: BannerRow[];
  onEdit: (row: BannerRow) => void;
  onDelete: (row: BannerRow) => void;
};

export function BannersTable({ rows, onEdit, onDelete }: BannersTableProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const nameOf = (r: BannerRow) =>
    lang === "ru" ? r.titleRu || r.titleTk : r.titleTk || r.titleRu;
  const imgOf = (r: BannerRow) =>
    lang === "ru" ? r.imageRu || r.imageTk : r.imageTk || r.imageRu;

  return (
    <Table
      className="min-w-[800px]"
      containerClassName="rounded-2xl border border-line bg-surface"
    >
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.banner")}</Table.Head>
          <Table.Head>{t("form.placement")}</Table.Head>
          <Table.Head>{t("banners.form.linkType")}</Table.Head>
          <Table.Head>{t("banners.table.schedule")}</Table.Head>
          <Table.Head className="text-right">{t("banners.form.sortOrder")}</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          <Table.Head className="text-right">{t("common.actions")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => {
          const title = nameOf(r) || "—";
          const img = imgOf(r);
          return (
            <Table.Row key={r.id}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  {img ? (
                    <img
                      src={getImageUrl(img)}
                      alt=""
                      className="h-9 w-14 shrink-0 rounded-md border border-line object-cover"
                    />
                  ) : (
                    <div className="h-9 w-14 shrink-0 rounded-md border border-line bg-canvas" />
                  )}
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold text-ink">{title}</span>
                    {(r.subtitleRu || r.subtitleTk) && (
                      <span className="truncate text-xs text-muted">
                        {lang === "ru"
                          ? r.subtitleRu || r.subtitleTk
                          : r.subtitleTk || r.subtitleRu}
                      </span>
                    )}
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-muted">
                {r.placementLabel}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-muted">
                {r.linkTypeLabel}
                {r.linkId && (
                  <span className="ml-1 text-xs text-faint">#{r.linkId}</span>
                )}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-muted">
                {r.scheduleLabel}
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
                    aria-label={"Редактировать " + title}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(r)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={"Удалить " + title}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
