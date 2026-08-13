import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "./categories.api";
import type { CategoryInput, GetCategoriesParams } from "./categories.types";

export const categoriesKeys = {
  all: ["categories"] as const,
  list: (params?: GetCategoriesParams) => ["categories", "list", params] as const,
};

export function useCategories(params?: GetCategoriesParams) {
  return useQuery({
    queryKey: categoriesKeys.list(params),
    queryFn: () => getCategories(params),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, lang }: { input: CategoryInput; lang?: string }) =>
      createCategory(input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKeys.all }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
      lang,
    }: {
      id: string;
      input: CategoryInput;
      lang?: string;
    }) => updateCategory(id, input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKeys.all }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) =>
      deleteCategory(id, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKeys.all }),
  });
}
