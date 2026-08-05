import { z } from "zod";

export const adminSchema = z.object({
  name: z.string().min(2, "err.personNameMin2"),
  email: z.string().email("err.email"),
  role: z.enum(["admin", "manager", "support", "courier"]),
  st: z.enum(["active", "invited", "blocked"]),
});

export type AdminFormValues = z.infer<typeof adminSchema>;
