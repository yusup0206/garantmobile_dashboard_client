import { z } from "zod";

/**
 * Password policy mirrors the backend: at least 8 characters with a letter and
 * a digit, plus a confirmation that must match. Messages are i18n key CODES.
 */
export const acceptInviteSchema = z
  .object({
    password: z
      .string()
      .min(8, "accept.err.passwordShort")
      .regex(/[A-Za-z]/, "accept.err.passwordWeak")
      .regex(/\d/, "accept.err.passwordWeak"),
    confirm: z.string().min(1, "accept.err.confirmRequired"),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "accept.err.mismatch",
  });

export type AcceptInviteValues = z.infer<typeof acceptInviteSchema>;
