import { z } from "zod";

export const promocodeSchema = z.object({
  code: z
    .string()
    .min(3, "promocodes.err.code")
    .transform((v) => v.toUpperCase()),
  kind: z.enum(["percent", "fixed"]),
  value: z.coerce.number().min(0, "promocodes.err.value"),
  limit: z.coerce
    .number()
    .int("err.int")
    .min(1, "promocodes.err.limit"),
  period: z.string().min(1, "err.period"),
  st: z.enum(["active", "scheduled", "expired"]),
});

export type PromocodeFormValues = z.infer<typeof promocodeSchema>;
