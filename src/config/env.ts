type AppEnv = {
  apiBaseUrl: string;
  appName: string;
  /** Storefront origin, for opening the home-draft preview (optional). */
  storefrontUrl: string;
  /** Base URL for static/uploaded files (e.g. http://host/static). */
  staticBaseUrl: string;
};

function deriveStaticBaseUrl(apiBaseUrl: string): string {
  if (!apiBaseUrl) return "";
  // Remove trailing slash, then strip the last path segment (e.g. "/garant"), then append "/static"
  const withoutTrailingSlash = apiBaseUrl.replace(/\/+$/, "");
  const lastSlash = withoutTrailingSlash.lastIndexOf("/");
  // Only strip if there's a path segment beyond the host (i.e. not just "http://host")
  const origin =
    lastSlash > 7 // 7 = length of "http://"
      ? withoutTrailingSlash.slice(0, lastSlash)
      : withoutTrailingSlash;
  return `${origin}/static`;
}

export const env: AppEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  appName: import.meta.env.VITE_APP_NAME ?? "GarantMobile",
  storefrontUrl: import.meta.env.VITE_STOREFRONT_URL ?? "",
  staticBaseUrl:
    import.meta.env.VITE_STATIC_BASE_URL ??
    deriveStaticBaseUrl(import.meta.env.VITE_API_BASE_URL ?? ""),
};

if (!env.apiBaseUrl) {
  // In the mock build we tolerate an empty base URL; in production this must be set.
  console.warn("VITE_API_BASE_URL is not set — running against mock data.");
}

/** Real backend wired? When false, feature APIs fall back to the mock stores. */
export const isApiEnabled = (): boolean => env.apiBaseUrl.length > 0;
