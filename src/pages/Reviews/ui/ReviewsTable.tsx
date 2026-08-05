import { useT } from "@/i18n/useT";
import { StatusBadge } from "@/components/common/StatusBadge";
import { StatusMenu } from "@/components/common/StatusMenu";
import type { StatusOption } from "@/components/common/StatusMenu";
import type { ReviewRow } from "../lib/reviews.helpers";

type ReviewsTableProps = {
  rows: ReviewRow[];
  options: StatusOption[];
  onStatus: (id: number, st: string) => void;
};

export function ReviewsTable({ rows, options, onStatus }: ReviewsTableProps) {
  const t = useT();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("form.customer")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.product")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.rating")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.review")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.date")}</th>
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
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft font-display text-xs font-bold text-brand-dark">
                    {r.initials}
                  </span>
                  <span className="font-semibold text-ink">{r.author}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-ink">{r.product}</td>
              <td className="whitespace-nowrap px-5 py-3.5 text-[#e0a144]">{r.stars}</td>
              <td className="max-w-xs px-5 py-3.5">
                <div className="truncate text-muted">{r.text}</div>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-muted">{r.date}</td>
              <td className="px-5 py-3.5">
                <StatusBadge meta={r.meta} />
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end">
                  <StatusMenu
                    options={options}
                    value={r.st}
                    onSelect={(st) => onStatus(r.id, st)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
