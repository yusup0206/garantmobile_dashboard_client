import type { FilterTab } from "@/components/common/FilterTabs";
import { REVIEW_STATUS } from "@/data/reviews.mock";
import { initials } from "@/lib/format";
import type { Review, ReviewRating } from "@/services/reviews/reviews.types";
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
};

/** Filled + empty stars, e.g. rating 4 → "★★★★☆". */
export function stars(rating: ReviewRating): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function toRow(r: Review): ReviewRow {
  return {
    ...r,
    meta: REVIEW_STATUS[r.st],
    initials: initials(r.author),
    stars: stars(r.rating),
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "published", label: "reviews.filter.published" },
  { key: "pending", label: "reviews.filter.pending" },
  { key: "rejected", label: "reviews.filter.rejected" },
];
