import { z } from "zod";

export const tagSchema = z.object({
  nameRu: z.string().min(2, "err.nameMin2"),
  nameTk: z.string().min(2, "err.nameMin2"),
  brandId: z.string().optional().default(""),
});

export type TagFormValues = z.infer<typeof tagSchema>;
