import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { compact } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Table } from "@/components/ui/Table";
import type { CampaignRow } from "../lib/marketing.helpers";

export function CampaignsTable({ rows }: { rows: CampaignRow[] }) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-5 pt-5">
        <CardHeader title={t("form.campaigns")} />
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>{t("form.campaign")}</Table.Head>
            <Table.Head>{t("form.channel")}</Table.Head>
            <Table.Head>{t("form.period")}</Table.Head>
            <Table.Head className="text-right">{t("form.reach")}</Table.Head>
            <Table.Head>{t("form.status")}</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((r) => (
            <Table.Row key={r.id}>
              <Table.Cell className="font-semibold text-ink">{r.name}</Table.Cell>
              <Table.Cell className="whitespace-nowrap text-muted">
                {t(r.channelLabel)}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-muted">{r.period}</Table.Cell>
              <Table.Cell className="whitespace-nowrap text-right text-muted">
                {r.reach > 0 ? compact(r.reach, lang) : "—"}
              </Table.Cell>
              <Table.Cell>
                <StatusBadge meta={r.meta} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Card>
  );
}
