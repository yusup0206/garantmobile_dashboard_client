import type { FilterTab } from "@/components/common/FilterTabs";
import { REVIEW_STATUS } from "@/data/reviews.mock";
import { initials } from "@/lib/format";
import type { Review, ReviewRating, ReviewStatusKey } from "@/services/reviews/reviews.types";
import type { StatusMeta } from "@/components/common/StatusBadge";
import type { StatusOption } from "@/components/common/StatusMenu";

export { REVIEW_STATUS };

/** Statuses offered by the row-level moderation menu, in display order. */
export const STATUS_OPTIONS: StatusOption[] = (
  ["published", "pending", "rejected"] as const
).map((key) => ({ key, meta: REVIEW_STATUS[key] }));

export type ReviewRow = Review & {
  meta: StatusMeta;
  initials: string;
  stars: string;
  authorName: string;
  authorPhone: string;
  productName: string;
  formattedDate: string;
};

/** Filled + empty stars, e.g. rating 4 → "★★★★☆". */
export function stars(rating: ReviewRating): string {
  const rounded = Math.max(1, Math.min(5, Math.round(rating || 5)));
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

export function formatDate(isoString?: string): string {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export function toRow(r: Review, lang: "ru" | "tk" = "ru"): ReviewRow {
  const authorName = r.customer?.name || "—";
  const authorPhone = r.customer?.phone || "";
  const productName = (lang === "tk" ? r.product?.nameTk : r.product?.nameRu) || r.product?.nameRu || r.product?.nameTk || r.productId || "—";
  const statusKey: ReviewStatusKey = r.status || "pending";

  return {
    ...r,
    meta: REVIEW_STATUS[statusKey] || REVIEW_STATUS.pending,
    initials: initials(authorName || "C"),
    stars: stars(r.rating),
    authorName,
    authorPhone,
    productName,
    formattedDate: formatDate(r.created),
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "pending", label: "reviews.filter.pending" },
  { key: "published", label: "reviews.filter.published" },
  { key: "rejected", label: "reviews.filter.rejected" },
];

