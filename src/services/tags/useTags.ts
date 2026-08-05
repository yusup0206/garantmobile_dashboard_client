import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTag,
  deleteTag,
  getTagById,
  getTags,
  updateTag,
} from "./tags.api";
import type { TagInput, GetTagsParams } from "./tags.types";

export const tagsKeys = {
  all: ["tags"] as const,
  list: (params?: GetTagsParams) => ["tags", "list", params] as const,
  detail: (id: string, lang?: string) => ["tags", "detail", id, lang] as const,
};

export function useTags(params?: GetTagsParams) {
  return useQuery({
    queryKey: tagsKeys.list(params),
    queryFn: () => getTags(params),
  });
}

export function useTagDetail(id?: string, lang?: string) {
  return useQuery({
    queryKey: tagsKeys.detail(id ?? "", lang),
    queryFn: () => getTagById(id!, lang),
    enabled: !!id,
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, lang }: { input: TagInput; lang?: string }) =>
      createTag(input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagsKeys.all }),
  });
}

export function useUpdateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
      lang,
    }: {
      id: string;
      input: TagInput;
      lang?: string;
    }) => updateTag(id, input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagsKeys.all }),
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) => deleteTag(id, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagsKeys.all }),
  });
}
