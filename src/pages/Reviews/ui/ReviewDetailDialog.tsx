import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { ReviewRow } from "../lib/reviews.helpers";
import type { ReviewStatusKey } from "@/services/reviews/reviews.types";
import { CheckCircle2, XCircle, Clock, User, Phone, Package, Calendar } from "lucide-react";

type ReviewDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: ReviewRow | null;
  onStatus: (id: string, status: ReviewStatusKey) => void;
  isUpdating?: boolean;
};

export function ReviewDetailDialog({
  open,
  onOpenChange,
  review,
  onStatus,
  isUpdating,
}: ReviewDetailDialogProps) {
  const t = useT();

  if (!review) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Header>
          <div className="flex items-center justify-between gap-4 pr-6">
            <Dialog.Title>{t("page.reviews.title")}</Dialog.Title>
            <StatusBadge meta={review.meta} />
          </div>
          <Dialog.Description className="sr-only">
            {review.authorName} - {review.productName}
          </Dialog.Description>
        </Dialog.Header>

        <div className="mt-4 space-y-4">
          {/* Customer & Product Info Grid */}
          <div className="grid grid-cols-1 gap-3 rounded-xl bg-canvas p-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft font-display text-xs font-bold text-brand-dark">
                {review.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <User className="h-3.5 w-3.5" />
                  <span>{t("form.customer")}</span>
                </div>
                <p className="truncate font-semibold text-ink">{review.authorName}</p>
                {review.authorPhone && (
                  <p className="flex items-center gap-1 text-xs text-muted">
                    <Phone className="h-3 w-3" />
                    <span>{review.authorPhone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Package className="h-3.5 w-3.5" />
                <span>{t("form.product")}</span>
              </div>
              <p className="line-clamp-2 font-medium text-ink">{review.productName}</p>
            </div>
          </div>

          {/* Rating & Date */}
          <div className="flex items-center justify-between border-b border-line pb-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#e0a144]">{review.stars}</span>
              <span className="text-xs text-muted">({review.rating} / 5)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Calendar className="h-3.5 w-3.5" />
              <span>{review.formattedDate}</span>
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
              {t("form.review")}
            </h4>
            <div className="rounded-xl border border-line bg-surface p-4 text-sm leading-relaxed text-ink shadow-inner whitespace-pre-wrap">
              {review.text || <span className="italic text-muted">—</span>}
            </div>
          </div>

          {/* Action Buttons for quick moderation */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-line">
            {review.status !== "published" && (
              <Button
                variant="primary"
                size="sm"
                disabled={isUpdating}
                onClick={() => onStatus(review.id, "published")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                {t("status.review.published")}
              </Button>
            )}

            {review.status !== "rejected" && (
              <Button
                variant="danger"
                size="sm"
                disabled={isUpdating}
                onClick={() => onStatus(review.id, "rejected")}
              >
                <XCircle className="mr-1.5 h-4 w-4" />
                {t("status.review.rejected")}
              </Button>
            )}

            {review.status !== "pending" && (
              <Button
                variant="secondary"
                size="sm"
                disabled={isUpdating}
                onClick={() => onStatus(review.id, "pending")}
              >
                <Clock className="mr-1.5 h-4 w-4" />
                {t("status.review.pending")}
              </Button>
            )}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
