import { describe, it, expect } from "vitest";
import { actionLabel, matches, resourceOptions } from "./audit.helpers";
import type { AuditLog } from "@/services/audit/audit.types";

const row: AuditLog = {
  id: 1,
  staffUserId: 1,
  staffName: "Ага Мурадов",
  action: "update",
  resource: "orders",
  resourceId: "GM-204010",
  method: "PATCH",
  path: "/api/v1/orders/GM-204010/status",
  statusCode: 200,
  correlationId: null,
  date: "2026-07-17T09:41:00.000Z",
};

describe("actionLabel", () => {
  it("maps known actions and falls back to update", () => {
    expect(actionLabel("create")).toBe("audit.action.create");
    expect(actionLabel("delete")).toBe("audit.action.delete");
    expect(actionLabel("mystery")).toBe("audit.action.update");
  });
});

describe("resourceOptions", () => {
  it("returns sorted distinct resources", () => {
    const rows = [
      { ...row, id: 1, resource: "orders" },
      { ...row, id: 2, resource: "products" },
      { ...row, id: 3, resource: "orders" },
    ];
    expect(resourceOptions(rows)).toEqual(["orders", "products"]);
  });
});

describe("matches", () => {
  it("matches over staff, resource, object id and path; empty query matches all", () => {
    expect(matches(row, "")).toBe(true);
    expect(matches(row, "мурадов")).toBe(true);
    expect(matches(row, "GM-204010")).toBe(true);
    expect(matches(row, "orders")).toBe(true);
    expect(matches(row, "customers")).toBe(false);
  });
});
