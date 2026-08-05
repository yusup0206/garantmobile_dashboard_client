import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "./categories.api";
import type { CategoryInput } from "./categories.types";

export const categoriesKeys = {
  all: ["categories"] as const,
};

export function useCategories() {
  return useQuery({ queryKey: categoriesKeys.all, queryFn: getCategories });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CategoryInput) => createCategory(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKeys.all }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CategoryInput }) =>
      updateCategory(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKeys.all }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKeys.all }),
  });
}
