import { z } from "zod";

export const productSpecDefinitionSchema = z.object({
  nameRu: z.string().min(1, "Название (RU) обязательно"),
  nameTm: z.string().min(1, "Название (TM) обязательно"),
});

export type ProductSpecDefinitionFormValues = z.infer<
  typeof productSpecDefinitionSchema
>;
