import type { RoleResponse } from "./roles.types";

export const MOCK_ROLES: RoleResponse[] = [
  {
    id: "clg1x0z5e0000v6l3f4b7j2k1",
    name: "Admin",
    created: "2026-08-04T07:21:46.538Z",
    permissions: [
      { permission: "orders", access: "write" },
      { permission: "clients", access: "write" },
      { permission: "products", access: "write" },
      { permission: "warehouses", access: "write" },
      { permission: "preOrders", access: "write" },
      { permission: "guarantees", access: "write" },
      { permission: "tradeIn", access: "write" },
      { permission: "promoCodes", access: "write" },
      { permission: "blog", access: "write" },
      { permission: "analytics", access: "write" },
      { permission: "marketing", access: "write" },
      { permission: "users", access: "write" },
    ],
  },
  {
    id: "clg1x0z5e0000v6l3f4b7j2k2",
    name: "Manager",
    created: "2026-08-04T07:25:00.000Z",
    permissions: [
      { permission: "orders", access: "write" },
      { permission: "clients", access: "readonly" },
      { permission: "products", access: "readonly" },
      { permission: "warehouses", access: "noAccess" },
      { permission: "preOrders", access: "write" },
      { permission: "guarantees", access: "readonly" },
      { permission: "tradeIn", access: "noAccess" },
      { permission: "promoCodes", access: "readonly" },
      { permission: "blog", access: "noAccess" },
      { permission: "analytics", access: "readonly" },
      { permission: "marketing", access: "noAccess" },
      { permission: "users", access: "noAccess" },
    ],
  },
];
