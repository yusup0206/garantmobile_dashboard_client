type AppEnv = {
  apiBaseUrl: string;
  appName: string;
  /** Storefront origin, for opening the home-draft preview (optional). */
  storefrontUrl: string;
};

export const env: AppEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  appName: import.meta.env.VITE_APP_NAME ?? "GarantMobile",
  storefrontUrl: import.meta.env.VITE_STOREFRONT_URL ?? "",
};

if (!env.apiBaseUrl) {
  // In the mock build we tolerate an empty base URL; in production this must be set.
  console.warn("VITE_API_BASE_URL is not set — running against mock data.");
}

/** Real backend wired? When false, feature APIs fall back to the mock stores. */
export const isApiEnabled = (): boolean => env.apiBaseUrl.length > 0;
