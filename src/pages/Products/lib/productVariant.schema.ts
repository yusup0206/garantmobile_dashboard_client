import { z } from "zod";

export const productVariantSchema = z.object({
  barcode: z.string().min(1, "Штрихкод обязателен"),
  price: z.coerce.number().min(0, "Цена должна быть ≥ 0"),
  oldPrice: z.coerce.number().min(0, "Старая цена должна быть ≥ 0"),
  stock: z.coerce.number().int().min(0, "Количество должно быть ≥ 0"),
  isActive: z.boolean(),
  photos: z.array(z.string()),
});

export type ProductVariantFormValues = z.infer<typeof productVariantSchema>;
