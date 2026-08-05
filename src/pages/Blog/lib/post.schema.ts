import { z } from "zod";

export const postSchema = z.object({
  titleRu: z.string().min(2, "err.titleMin2"),
  titleTk: z.string().min(2, "err.titleMin2"),
  teaserRu: z.string().optional().default(""),
  teaserTk: z.string().optional().default(""),
  descriptionRu: z.string().optional().default(""),
  descriptionTk: z.string().optional().default(""),
  publishedAt: z.string().default(() => new Date().toISOString()),
  readingTime: z.coerce.number().int().min(0).default(0),
  cover: z.string().optional().default(""),
  tagId: z.string().optional().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type PostFormValues = z.infer<typeof postSchema>;
