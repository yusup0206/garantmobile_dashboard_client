import { apiClient, mockDelay } from "@/services/api/apiClient";
import { isApiEnabled } from "@/config/env";
import { authToken } from "@/services/api/authToken";
import { NOTIFICATIONS } from "@/data/notifications.mock";
import type { AppNotification } from "./notifications.types";

/**
 * Notifications API service. Uses apiClient when VITE_API_BASE_URL is configured,
 * otherwise falls back to in-memory mock data.
 */
let store: AppNotification[] = NOTIFICATIONS.map((n) => ({ ...n }));

export function getNotifications(): Promise<AppNotification[]> {
  if (isApiEnabled()) {
    return apiClient<AppNotification[]>("/notifications", { token: authToken() });
  }
  return mockDelay(store.map((n) => ({ ...n })));
}

export function markNotificationRead(id: number): Promise<void> {
  if (isApiEnabled()) {
    return apiClient<void>(`/notifications/${id}/read`, {
      method: "PATCH",
      token: authToken(),
    });
  }
  store = store.map((n) => (n.id === id ? { ...n, read: true } : n));
  return mockDelay(undefined, 150);
}

export function markAllNotificationsRead(): Promise<void> {
  if (isApiEnabled()) {
    return apiClient<void>("/notifications/read-all", {
      method: "POST",
      token: authToken(),
    });
  }
  store = store.map((n) => ({ ...n, read: true }));
  return mockDelay(undefined, 150);
}

