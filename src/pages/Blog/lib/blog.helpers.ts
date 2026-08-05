import type { FilterTab } from "@/components/common/FilterTabs";
import { POST_STATUS } from "@/data/blog.mock";
import type { Post } from "@/services/blog/blog.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export type BlogRow = Post & {
  meta: StatusMeta;
};

export function toRow(p: Post): BlogRow {
  return {
    ...p,
    meta: POST_STATUS[p.st],
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "published", label: "blog.filter.published" },
  { key: "draft", label: "blog.filter.draft" },
  { key: "scheduled", label: "blog.filter.scheduled" },
];
