import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHomeBlock,
  deleteHomeBlock,
  getHomeBlockById,
  getHomeBlocks,
  reorderHomeBlocks,
  updateHomeBlock,
} from "./home.api";
import type {
  CreateHomeBlockInput,
  GetHomeBlocksParams,
  UpdateHomeBlockInput,
} from "./home.types";

export const homeKeys = {
  all: ["home-blocks"] as const,
  list: (params?: GetHomeBlocksParams) => ["home-blocks", "list", params] as const,
  detail: (id?: string) => ["home-blocks", "detail", id] as const,
};

export function useHomeBlocks(params?: GetHomeBlocksParams) {
  return useQuery({
    queryKey: homeKeys.list(params),
    queryFn: () => getHomeBlocks(params),
  });
}

export function useHomeBlockDetail(id?: string) {
  return useQuery({
    queryKey: homeKeys.detail(id),
    queryFn: () => getHomeBlockById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateHomeBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateHomeBlockInput) => createHomeBlock(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: homeKeys.all }),
  });
}

export function useUpdateHomeBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateHomeBlockInput }) =>
      updateHomeBlock(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: homeKeys.all }),
  });
}

export function useReorderHomeBlocks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (blockIds: string[]) => reorderHomeBlocks(blockIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: homeKeys.all }),
  });
}

export function useDeleteHomeBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHomeBlock(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: homeKeys.all }),
  });
}
