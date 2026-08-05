import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "err.nameMin2"),
  brand: z.string().min(1, "products.err.brand"),
  category: z.string().min(1, "products.err.category"),
  price: z.coerce.number().min(0, "products.err.price"),
  stock: z.coerce
    .number()
    .int("err.int")
    .min(0, "products.err.stock"),
  st: z.enum(["active", "draft", "archived"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
