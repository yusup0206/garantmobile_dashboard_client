import type { FilterTab } from "@/components/common/FilterTabs";
import type { TKey } from "@/i18n/dict";
import { TRADEIN_STATUS, TRADEIN_CONDITIONS } from "@/data/tradein.mock";
import type {
  TradeinItem,
  TradeinStatusKey,
  TradeinConditionKey,
} from "@/services/tradein/tradein.types";
import type { StatusMeta } from "@/components/common/StatusBadge";
import type { StatusOption } from "@/components/common/StatusMenu";

export type TradeinRow = TradeinItem & {
  statusKey: TradeinStatusKey;
  statusMeta: StatusMeta;
  conditionKey?: TradeinConditionKey;
  conditionMeta?: StatusMeta;
  displayDevice: string;
  displayCustomer: string;
  displayPhone: string;
  formattedDate: string;
  seqDisplay: string;
};

export function toRow(t: TradeinItem): TradeinRow {
  const statusKey = (t.status || t.st || "new") as TradeinStatusKey;
  const statusMeta = TRADEIN_STATUS[statusKey] ?? TRADEIN_STATUS.new;
  const condKey = (t.condition as TradeinConditionKey) || undefined;
  const conditionMeta = condKey ? TRADEIN_CONDITIONS[condKey] : undefined;

  let formattedDate = t.date || "-";
  if (t.created) {
    try {
      const d = new Date(t.created);
      formattedDate = d.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      formattedDate = t.created;
    }
  }

  const deviceName = [t.brand, t.model].filter(Boolean).join(" ") || t.device || "-";

  return {
    ...t,
    statusKey,
    statusMeta,
    conditionKey: condKey,
    conditionMeta,
    displayDevice: deviceName,
    displayCustomer: t.customerName || t.customer || "-",
    displayPhone: t.phone || "-",
    formattedDate,
    seqDisplay: t.seq !== undefined ? `#${t.seq}` : t.id.length > 8 ? `#${t.id.slice(-6)}` : t.id,
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

export const CONDITION_OPTIONS: { value: string; labelKey: TKey }[] = [
  { value: "all", labelKey: "tradein.condition.all" },
  { value: "excellent", labelKey: "tradein.condition.excellent" },
  { value: "good", labelKey: "tradein.condition.good" },
  { value: "fair", labelKey: "tradein.condition.fair" },
];
