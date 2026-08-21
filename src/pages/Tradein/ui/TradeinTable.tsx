import { useT } from "@/i18n/useT";
import { Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatusMenu, type StatusOption } from "@/components/common/StatusMenu";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import type { TradeinRow } from "../lib/tradein.helpers";

type TradeinTableProps = {
  rows: TradeinRow[];
  options: StatusOption[];
  onStatus: (id: string, st: string) => void;
  onDelete?: (row: TradeinRow) => void;
};

export function TradeinTable({ rows, options, onStatus, onDelete }: TradeinTableProps) {
  const t = useT();

  return (
    <Table className="min-w-[840px]" containerClassName="rounded-2xl border border-line bg-surface">
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-20">#</Table.Head>
          <Table.Head>{t("form.device")}</Table.Head>
          <Table.Head>{t("tradein.customer")}</Table.Head>
          <Table.Head>{t("tradein.condition")}</Table.Head>
          <Table.Head>{t("form.date")}</Table.Head>
          <Table.Head>{t("form.status")}</Table.Head>
          <Table.Head className="text-right">{t("common.actions")}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.id}>
            <Table.Cell className="whitespace-nowrap font-display font-bold text-ink">
              {r.seqDisplay}
            </Table.Cell>
            <Table.Cell className="max-w-xs">
              <div className="font-semibold text-ink">{r.displayDevice}</div>
              {r.brand && r.model && (
                <div className="text-xs text-muted">{r.brand}</div>
              )}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap">
              <div className="text-sm font-medium text-ink">{r.displayCustomer}</div>
              {r.displayPhone !== "-" && (
                <div className="text-xs text-muted">{r.displayPhone}</div>
              )}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap">
              {r.conditionMeta ? (
                <StatusBadge meta={r.conditionMeta} />
              ) : (
                <span className="text-sm text-muted">-</span>
              )}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap text-sm text-muted">
              {r.formattedDate}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap">
              <StatusBadge meta={r.statusMeta} />
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center justify-end gap-1.5">
                <StatusMenu
                  options={options}
                  value={r.statusKey}
                  onSelect={(st) => onStatus(r.id, st)}
                />
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted hover:text-red-600"
                    onClick={() => onDelete(r)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
