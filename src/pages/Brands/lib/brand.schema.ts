import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "err.nameMin2"),
  country: z.string().min(2, "brands.err.country"),
  st: z.enum(["active", "inactive"]),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
