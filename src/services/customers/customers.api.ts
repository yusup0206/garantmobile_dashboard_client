import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { CUSTOMERS } from "@/data/customers.mock";
import type { AdjustBonusInput, BonusTxn, Customer } from "./customers.types";

/**
 * Customers directory. With a live backend it reads the staff `/customers`
 * endpoint and manages loyalty balances; otherwise the in-memory demo list
 * powers the page.
 */

export function getCustomers(): Promise<Customer[]> {
  if (isApiEnabled()) {
    return apiClient<Customer[]>("/customers", { token: authToken() });
  }
  return mockDelay(CUSTOMERS.map((c) => ({ ...c })));
}

export function getCustomerBonuses(id: number): Promise<BonusTxn[]> {
  if (isApiEnabled()) {
    return apiClient<BonusTxn[]>(`/customers/${id}/bonuses`, { token: authToken() });
  }
  return mockDelay([]);
}

export function adjustCustomerBonus(
  id: number,
  input: AdjustBonusInput,
): Promise<{ id: number; bonusBalance: number }> {
  if (isApiEnabled()) {
    return apiClient(`/customers/${id}/bonus/adjust`, {
      method: "POST",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  const current = CUSTOMERS.find((c) => c.id === id)?.bonusBalance ?? 0;
  return mockDelay({ id, bonusBalance: Math.max(0, current + input.delta) });
}
