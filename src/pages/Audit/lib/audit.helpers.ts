import type { TKey } from "@/i18n/dict";
import type { AuditLog } from "@/services/audit/audit.types";

const ACTION_LABEL: Record<string, TKey> = {
  create: "audit.action.create",
  update: "audit.action.update",
  delete: "audit.action.delete",
};

export function actionLabel(action: string): TKey {
  return ACTION_LABEL[action] ?? "audit.action.update";
}

/** Tailwind classes for the action pill, by action. */
export function actionClass(action: string): string {
  if (action === "create") return "bg-emerald-50 text-emerald-700";
  if (action === "delete") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

/** Short local date + time for an audit row. */
export function fmtAuditDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Distinct resources present in the rows, sorted — for the filter select. */
export function resourceOptions(rows: AuditLog[]): string[] {
  return [...new Set(rows.map((r) => r.resource))].sort();
}

/** Case-insensitive match over staff, resource, object id and path. */
export function matches(row: AuditLog, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    row.staffName.toLowerCase().includes(q) ||
    row.resource.toLowerCase().includes(q) ||
    (row.resourceId ?? "").toLowerCase().includes(q) ||
    row.path.toLowerCase().includes(q)
  );
}
