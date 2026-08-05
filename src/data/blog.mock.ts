import type { BlogPost, BlogStatus } from "@/services/blog/blog.types";
import type { StatusMeta } from "@/components/common/StatusBadge";

export const POST_STATUS: Record<BlogStatus, StatusMeta> = {
  published: { labelKey: "status.post.published", fg: "#1f6b49", bg: "#e9f4ee", dot: "#2f8b63" },
  draft: { labelKey: "status.post.draft", fg: "#6d7c74", bg: "#eef2f0", dot: "#9aa8a1" },
};

/** Formerly held mock posts array. Now empty. */
export const POSTS: BlogPost[] = [];
