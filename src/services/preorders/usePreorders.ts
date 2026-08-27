import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  // Tags
  getPreorderTags,
  getPreorderTagById,
  createPreorderTag,
  updatePreorderTag,
  deletePreorderTag,
  // Preorders
  getPreordersList,
  getPreorderById,
  createPreorder,
  updatePreorder,
  deletePreorder,
  // Requests
  getPreorderRequests,
  approvePreorderRequest,
  rejectPreorderRequest,
} from "./preorders.api";
import type {
  GetPreorderTagsParams,
  PreorderTagInput,
  GetPreordersParams,
  PreorderInput,
  GetPreorderRequestsParams,
} from "./preorders.types";

export const preordersKeys = {
  all: ["preorders"] as const,
  // Tags
  tags: (params?: GetPreorderTagsParams) => ["preorders", "tags", params] as const,
  tagDetail: (id?: string) => ["preorders", "tags", "detail", id] as const,
  // List
  list: (params?: GetPreordersParams) => ["preorders", "list", params] as const,
  detail: (id?: string) => ["preorders", "detail", id] as const,
  // Requests
  requests: (params?: GetPreorderRequestsParams) => ["preorders", "requests", params] as const,
};

/* -------------------------------------------------------------------------- */
/*                                1. TAG HOOKS                                */
/* -------------------------------------------------------------------------- */

export function usePreorderTags(params?: GetPreorderTagsParams) {
  return useQuery({
    queryKey: preordersKeys.tags(params),
    queryFn: () => getPreorderTags(params),
  });
}

export function usePreorderTagDetail(id?: string, lang?: string) {
  return useQuery({
    queryKey: preordersKeys.tagDetail(id),
    queryFn: () => getPreorderTagById(id!, lang),
    enabled: !!id,
  });
}

export function useCreatePreorderTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, lang }: { input: PreorderTagInput; lang?: string }) =>
      createPreorderTag(input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["preorders", "tags"] }),
  });
}

export function useUpdatePreorderTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
      lang,
    }: {
      id: string;
      input: PreorderTagInput;
      lang?: string;
    }) => updatePreorderTag(id, input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["preorders", "tags"] }),
  });
}

export function useDeletePreorderTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) =>
      deletePreorderTag(id, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["preorders", "tags"] }),
  });
}

/* -------------------------------------------------------------------------- */
/*                             2. PREORDER HOOKS                              */
/* -------------------------------------------------------------------------- */

export function usePreordersList(params?: GetPreordersParams) {
  return useQuery({
    queryKey: preordersKeys.list(params),
    queryFn: () => getPreordersList(params),
  });
}

export function usePreorderDetail(id?: string, lang?: string) {
  return useQuery({
    queryKey: preordersKeys.detail(id),
    queryFn: () => getPreorderById(id!, lang),
    enabled: !!id,
  });
}

export function useCreatePreorder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, lang }: { input: PreorderInput; lang?: string }) =>
      createPreorder(input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["preorders", "list"] }),
  });
}

export function useUpdatePreorder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
      lang,
    }: {
      id: string;
      input: PreorderInput;
      lang?: string;
    }) => updatePreorder(id, input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["preorders", "list"] }),
  });
}

export function useDeletePreorder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) =>
      deletePreorder(id, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["preorders", "list"] }),
  });
}

/* -------------------------------------------------------------------------- */
/*                         3. PREORDER REQUEST HOOKS                          */
/* -------------------------------------------------------------------------- */

export function usePreorderRequests(params?: GetPreorderRequestsParams) {
  return useQuery({
    queryKey: preordersKeys.requests(params),
    queryFn: () => getPreorderRequests(params),
  });
}

export function useApprovePreorderRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) =>
      approvePreorderRequest(id, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["preorders", "requests"] }),
  });
}

export function useRejectPreorderRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) =>
      rejectPreorderRequest(id, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["preorders", "requests"] }),
  });
}

// Backward compatibility legacy hook (if any other part uses it)
export function usePreorders() {
  return usePreordersList();
}
