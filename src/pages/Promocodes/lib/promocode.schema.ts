import { z } from "zod";

export const promocodeSchema = z.object({
  code: z
    .string()
    .min(3, "promocodes.err.code")
    .transform((v) => v.toUpperCase().trim()),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.coerce.number().min(0, "promocodes.err.value"),
  descriptionTk: z.string().min(1, "err.required"),
  descriptionRu: z.string().min(1, "err.required"),
  minOrderAmount: z.coerce.number().min(0),
  startsAt: z.string().min(1, "err.required"),
  expiresAt: z.string().min(1, "err.required"),
  usageLimit: z.coerce.number().int("err.int").min(1, "promocodes.err.limit"),
  isForNewClients: z.boolean(),
  isActive: z.boolean(),
});

export type PromocodeFormValues = z.infer<typeof promocodeSchema>;
