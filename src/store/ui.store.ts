import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

/** Read the theme the pre-paint script (index.html) already resolved from
 *  storage / system, so the store's initial value matches the first paint. */
function initialTheme(): Theme {
  if (typeof document !== "undefined" && document.documentElement.dataset.theme === "dark") {
    return "dark";
  }
  return "light";
}

type UiState = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

/** Shell UI state. `theme` is persisted (`gm.ui`); `sidebarOpen` is ephemeral. */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebar: (open) => set({ sidebarOpen: open }),
      theme: initialTheme(),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "gm.ui", partialize: (s) => ({ theme: s.theme }) },
  ),
);
