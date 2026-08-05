import { useAuthStore } from "@/store/auth.store";

/** The current staff access token, for authenticated backend calls. */
export const authToken = (): string | undefined =>
  useAuthStore.getState().token ?? undefined;
