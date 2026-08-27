import { useState } from "react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { CheckCircle2, XCircle } from "lucide-react";

import { FilterTabs } from "@/components/common/FilterTabs";
import { SearchInput } from "@/components/common/SearchInput";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";

import {
  usePreorderRequests,
  useApprovePreorderRequest,
  useRejectPreorderRequest,
} from "@/services/preorders/usePreorders";
import type {
  PreorderRequestItem,
  PreorderRequestStatus,
} from "@/services/preorders/preorders.types";
import { PREORDER_STATUS } from "@/data/preorders.mock";
import { money } from "@/lib/format";
import type { FilterTab } from "@/components/common/FilterTabs";

const PAGE_SIZE = 10;

const REQUEST_FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "new", label: "preorders.filter.new" },
  { key: "prepay", label: "preorders.filter.prepay" },
  { key: "ready", label: "preorders.filter.ready" },
  { key: "done", label: "preorders.filter.done" },
  { key: "rejected", label: "preorders.filter.rejected" },
];

export function PreorderRequestsTab() {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = usePreorderRequests({
    page,
    pageSize: PAGE_SIZE,
    status: statusFilter === "all" ? undefined : (statusFilter as PreorderRequestStatus),
    search: search.trim() || undefined,
  });

  const approveMutation = useApprovePreorderRequest();
  const rejectMutation = useRejectPreorderRequest();

  const [approving, setApproving] = useState<PreorderRequestItem | null>(null);
  const [rejecting, setRejecting] = useState<PreorderRequestItem | null>(null);

  const requests = data?.preorderRequests ?? [];
  const total = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function confirmApprove() {
    if (!approving) return;
    approveMutation.mutate(
      { id: approving.id, lang },
      { onSuccess: () => setApproving(null) },
    );
  }

  function confirmReject() {
    if (!rejecting) return;
    rejectMutation.mutate(
      { id: rejecting.id, lang },
      { onSuccess: () => setRejecting(null) },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Unified Filter & Search Bar */}
      <Card className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <FilterTabs
          tabs={REQUEST_FILTER_TABS}
          value={statusFilter}
          onChange={(key) => {
            setStatusFilter(key);
            setPage(1);
          }}
        />

        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder={t("common.search")}
          className="w-full md:w-64"
        />
      </Card>

      {/* Content */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : requests.length === 0 ? (
        <EmptyState title={t("preorders.requests.empty")} />
      ) : (
        <>
          <Table className="min-w-[850px]" containerClassName="rounded-2xl border border-line bg-surface">
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-16">{t("preorders.requests.col.seq")}</Table.Head>
                <Table.Head>{t("preorders.requests.col.customer")}</Table.Head>
                <Table.Head>{t("preorders.requests.col.preorder")}</Table.Head>
                <Table.Head className="text-right">{t("preorders.requests.col.deposit")}</Table.Head>
                <Table.Head className="text-right">{t("preorders.requests.col.total")}</Table.Head>
                <Table.Head>{t("form.status")}</Table.Head>
                <Table.Head>{t("preorders.requests.col.created")}</Table.Head>
                <Table.Head className="text-right">{t("common.actions")}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {requests.map((req) => {
                const preorderTitle = req.preorder
                  ? lang === "tk"
                    ? req.preorder.titleTk || req.preorder.titleRu
                    : req.preorder.titleRu || req.preorder.titleTk
                  : req.preorderId;

                const statusMeta = PREORDER_STATUS[req.status] || PREORDER_STATUS.new;

                return (
                  <Table.Row key={req.id}>
                    <Table.Cell className="font-mono text-xs font-semibold text-muted">
                      #{req.seq || req.id.slice(0, 6)}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="font-semibold text-ink">
                        {req.customer?.name || t("form.customer")}
                      </div>
                      <div className="text-xs text-muted">
                        {req.customer?.phone || "—"}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="max-w-xs">
                      <div className="truncate font-medium text-ink">
                        {preorderTitle}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-right font-display font-semibold text-ink">
                      <div>{money(req.depositAmount)}</div>
                      {req.depositPercent ? (
                        <div className="text-xs text-muted">{req.depositPercent}%</div>
                      ) : null}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-right font-display font-bold text-ink">
                      {money(req.total)}
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge meta={statusMeta} />
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-xs text-muted">
                      {req.created ? req.created.split("T")[0] : "—"}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex justify-end gap-1">
                        {req.status === "new" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2.5 text-xs text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 border-emerald-200"
                              onClick={() => setApproving(req)}
                              title={t("preorders.requests.action.approve")}
                            >
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                              {t("preorders.requests.action.approve")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2.5 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-200"
                              onClick={() => setRejecting(req)}
                              title={t("preorders.requests.action.reject")}
                            >
                              <XCircle className="mr-1 h-3.5 w-3.5" />
                              {t("preorders.requests.action.reject")}
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-muted px-2 py-1">—</span>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>

          <Pagination
            page={page}
            pageCount={pageCount}
            total={total}
            pageSize={PAGE_SIZE}
            onPage={setPage}
          />
        </>
      )}

      {/* Approve Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(approving)}
        onOpenChange={(open) => {
          if (!open) setApproving(null);
        }}
        title={t("preorders.requests.confirm.approveTitle")}
        description={t("preorders.requests.confirm.approveDesc")}
        confirmLabel={t("preorders.requests.action.approve")}
        onConfirm={confirmApprove}
        pending={approveMutation.isPending}
      />

      {/* Reject Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(rejecting)}
        onOpenChange={(open) => {
          if (!open) setRejecting(null);
        }}
        title={t("preorders.requests.confirm.rejectTitle")}
        description={t("preorders.requests.confirm.rejectDesc")}
        confirmLabel={t("preorders.requests.action.reject")}
        onConfirm={confirmReject}
        pending={rejectMutation.isPending}
        danger
      />
    </div>
  );
}
