import { z } from "zod";

export const productSchema = z.object({
  nameRu: z.string().min(2, "err.nameMin2"),
  nameTk: z.string().min(2, "err.nameMin2"),
  shortRu: z.string().min(1, "err.required"),
  shortTk: z.string().min(1, "err.required"),
  price: z.coerce.number().min(0, "products.err.price"),
  oldPrice: z.coerce.number().min(0, "products.err.price"),
  stock: z.coerce.number().int("err.int").min(0, "products.err.stock"),
  brandId: z.string().min(1, "products.err.brand"),
  categoryId: z.string().min(1, "products.err.category"),
  unitId: z.string().min(1, "products.err.unit"),
  photos: z.array(z.string()).optional().default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
