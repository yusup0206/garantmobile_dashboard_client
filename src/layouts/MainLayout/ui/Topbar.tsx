import { Link } from "react-router-dom";
import { Bell, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useT } from "@/i18n/useT";
import { meta } from "@/data/meta";
import { DEMO_USER } from "@/data/auth.mock";

export function Topbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const t = useT();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="grid h-10 w-10 place-items-center rounded-xl text-muted transition-colors hover:bg-canvas hover:text-ink lg:hidden"
          aria-label={t("topbar.openMenu")}
        >
          <Menu className="h-5 w-5" strokeWidth={1.9} />
        </button>
        <div className="hidden text-sm font-medium text-muted sm:block">
          {meta.dateLabel}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="grid h-10 w-10 place-items-center rounded-xl text-muted transition-colors hover:bg-canvas hover:text-ink"
          aria-label={t("topbar.theme")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" strokeWidth={1.9} />
          ) : (
            <Moon className="h-5 w-5" strokeWidth={1.9} />
          )}
        </button>

        <LanguageSwitcher />

        <Link
          to="/notifications"
          className="relative grid h-10 w-10 place-items-center rounded-xl text-muted transition-colors hover:bg-canvas hover:text-ink"
          aria-label={t("topbar.notifications")}
        >
          <Bell className="h-5 w-5" strokeWidth={1.9} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand" />
        </Link>

        <div className="flex items-center gap-2.5 rounded-xl border border-line py-1.5 pl-1.5 pr-1.5 sm:pr-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-display text-xs font-bold text-white">
            {user?.initials ?? DEMO_USER.initials}
          </span>
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-semibold text-ink">
              {user?.name ?? DEMO_USER.name}
            </div>
            <div className="text-xs text-muted">{user?.role ?? DEMO_USER.role}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="grid h-10 w-10 place-items-center rounded-xl text-muted transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label={t("topbar.logout")}
        >
          <LogOut className="h-5 w-5" strokeWidth={1.9} />
        </button>
      </div>
    </header>
  );
}
