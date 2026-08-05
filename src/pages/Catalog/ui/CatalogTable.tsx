import { useT } from "@/i18n/useT";
import { usePlural } from "@/i18n/usePlural";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { CatalogRow } from "../lib/catalog.helpers";

export function CatalogTable({ rows }: { rows: CatalogRow[] }) {
  const t = useT();
  const plural = usePlural();
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">{t("form.product")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.category")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("form.price")}</th>
            <th className="px-5 py-3 text-right font-semibold">{t("form.stock")}</th>
            <th className="px-5 py-3 font-semibold">{t("form.availability")}</th>
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
                {t(r.categoryLabel)}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right font-display font-bold text-ink">
                {r.priceFmt}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right text-muted">
                {r.stock > 0 ? plural(r.stock, "plural.piece") : "—"}
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge meta={r.meta} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
