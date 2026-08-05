import { z } from "zod";

/**
 * Change-password policy mirrors the backend: current password required, new one
 * at least 8 chars with a letter and a digit, confirmed, and actually different.
 * Messages are i18n key CODES.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "password.err.currentRequired"),
    newPassword: z
      .string()
      .min(8, "password.err.newShort")
      .regex(/[A-Za-z]/, "password.err.newWeak")
      .regex(/\d/, "password.err.newWeak"),
    confirm: z.string().min(1, "password.err.confirmRequired"),
  })
  .refine((v) => v.newPassword === v.confirm, {
    path: ["confirm"],
    message: "password.err.mismatch",
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ["newPassword"],
    message: "password.err.same",
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
