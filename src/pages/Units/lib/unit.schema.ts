import { z } from "zod";

export const unitSchema = z.object({
  nameTk: z.string().min(1, "err.required"),
  nameRu: z.string().min(1, "err.required"),
  shortName: z.string().min(1, "err.required"),
  isDefault: z.boolean(),
});

export type UnitFormValues = z.infer<typeof unitSchema>;
