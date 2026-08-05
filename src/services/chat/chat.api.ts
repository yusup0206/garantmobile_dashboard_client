import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { DIALOGS } from "@/data/chat.mock";
import type { Dialog } from "./chat.types";

export function getDialogs(): Promise<Dialog[]> {
  if (isApiEnabled()) {
    return apiClient<Dialog[]>("/chat/dialogs", { token: authToken() });
  }
  return mockDelay(DIALOGS);
}

