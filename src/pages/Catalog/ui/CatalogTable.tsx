import { useT } from "@/i18n/useT";
import { usePlural } from "@/i18n/usePlural";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Table } from "@/components/ui/Table";
import type { CatalogRow } from "../lib/catalog.helpers";

export function CatalogTable({ rows }: { rows: CatalogRow[] }) {
  const t = useT();
  const plural = usePlural();
  return (
    <Table className="min-w-[720px]" containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.product")}</Table.Head>
          <Table.Head>{t("form.category")}</Table.Head>
          <Table.Head className="text-right">{t("form.price")}</Table.Head>
          <Table.Head className="text-right">{t("form.stock")}</Table.Head>
          <Table.Head>{t("form.availability")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.id}>
            <Table.Cell className="font-semibold text-ink">{r.name}</Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">
              {t(r.categoryLabel)}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-display font-bold text-ink">
              {r.priceFmt}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right text-muted">
              {r.stock > 0 ? plural(r.stock, "plural.piece") : "—"}
            </Table.Cell>
            <Table.Cell>
              <StatusBadge meta={r.meta} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
