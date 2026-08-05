import type { FilterTab } from "@/components/common/FilterTabs";
import type { TKey } from "@/i18n/dict";
import { initials } from "@/lib/format";
import type { AdminUser, AdminStatus } from "@/services/users/users.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const ADMIN_STATUS: Record<AdminStatus, StatusMeta> = {
  active: { labelKey: "status.user.active", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  invited: { labelKey: "status.user.invited", fg: "#1f5f8b", bg: "#e6f1f8", dot: "#3b91d6" },
  blocked: { labelKey: "status.user.blocked", fg: "#b4453a", bg: "#fbecea", dot: "#e05a4a" },
};

export type AdminRow = AdminUser & {
  meta: StatusMeta;
  initials: string;
  roleNames: string;
};

export function toAdminRow(u: AdminUser): AdminRow {
  const roleNames = u.roles && u.roles.length > 0
    ? u.roles.map((r) => r.name).join(", ")
    : "—";

  return {
    ...u,
    meta: ADMIN_STATUS[u.status] || ADMIN_STATUS.active,
    initials: initials(u.name || u.email || "Admin"),
    roleNames,
  };
}

export type AdminRowAlias = AdminRow;
export const toRow = toAdminRow;

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "active", label: "users.filter.active" },
  { key: "invited", label: "users.filter.invited" },
  { key: "blocked", label: "users.filter.blocked" },
];
