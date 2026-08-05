import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "err.nameMin2"),
  slug: z
    .string()
    .min(2, "categories.err.slug")
    .regex(/^[a-z0-9-]+$/, "categories.err.slugFormat"),
  st: z.enum(["active", "hidden"]),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
