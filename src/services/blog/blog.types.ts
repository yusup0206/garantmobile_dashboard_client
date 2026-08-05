import type { BrandTag } from "@/services/brands/brands.types";

export type BlogStatus = "draft" | "published";

export type BlogPostTag = BrandTag;

export type BlogPost = {
  id: string;
  titleTk: string;
  descriptionTk: string;
  teaserTk: string;
  titleRu: string;
  descriptionRu: string;
  teaserRu: string;
  publishedAt: string;
  readingTime: number;
  cover: string;
  tagId?: string;
  status: BlogStatus;
  tag?: BlogPostTag;
};

export type CreateBlogPostDto = {
  titleTk: string;
  descriptionTk: string;
  teaserTk: string;
  titleRu: string;
  descriptionRu: string;
  teaserRu: string;
  publishedAt: string;
  readingTime: number;
  cover: string;
  tagId?: string;
  status: BlogStatus;
};

export type EditBlogPostDto = CreateBlogPostDto;

export type GetBlogParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  tagId?: string;
  status?: BlogStatus;
  lang?: string;
};

export type GetBlogResponse = {
  count: number;
  blogs: BlogPost[];
};

export type DeleteBlogResponse = {
  deleted: boolean;
};

/** Compatibility aliases for legacy names */
export type PostStatusKey = BlogStatus;
export type Post = BlogPost;
export type PostInput = CreateBlogPostDto;
