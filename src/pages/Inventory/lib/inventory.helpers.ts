import type { TKey } from "@/i18n/dict";
import type { StockMovementReason } from "@/services/inventory/inventory.types";

export const REASON_LABEL: Record<StockMovementReason, TKey> = {
  order_reserve: "inv.reason.order_reserve",
  order_release: "inv.reason.order_release",
  adjustment: "inv.reason.adjustment",
  restock: "inv.reason.restock",
};

/** Signed delta for display, e.g. "+5" / "−3" (true minus sign). */
export function fmtDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`;
}

/** Short local date + time for a ledger row. */
export function fmtMovementDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
