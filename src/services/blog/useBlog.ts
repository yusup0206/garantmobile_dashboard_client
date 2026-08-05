import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, deletePost, getPosts, updatePost } from "./blog.api";
import type { PostInput } from "./blog.types";

export const blogKeys = {
  all: ["blog"] as const,
};

export function useBlog() {
  return useQuery({ queryKey: blogKeys.all, queryFn: getPosts });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PostInput) => createPost(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.all }),
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: PostInput }) =>
      updatePost(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.all }),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.all }),
  });
}
