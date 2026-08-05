import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { POSTS } from "@/data/blog.mock";
import type { Post, PostInput } from "./blog.types";

/**
 * Blog API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: Post[] = POSTS.map((p) => ({ ...p }));
let nextId = Math.max(0, ...store.map((p) => p.id)) + 1;

export function getPosts(): Promise<Post[]> {
  if (isApiEnabled()) {
    return apiClient<Post[]>("/blog/posts", { token: authToken() });
  }
  return mockDelay(store.map((p) => ({ ...p })));
}

export function createPost(input: PostInput): Promise<Post> {
  if (isApiEnabled()) {
    return apiClient<Post>("/blog/posts", {
      method: "POST",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  const post: Post = { ...input, id: nextId++, views: 0 };
  store = [post, ...store];
  return mockDelay({ ...post });
}

export function updatePost(id: number, input: PostInput): Promise<Post> {
  if (isApiEnabled()) {
    return apiClient<Post>(`/blog/posts/${id}`, {
      method: "PUT",
      token: authToken(),
      body: JSON.stringify(input),
    });
  }
  store = store.map((p) => (p.id === id ? { ...input, id, views: p.views } : p));
  const updated = store.find((p) => p.id === id);
  if (!updated) throw new Error("error.notFound");
  return mockDelay({ ...updated });
}

export function deletePost(id: number): Promise<void> {
  if (isApiEnabled()) {
    return apiClient<void>(`/blog/posts/${id}`, {
      method: "DELETE",
      token: authToken(),
    });
  }
  store = store.filter((p) => p.id !== id);
  return mockDelay(undefined);
}

