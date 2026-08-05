import type { FilterTab } from "@/components/common/FilterTabs";
import type { TKey } from "@/i18n/dict";
import { PAYMENT_STATUS } from "@/data/payments.mock";
import { money } from "@/lib/format";
import type { Payment, PaymentMethod } from "@/services/payments/payments.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const METHOD_LABEL: Record<PaymentMethod, TKey> = {
  card: "Карта",
  cash: "Наличные",
  transfer: "Перевод",
};

export type PaymentRow = Payment & {
  meta: StatusMeta;
  methodLabel: TKey;
  amountFmt: string;
};

export function toRow(p: Payment): PaymentRow {
  return {
    ...p,
    meta: PAYMENT_STATUS[p.st],
    methodLabel: METHOD_LABEL[p.method],
    amountFmt: money(p.amount),
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "paid", label: "payments.filter.paid" },
  { key: "pending", label: "payments.filter.pending" },
  { key: "failed", label: "payments.filter.failed" },
  { key: "refund", label: "payments.filter.refund" },
];
