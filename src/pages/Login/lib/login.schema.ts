import { z } from "zod";

/**
 * Admin login schema — phone number + password.
 * Phone must start with +993 followed by 8 digits (Turkmen format),
 * but we allow any non-empty phone for flexibility in demo mode.
 */
export const loginSchema = z.object({
  phone: z
    .string()
    .min(8, "login.err.phone")
    .regex(/^\+?[0-9\s\-()]{8,20}$/, "login.err.phoneFormat"),
  password: z.string().min(4, "login.err.password"),
  captcha: z.string().min(1, "login.err.captcha"),
});
