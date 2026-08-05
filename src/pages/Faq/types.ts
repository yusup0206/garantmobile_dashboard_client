import type { FaqEntry } from "@/services/faq/faq.types";

export type FaqGroup = {
  category: string;
  items: FaqEntry[];
};
