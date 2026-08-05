export type PermissionName =
  | "orders"
  | "clients"
  | "products"
  | "warehouses"
  | "preOrders"
  | "guarantees"
  | "tradeIn"
  | "promoCodes"
  | "blog"
  | "analytics"
  | "marketing"
  | "users";

export type AccessLevel = "readonly" | "write" | "noAccess";

export type RolePermissionDto = {
  permission: PermissionName;
  access: AccessLevel;
};

export type RoleResponse = {
  id: string;
  name: string;
  created: string;
  permissions: RolePermissionDto[];
};

export type CreateRoleDto = {
  name: string;
  permissions: RolePermissionDto[];
};

export type EditRoleDto = CreateRoleDto;

export type DeleteRoleResponse = {
  deleted: boolean;
};

export const ALL_PERMISSIONS: PermissionName[] = [
  "orders",
  "clients",
  "products",
  "warehouses",
  "preOrders",
  "guarantees",
  "tradeIn",
  "promoCodes",
  "blog",
  "analytics",
  "marketing",
  "users",
];

export const ACCESS_LEVELS: AccessLevel[] = ["noAccess", "readonly", "write"];
