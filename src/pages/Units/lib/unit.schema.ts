import { z } from "zod";

export const unitSchema = z.object({
  name: z.string().min(2, "err.nameMin2"),
  city: z.string().min(2, "units.err.city"),
  kind: z.enum(["store", "warehouse", "service"]),
  staff: z.coerce
    .number()
    .int("err.int")
    .min(0, "units.err.staff"),
  st: z.enum(["open", "closed"]),
});

export type UnitFormValues = z.infer<typeof unitSchema>;
