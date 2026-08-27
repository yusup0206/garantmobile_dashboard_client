import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInnerCategory,
  deleteInnerCategory,
  getInnerCategoryById,
  getInnerCategories,
  updateInnerCategory,
} from "./innerCategories.api";
import type {
  GetInnerCategoriesParams,
  InnerCategoryInput,
} from "./innerCategories.types";

export const innerCategoriesKeys = {
  all: ["innerCategories"] as const,
  list: (params?: GetInnerCategoriesParams) =>
    ["innerCategories", "list", params] as const,
  detail: (id?: string) => ["innerCategories", "detail", id] as const,
};

export function useInnerCategories(params?: GetInnerCategoriesParams) {
  return useQuery({
    queryKey: innerCategoriesKeys.list(params),
    queryFn: () => getInnerCategories(params),
  });
}

export function useInnerCategoryDetail(id?: string, lang?: string) {
  return useQuery({
    queryKey: innerCategoriesKeys.detail(id),
    queryFn: () => getInnerCategoryById(id!, lang),
    enabled: !!id,
  });
}

export function useCreateInnerCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, lang }: { input: InnerCategoryInput; lang?: string }) =>
      createInnerCategory(input, lang),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: innerCategoriesKeys.all }),
  });
}

export function useUpdateInnerCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
      lang,
    }: {
      id: string;
      input: InnerCategoryInput;
      lang?: string;
    }) => updateInnerCategory(id, input, lang),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: innerCategoriesKeys.all }),
  });
}

export function useDeleteInnerCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) =>
      deleteInnerCategory(id, lang),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: innerCategoriesKeys.all }),
  });
}
