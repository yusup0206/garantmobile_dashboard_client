import type { FilterTab } from "@/components/common/FilterTabs";
import { PREORDER_STATUS } from "@/data/preorders.mock";
import { money } from "@/lib/format";
import type { Preorder } from "@/services/preorders/preorders.types";
import type { StatusMeta } from "@/components/common/StatusBadge";
import type { StatusOption } from "@/components/common/StatusMenu";

export type PreorderRow = Preorder & {
  meta: StatusMeta;
  prepayFmt: string;
  totalFmt: string;
};

export function toRow(p: Preorder): PreorderRow {
  return {
    ...p,
    meta: PREORDER_STATUS[p.st],
    prepayFmt: money(p.prepay),
    totalFmt: money(p.total),
  };
}

export const STATUS_OPTIONS: StatusOption[] = (
  ["new", "prepay", "ready", "done"] as const
).map((key) => ({ key, meta: PREORDER_STATUS[key] }));

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "new", label: "preorders.filter.new" },
  { key: "prepay", label: "preorders.filter.prepay" },
  { key: "ready", label: "preorders.filter.ready" },
  { key: "done", label: "preorders.filter.done" },
];
