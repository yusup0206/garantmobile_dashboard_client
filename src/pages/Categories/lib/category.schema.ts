import { z } from "zod";

export const categorySchema = z.object({
  nameTk: z.string().min(2, "err.nameMin2"),
  nameRu: z.string().min(2, "err.nameMin2"),
  slug: z
    .string()
    .min(2, "categories.err.slug")
    .regex(/^[a-z0-9-]+$/, "categories.err.slugFormat"),
  icon: z.string().optional(),
  homepageShow: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
