import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "err.nameMin2"),
  logo: z.string().optional().default(""),
  description: z.string().optional().default(""),
  homepageShow: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
