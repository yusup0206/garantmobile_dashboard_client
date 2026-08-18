import { z } from "zod";

export const productOptionSchema = z.object({
  nameRu: z.string().min(1, "Название (RU) обязательно"),
  nameTm: z.string().min(1, "Название (TM) обязательно"),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type ProductOptionFormValues = z.infer<typeof productOptionSchema>;
