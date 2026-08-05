import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllFaq,
  getFaqById,
  createFaq,
  editFaq,
  deleteFaq,
} from "./faq.api";
import type { GetFaqParams, CreateFaqDto, EditFaqDto } from "./faq.types";

export const faqKeys = {
  all: ["faq"] as const,
  list: (params?: GetFaqParams) => [...faqKeys.all, "list", params] as const,
  detail: (id: string) => [...faqKeys.all, "detail", id] as const,
};

export function useFaq(params?: GetFaqParams) {
  return useQuery({
    queryKey: faqKeys.list(params),
    queryFn: () => getAllFaq(params),
  });
}

export function useFaqDetail(id: string, lang?: string) {
  return useQuery({
    queryKey: faqKeys.detail(id),
    queryFn: () => getFaqById(id, lang),
    enabled: Boolean(id),
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, lang }: { data: CreateFaqDto; lang?: string }) =>
      createFaq(data, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.all });
    },
  });
}

export function useEditFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
      lang,
    }: {
      id: string;
      data: EditFaqDto;
      lang?: string;
    }) => editFaq(id, data, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.all });
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) =>
      deleteFaq(id, lang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.all });
    },
  });
}
