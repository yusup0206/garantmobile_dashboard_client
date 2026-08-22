import { z } from "zod";

export const productSpecValueSchema = z.object({
  valueRu: z.string().min(1, "Значение (RU) обязательно"),
  valueTk: z.string().min(1, "Значение (TK) обязательно"),
  sortOrder: z.coerce.number().int().min(0, "Порядок ≥ 0"),
});

export type ProductSpecValueFormValues = z.infer<
  typeof productSpecValueSchema
>;
