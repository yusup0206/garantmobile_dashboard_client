export type StockMovementReason =
  "order_reserve" | "order_release" | "adjustment" | "restock";

/** One row of the stock ledger (backend StockMovementView). */
export type StockMovement = {
  id: number;
  productId: number;
  product: string;
  variantId: number | null;
  sku: string | null;
  delta: number;
  reason: StockMovementReason;
  orderNumber: string | null;
  note: string | null;
  staffUserId: number | null;
  date: string;
};

export type MovementsQuery = { productId?: number; variantId?: number; limit?: number };

/** Payload for a manual stock adjustment (POST /inventory/adjust). */
export type AdjustStockInput = {
  productId: number;
  variantId?: number;
  delta: number;
  reason?: "adjustment" | "restock";
  note?: string;
};
