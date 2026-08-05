import type { AuthUser } from "@/services/auth/auth.types";

/** Demo session user returned by the mock login. Swap for the real /auth/me
 *  response when a backend exists. Name/role are sample data, not UI copy. */
export const DEMO_USER: AuthUser = {
  id: "u-1",
  name: "Ага Мурадов",
  role: "Менеджер по продажам",
  initials: "АМ",
};
