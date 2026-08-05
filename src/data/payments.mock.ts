/**
 * Mock data layer for payments — ported from the prototype's data dictionary.
 * In production, feature APIs (services/*) would return this shape from a backend.
 */
import type { Payment, PaymentStatusKey } from "@/services/payments/payments.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const PAYMENT_STATUS: Record<PaymentStatusKey, StatusMeta> = {
  paid: { labelKey: "status.payment.paid", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  pending: { labelKey: "status.payment.pending", fg: "#a86a1f", bg: "#fbf1e2", dot: "#e0a144" },
  failed: { labelKey: "status.payment.failed", fg: "#b4453a", bg: "#fbecea", dot: "#e05a4a" },
  refund: { labelKey: "status.payment.refund", fg: "#6d7c74", bg: "#eef2f0", dot: "#9aa8a1" },
};

export const PAYMENTS: Payment[] = [
  {
    id: "PAY-88213",
    order: "№ GM-204817",
    method: "card",
    amount: 34500,
    date: "4 июл",
    st: "paid",
  },
  {
    id: "PAY-88212",
    order: "№ GM-204816",
    method: "transfer",
    amount: 4720,
    date: "4 июл",
    st: "pending",
  },
  {
    id: "PAY-88211",
    order: "№ GM-204815",
    method: "cash",
    amount: 11200,
    date: "3 июл",
    st: "paid",
  },
  {
    id: "PAY-88210",
    order: "№ GM-204814",
    method: "card",
    amount: 29800,
    date: "3 июл",
    st: "paid",
  },
  {
    id: "PAY-88209",
    order: "№ GM-204813",
    method: "card",
    amount: 12600,
    date: "3 июл",
    st: "failed",
  },
  {
    id: "PAY-88208",
    order: "№ GM-204812",
    method: "transfer",
    amount: 14100,
    date: "2 июл",
    st: "paid",
  },
  {
    id: "PAY-88207",
    order: "№ GM-204811",
    method: "cash",
    amount: 6300,
    date: "2 июл",
    st: "pending",
  },
  {
    id: "PAY-88206",
    order: "№ GM-204810",
    method: "card",
    amount: 5900,
    date: "1 июл",
    st: "paid",
  },
  {
    id: "PAY-88205",
    order: "№ GM-204809",
    method: "transfer",
    amount: 17800,
    date: "1 июл",
    st: "refund",
  },
  {
    id: "PAY-88204",
    order: "№ GM-204808",
    method: "card",
    amount: 28900,
    date: "30 июн",
    st: "failed",
  },
  {
    id: "PAY-88203",
    order: "№ GM-204807",
    method: "cash",
    amount: 6850,
    date: "30 июн",
    st: "paid",
  },
  {
    id: "PAY-88202",
    order: "№ GM-204806",
    method: "card",
    amount: 27900,
    date: "29 июн",
    st: "refund",
  },
];
