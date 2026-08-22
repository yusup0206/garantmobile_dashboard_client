import { z } from "zod";

export const productSpecDefinitionSchema = z.object({
  nameRu: z.string().min(1, "Название (RU) обязательно"),
  nameTk: z.string().min(1, "Название (TK) обязательно"),
});

export type ProductSpecDefinitionFormValues = z.infer<
  typeof productSpecDefinitionSchema
>;
