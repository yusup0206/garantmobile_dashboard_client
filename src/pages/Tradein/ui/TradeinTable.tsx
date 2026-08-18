import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatusMenu, type StatusOption } from "@/components/common/StatusMenu";
import { Table } from "@/components/ui/Table";
import type { TradeinRow } from "../lib/tradein.helpers";

type TradeinTableProps = {
  rows: TradeinRow[];
  options: StatusOption[];
  onStatus: (id: string, st: string) => void;
};

export function TradeinTable({ rows, options, onStatus }: TradeinTableProps) {
  const t = useT();
  return (
    <Table className="min-w-[720px]" containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head>{t("form.claim")}</Table.Head>
          <Table.Head>{t("form.device")}</Table.Head>
          <Table.Head>{t("form.customer")}</Table.Head>
          <Table.Head className="text-right">{t("form.rating")}</Table.Head>
          <Table.Head>{t("form.date")}</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          <Table.Head className="text-right">{t("common.actions")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.id}>
            <Table.Cell className="whitespace-nowrap font-display font-bold text-ink">
              {r.id}
            </Table.Cell>
            <Table.Cell className="max-w-xs">
              <div className="truncate text-ink">{r.device}</div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-ink">{r.customer}</Table.Cell>
            <Table.Cell className="whitespace-nowrap text-right font-display font-bold text-ink">
              {r.estimateFmt}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-muted">{r.date}</Table.Cell>
            <Table.Cell>
              <StatusBadge meta={r.meta} />
            </Table.Cell>
            <Table.Cell>
              <div className="flex justify-end">
                <StatusMenu
                  options={options}
                  value={r.st}
                  onSelect={(st) => onStatus(r.id, st)}
                />
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
