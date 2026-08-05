import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import type { AuditLog, AuditQuery } from "./audit.types";

/**
 * Staff audit trail. With a live backend it reads the admin-only
 * /audit-logs endpoint; otherwise a small in-memory demo trail powers the page.
 */

const MOCK: AuditLog[] = [
  {
    id: 5,
    staffUserId: 1,
    staffName: "Ага Мурадов",
    action: "update",
    resource: "orders",
    resourceId: "GM-204010",
    method: "PATCH",
    path: "/api/v1/orders/GM-204010/status",
    statusCode: 200,
    correlationId: "b2c1…",
    date: "2026-07-17T09:41:00.000Z",
  },
  {
    id: 4,
    staffUserId: 1,
    staffName: "Ага Мурадов",
    action: "create",
    resource: "products",
    resourceId: "42",
    method: "POST",
    path: "/api/v1/products",
    statusCode: 201,
    correlationId: "a1f0…",
    date: "2026-07-17T09:12:00.000Z",
  },
  {
    id: 3,
    staffUserId: 2,
    staffName: "Мерджен Аширова",
    action: "update",
    resource: "customers",
    resourceId: "1",
    method: "POST",
    path: "/api/v1/customers/1/bonus/adjust",
    statusCode: 201,
    correlationId: "9d3c…",
    date: "2026-07-16T15:30:00.000Z",
  },
  {
    id: 2,
    staffUserId: 2,
    staffName: "Мерджен Аширова",
    action: "delete",
    resource: "banners",
    resourceId: "7",
    method: "DELETE",
    path: "/api/v1/banners/7",
    statusCode: 200,
    correlationId: "7ab2…",
    date: "2026-07-16T11:02:00.000Z",
  },
];

function buildQuery(query: AuditQuery): string {
  const p = new URLSearchParams();
  if (query.resource) p.set("resource", query.resource);
  if (query.staffUserId != null) p.set("staffUserId", String(query.staffUserId));
  p.set("limit", String(query.limit ?? 200));
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function getAuditLogs(query: AuditQuery = {}): Promise<AuditLog[]> {
  if (isApiEnabled()) {
    return apiClient<AuditLog[]>(`/audit-logs${buildQuery(query)}`, {
      token: authToken(),
    });
  }
  const rows = query.resource
    ? MOCK.filter((m) => m.resource === query.resource)
    : MOCK;
  return mockDelay(rows.map((m) => ({ ...m })));
}
