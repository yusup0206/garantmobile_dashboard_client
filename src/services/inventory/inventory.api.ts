import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type { AdjustStockInput, MovementsQuery, StockMovement } from "./inventory.types";

/**
 * Stock-movement ledger. With a real backend it reads the staff
 * /inventory/movements endpoint and posts adjustments; otherwise a small
 * in-memory demo ledger powers the page.
 */

const MOCK: StockMovement[] = [
  {
    id: 4,
    productId: 1,
    product: "iPhone 15 Pro Max 256 ГБ",
    variantId: 1,
    sku: "GM1000",
    delta: 5,
    reason: "restock",
    orderNumber: null,
    note: "Поставка от 15 июля",
    staffUserId: 1,
    date: "2026-07-15T09:20:00.000Z",
  },
  {
    id: 3,
    productId: 2,
    product: "Samsung Galaxy S24 Ultra 512 ГБ",
    variantId: 3,
    sku: "GM1010",
    delta: -1,
    reason: "order_reserve",
    orderNumber: "GM-204002",
    note: null,
    staffUserId: null,
    date: "2026-07-14T16:05:00.000Z",
  },
  {
    id: 2,
    productId: 1,
    product: "iPhone 15 Pro Max 256 ГБ",
    variantId: 2,
    sku: "GM1001",
    delta: -2,
    reason: "adjustment",
    orderNumber: null,
    note: "Списание витринного образца",
    staffUserId: 1,
    date: "2026-07-13T11:40:00.000Z",
  },
];

function buildQuery(query: MovementsQuery): string {
  const p = new URLSearchParams();
  if (query.productId != null) p.set("productId", String(query.productId));
  if (query.variantId != null) p.set("variantId", String(query.variantId));
  p.set("limit", String(query.limit ?? 100));
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function getMovements(query: MovementsQuery = {}): Promise<StockMovement[]> {
  if (isApiEnabled()) {
    return apiClient<StockMovement[]>(`/inventory/movements${buildQuery(query)}`, {
      token: authToken(),
    });
  }
  return mockDelay(MOCK.map((m) => ({ ...m })));
}

export function adjustStock(
  input: AdjustStockInput,
): Promise<{ productId: number; variantId: number | null; stock: number }> {
  if (isApiEnabled()) {
    return apiClient("/inventory/adjust", {
      method: "POST",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  return mockDelay({
    productId: input.productId,
    variantId: input.variantId ?? null,
    stock: 0,
  });
}
