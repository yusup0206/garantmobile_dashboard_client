import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  discardHomeDraft,
  getHomeDraft,
  getHomeDraftStatus,
  getHomeLayout,
  publishHomeDraft,
  saveHomeDraft,
  saveHomeLayout,
} from "./home.api";
import type { HomeBlock } from "./home.types";

export const homeKeys = {
  all: ["home-layout"] as const,
  layout: ["home-layout", "layout"] as const,
  draft: ["home-layout", "draft"] as const,
  draftStatus: ["home-layout", "draft-status"] as const,
};

export function useHomeLayout() {
  return useQuery({ queryKey: homeKeys.layout, queryFn: getHomeLayout });
}

export function useSaveHomeLayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (blocks: HomeBlock[]) => saveHomeLayout(blocks),
    onSuccess: () => qc.invalidateQueries({ queryKey: homeKeys.all }),
  });
}

// --- Draft workflow ----------------------------------------------------------

/** The editor works on the draft (which falls back to the live layout). */
export function useHomeDraft() {
  return useQuery({ queryKey: homeKeys.draft, queryFn: getHomeDraft });
}

export function useHomeDraftStatus() {
  return useQuery({
    queryKey: homeKeys.draftStatus,
    queryFn: getHomeDraftStatus,
  });
}

export function useSaveHomeDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (blocks: HomeBlock[]) => saveHomeDraft(blocks),
    onSuccess: () => qc.invalidateQueries({ queryKey: homeKeys.all }),
  });
}

export function usePublishHome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => publishHomeDraft(),
    onSuccess: () => qc.invalidateQueries({ queryKey: homeKeys.all }),
  });
}

export function useDiscardHomeDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => discardHomeDraft(),
    onSuccess: () => qc.invalidateQueries({ queryKey: homeKeys.all }),
  });
}
