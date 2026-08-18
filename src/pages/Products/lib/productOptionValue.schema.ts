import { z } from "zod";

export const productOptionValueSchema = z.object({
  valueRu: z.string().min(1, "Значение (RU) обязательно"),
  valueTm: z.string().min(1, "Значение (TM) обязательно"),
  hex: z.string().optional().default(""),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type ProductOptionValueFormValues = z.infer<typeof productOptionValueSchema>;
