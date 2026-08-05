import { z } from "zod";
import { loginSchema } from "./lib/login.schema";

export type LoginFormValues = z.infer<typeof loginSchema>;
