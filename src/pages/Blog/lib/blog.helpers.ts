import type { FilterTab } from "@/components/common/FilterTabs";
import { POST_STATUS } from "@/data/blog.mock";
import type { BlogPost } from "@/services/blog/blog.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export type BlogRow = BlogPost & {
  meta: StatusMeta;
};

export function toRow(p: BlogPost): BlogRow {
  return {
    ...p,
    meta: POST_STATUS[p.status] || POST_STATUS.draft,
  };
}

export const FILTER_TABS: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "published", label: "blog.filter.published" },
  { key: "draft", label: "blog.filter.draft" },
];
