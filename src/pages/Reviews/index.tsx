import { useState } from "react";
import { useT } from "@/i18n/useT";
import { useSearchParams } from "react-router-dom";
import { useLangStore } from "@/store/i18n.store";

import { PageHeader } from "@/components/common/PageHeader";
import { FilterTabs } from "@/components/common/FilterTabs";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { Card } from "@/components/ui/Card";
import { useReviews, useUpdateReviewStatus } from "@/services/reviews/useReviews";
import type { ReviewStatusKey } from "@/services/reviews/reviews.types";

import { ReviewsTable } from "./ui/ReviewsTable";
import { ReviewDetailDialog } from "./ui/ReviewDetailDialog";
import { toRow, FILTER_TABS, STATUS_OPTIONS, type ReviewRow } from "./lib/reviews.helpers";

const PAGE_SIZE = 10;

export default function ReviewsPage() {
  const t = useT();
  const currentLang = useLangStore((s) => s.lang);

  // URL state: /reviews?status=pending&page=1
  const [params, setParams] = useSearchParams();
  const rawStatus = params.get("status");
  const statusFilter: ReviewStatusKey | undefined =
    rawStatus === "published" || rawStatus === "pending" || rawStatus === "rejected"
      ? (rawStatus as ReviewStatusKey)
      : undefined;

  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);

  const { data, isLoading, isError, refetch } = useReviews({
    page,
    pageSize: PAGE_SIZE,
    status: statusFilter,
  });

  const updateStatus = useUpdateReviewStatus();

  const [selectedReview, setSelectedReview] = useState<ReviewRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const total = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rows = (data?.reviews ?? []).map((r) => toRow(r, currentLang === "tk" ? "tk" : "ru"));

  function handleFilterChange(key: string) {
    const next = new URLSearchParams(params);
    if (key === "all") {
      next.delete("status");
    } else {
      next.set("status", key);
    }
    next.delete("page");
    setParams(next, { replace: true });
  }

  function handlePageChange(nextPage: number) {
    const next = new URLSearchParams(params);
    if (nextPage <= 1) {
      next.delete("page");
    } else {
      next.set("page", String(nextPage));
    }
    setParams(next, { replace: true });
  }

  function handleViewReview(review: ReviewRow) {
    setSelectedReview(review);
    setDetailOpen(true);
  }

  function handleStatusChange(id: string, newStatus: ReviewStatusKey) {
    updateStatus.mutate(
      { id, status: newStatus },
      {
        onSuccess: (updated) => {
          if (selectedReview && selectedReview.id === id) {
            setSelectedReview(toRow(updated, currentLang === "tk" ? "tk" : "ru"));
          }
        },
      },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("page.reviews.title")}
        subtitle={t("page.reviews.subtitle")}
      />

      {/* Filter Tabs Card */}
      <Card className="p-2 sm:p-3">
        <FilterTabs
          tabs={FILTER_TABS}
          value={statusFilter ?? "all"}
          onChange={handleFilterChange}
        />
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={t("reviews.empty")}
          subtitle={t("common.empty")}
        />
      ) : (
        <>
          <ReviewsTable
            rows={rows}
            options={STATUS_OPTIONS}
            onStatus={handleStatusChange}
            onView={handleViewReview}
          />
          <Pagination
            page={page}
            pageCount={pageCount}
            total={total}
            pageSize={PAGE_SIZE}
            onPage={handlePageChange}
          />
        </>
      )}

      <ReviewDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        review={selectedReview}
        onStatus={handleStatusChange}
        isUpdating={updateStatus.isPending}
      />
    </div>
  );
}

