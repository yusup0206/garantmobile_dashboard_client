import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "err.personNameMin2"),
  email: z.string().email("err.email"),
  role: z.enum(["admin", "manager", "support", "courier"]),
  st: z.enum(["active", "invited", "blocked"]),
});

export type UserFormValues = z.infer<typeof userSchema>;
