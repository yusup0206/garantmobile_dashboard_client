export type CatalogItem = {
  id: number;
  name: string;
  cat: string;
  price: number;
  stock: number;
};

import type { TKey } from "@/i18n/dict";

export type Category = {
  key: string;
  /** RU category name doubles as its i18n key. */
  label: TKey;
};
