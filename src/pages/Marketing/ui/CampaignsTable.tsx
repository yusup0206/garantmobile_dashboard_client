import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { compact } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { CampaignRow } from "../lib/marketing.helpers";

export function CampaignsTable({ rows }: { rows: CampaignRow[] }) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  return (
    <Card className="p-0">
      <div className="px-5 pt-5">
        <CardHeader title={t("form.campaigns")} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-y border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-semibold">{t("form.campaign")}</th>
              <th className="px-5 py-3 font-semibold">{t("form.channel")}</th>
              <th className="px-5 py-3 font-semibold">{t("form.period")}</th>
              <th className="px-5 py-3 text-right font-semibold">{t("form.reach")}</th>
              <th className="px-5 py-3 font-semibold">{t("form.status")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-line last:border-0 hover:bg-canvas/40"
              >
                <td className="px-5 py-3.5 font-semibold text-ink">{r.name}</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                  {t(r.channelLabel)}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-muted">{r.period}</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right text-muted">
                  {r.reach > 0 ? compact(r.reach, lang) : "—"}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge meta={r.meta} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
