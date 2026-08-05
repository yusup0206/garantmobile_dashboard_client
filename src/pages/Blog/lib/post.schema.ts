import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(2, "err.titleMin2"),
  author: z.string().min(2, "blog.err.author"),
  date: z.string().min(1, "blog.err.date"),
  st: z.enum(["published", "draft", "scheduled"]),
});

export type PostFormValues = z.infer<typeof postSchema>;
