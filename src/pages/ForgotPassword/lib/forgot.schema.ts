import { z } from "zod";

export const forgotSchema = z.object({
  email: z.string().min(1, "forgot.err.email").email("err.email"),
});

export type ForgotFormValues = z.infer<typeof forgotSchema>;
