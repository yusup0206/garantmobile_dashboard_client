import { z } from "zod";

export const productSpecSchema = z.object({
  specId: z.string().min(1, "Выберите спецификацию"),
  specValueId: z.string().min(1, "Выберите значение"),
  sortOrder: z.coerce.number().int().min(0, "Порядок ≥ 0"),
});

export type ProductSpecFormValues = z.infer<typeof productSpecSchema>;
