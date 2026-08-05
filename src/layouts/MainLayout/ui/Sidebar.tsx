import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/store/ui.store";
import { useT } from "@/i18n/useT";
import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const setSidebar = useUiStore((s) => s.setSidebar);
  const location = useLocation();
  const t = useT();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebar(false);
  }, [location.pathname, setSidebar]);

  return (
    <>
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
        <SidebarNav />
      </aside>

      {/* Mobile drawer */}
      <div className={cn("lg:hidden", sidebarOpen ? "" : "pointer-events-none")}>
        <div
          className={cn(
            "fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity",
            sidebarOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setSidebar(false)}
          aria-hidden="true"
        />
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85%] flex-col border-r border-line bg-surface px-4 py-6 transition-transform duration-200",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
          role="dialog"
          aria-label={t("common.navMenu")}
          aria-modal="true"
        >
          <SidebarNav onNavigate={() => setSidebar(false)} />
        </aside>
      </div>
    </>
  );
}
