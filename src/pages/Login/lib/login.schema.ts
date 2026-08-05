import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().min(3, "login.err.login"),
  password: z.string().min(4, "login.err.password"),
  captcha: z.string().min(1, "login.err.captcha"),
});
