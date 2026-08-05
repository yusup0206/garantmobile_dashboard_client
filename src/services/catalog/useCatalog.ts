import { useQuery } from "@tanstack/react-query";
import { getCatalog, getCategories } from "./catalog.api";

export const catalogKeys = {
  all: ["catalog"] as const,
  categories: ["catalog", "categories"] as const,
};

export function useCatalog() {
  return useQuery({ queryKey: catalogKeys.all, queryFn: getCatalog });
}

export function useCategories() {
  return useQuery({ queryKey: catalogKeys.categories, queryFn: getCategories });
}
