export type AuditAction = "create" | "update" | "delete";

/** One audit row (backend AuditLogView). */
export type AuditLog = {
  id: number;
  staffUserId: number | null;
  staffName: string;
  action: string;
  resource: string;
  resourceId: string | null;
  method: string;
  path: string;
  statusCode: number;
  correlationId: string | null;
  date: string;
};

export type AuditQuery = { resource?: string; staffUserId?: number; limit?: number };
