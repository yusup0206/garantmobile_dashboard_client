import { apiClient } from "@/services/api/apiClient";
import { authToken } from "@/services/api/authToken";
import type {
  Customer,
  GetCustomersParams,
  GetCustomersResponse,
} from "./customers.types";

const BASE = "/customer";

export async function getCustomers(
  params?: GetCustomersParams,
): Promise<GetCustomersResponse> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params?.search) qs.set("search", params.search);
  if (params?.filterType) qs.set("filterType", params.filterType);
  const query = qs.toString();
  const url = query ? `${BASE}/all?${query}` : `${BASE}/all`;
  return apiClient<GetCustomersResponse>(url, { token: authToken() });
}

export async function blockCustomer(customerId: string): Promise<void> {
  await apiClient<void>(`${BASE}/block/${customerId}`, {
    method: "POST",
    token: authToken(),
  });
}
