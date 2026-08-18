import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatusMenu } from "@/components/common/StatusMenu";
import type { StatusOption } from "@/components/common/StatusMenu";
import { Table } from "@/components/ui/Table";
import type { PreorderRow } from "../lib/preorders.helpers";

type PreordersTableProps = {
  rows: PreorderRow[];
  options: StatusOption[];
  onStatus: (num: string, st: string) => void;
};

export function PreordersTable({ rows, options, onStatus }: PreordersTableProps) {
  const t = useT();
  return (
    <Table className="min-w-[720px]" containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.preorder")}</Table.Head>
          <Table.Head>{t("form.product")}</Table.Head>
          <Table.Head>{t("form.customer")}</Table.Head>
          <Table.Head className="text-right">{t("form.prepay")}</Table.Head>
          <Table.Head className="text-right">{t("form.amount")}</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          <Table.Head className="text-right">{t("common.actions")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.num}>
            <Table.Cell className="whitespace-nowrap font-display font-bold text-ink">
              {r.num}
            </Table.Cell>
            <Table.Cell className="max-w-xs">
              <div className="truncate text-ink">{r.product}</div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-ink">{r.customer}</Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-display font-bold text-ink">
              {r.prepayFmt}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-display font-bold text-ink">
              {r.totalFmt}
            </Table.Cell>
            <Table.Cell>
              <StatusBadge meta={r.meta} />
            </Table.Cell>
            <Table.Cell>
              <div className="flex justify-end">
                <StatusMenu
                  options={options}
                  value={r.st}
                  onSelect={(st) => onStatus(r.num, st)}
                />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
