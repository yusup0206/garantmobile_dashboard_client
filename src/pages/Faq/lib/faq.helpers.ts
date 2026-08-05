import type { FaqEntry } from "@/services/faq/faq.types";
import type { FaqGroup } from "../types";

/** Group entries (if category is present, or fallback group). */
export function groupByCategory(entries: FaqEntry[]): FaqGroup[] {
  return [
    {
      category: "FAQ",
      items: entries,
    },
  ];
}
