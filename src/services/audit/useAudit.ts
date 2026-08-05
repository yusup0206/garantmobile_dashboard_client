import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "./audit.api";
import type { AuditQuery } from "./audit.types";

export const auditKeys = {
  all: ["audit"] as const,
  list: (query: AuditQuery) => ["audit", query] as const,
};

export function useAuditLogs(query: AuditQuery = {}) {
  return useQuery({
    queryKey: auditKeys.list(query),
    queryFn: () => getAuditLogs(query),
  });
}
