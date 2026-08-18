import { env } from "@/config/env";

/**
 * Normalizes an image path/filename or URL to a fully qualified URL.
 * If the input is already a full URL (http://, https://, data:, blob:), it is returned as is.
 * Otherwise, it prepends the backend base URL (e.g. env.apiBaseUrl).
 */
export function getImageUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return "";

  const trimmed = pathOrUrl.trim();
  if (!trimmed) return "";

  // If already absolute URL or data/blob URL, return as-is
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  const baseUrl = (env.staticBaseUrl || env.apiBaseUrl).replace(/\/+$/, "");

  return `${baseUrl}/${cleanPath}`;
}
