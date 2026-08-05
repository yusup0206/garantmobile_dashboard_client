import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "./blog.api";
import type { CreateBlogPostDto, EditBlogPostDto, GetBlogParams } from "./blog.types";

export const blogKeys = {
  all: ["blog"] as const,
  list: (params?: GetBlogParams) => ["blog", "list", params] as const,
  detail: (id: string, lang?: string) => ["blog", "detail", id, lang] as const,
};

export function useBlog(params?: GetBlogParams) {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => getPosts(params),
  });
}

export function useBlogPostDetail(id?: string, lang?: string) {
  return useQuery({
    queryKey: blogKeys.detail(id ?? "", lang),
    queryFn: () => getPostById(id!, lang),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, lang }: { input: CreateBlogPostDto; lang?: string }) =>
      createPost(input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.all }),
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
      lang,
    }: {
      id: string;
      input: EditBlogPostDto;
      lang?: string;
    }) => updatePost(id, input, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.all }),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lang }: { id: string; lang?: string }) => deletePost(id, lang),
    onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.all }),
  });
}
