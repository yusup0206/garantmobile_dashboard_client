import type { FilterTab } from "@/components/common/FilterTabs";
import { TRADEIN_STATUS } from "@/data/tradein.mock";
import { money } from "@/lib/format";
import type { TradeinRequest } from "@/services/tradein/tradein.types";
import type { StatusMeta } from "@/components/common/StatusBadge";
import type { StatusOption } from "@/components/common/StatusMenu";

export type TradeinRow = TradeinRequest & {
  meta: StatusMeta;
  estimateFmt: string;
};

export function toRow(t: TradeinRequest): TradeinRow {
  return {
    ...t,
    meta: TRADEIN_STATUS[t.st],
    estimateFmt: money(t.estimate),
  };
}

export const STATUS_OPTIONS: StatusOption[] = (
  ["new", "review", "approved", "rejected"] as const
).map((key) => ({ key, meta: TRADEIN_STATUS[key] }));

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "new", label: "tradein.filter.new" },
  { key: "review", label: "tradein.filter.review" },
  { key: "approved", label: "tradein.filter.approved" },
  { key: "rejected", label: "tradein.filter.rejected" },
];
