import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { PAYMENTS } from "@/data/payments.mock";
import type { Payment } from "./payments.types";

export function getPayments(): Promise<Payment[]> {
  if (isApiEnabled()) {
    return apiClient<Payment[]>("/payments", { token: authToken() });
  }
  return mockDelay(PAYMENTS);
}

