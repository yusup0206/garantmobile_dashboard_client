import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useT } from "@/i18n/useT";

import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { useAuditLogs } from "@/services/audit/useAudit";
import { useHasPermission } from "@/lib/permissions";

import { AuditTable } from "./ui/AuditTable";
import { matches, resourceOptions } from "./lib/audit.helpers";

const controlCls =
  "h-10 rounded-xl border border-line bg-canvas px-3 text-sm text-ink outline-none transition-colors focus:border-brand";

export default function AuditPage() {
  const t = useT();
  const canView = useHasPermission()("audit:read");
  const { data, isLoading, isError, refetch } = useAuditLogs({ limit: 200 });
  const [resource, setResource] = useState("");
  const [query, setQuery] = useState("");

  const all = useMemo(() => data ?? [], [data]);
  const options = useMemo(() => resourceOptions(all), [all]);
  const rows = useMemo(
    () =>
      all.filter((r) => (!resource || r.resource === resource) && matches(r, query)),
    [all, resource, query],
  );

  if (!canView) {
    return (
      <div>
        <PageHeader title={t("page.audit.title")} subtitle={t("page.audit.subtitle")} />
        <EmptyState title={t("audit.noAccess")} hint={t("audit.noAccessHint")} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t("page.audit.title")}
        subtitle={t("page.audit.subtitle")}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <select
              className={controlCls + " font-semibold"}
              value={resource}
              onChange={(e) => setResource(e.target.value)}
            >
              <option value="">{t("audit.filter.all")}</option>
              {options.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                className={controlCls + " w-56 pl-9"}
                placeholder={t("audit.search")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={t("audit.empty")}
          hint={resource || query ? t("audit.emptyHint") : undefined}
        />
      ) : (
        <AuditTable rows={rows} />
      )}
    </div>
  );
}
