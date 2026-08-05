import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";
import { NAV_GROUPS } from "@/config/navigation";
import { useHasPermission } from "@/lib/permissions";
import { useT } from "@/i18n/useT";

/** Logo + grouped navigation, shared by the desktop rail and the mobile drawer. */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const t = useT();
  const can = useHasPermission();
  // Drop items the signed-in staff can't reach, then any group left empty.
  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || can(item.permission)),
  })).filter((group) => group.items.length > 0);
  return (
    <>
      <div className="mb-6 flex items-center gap-2 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-display text-base font-extrabold text-white">
          G
        </span>
        <span className="font-display text-lg font-extrabold text-ink">
          Garant<span className="font-semibold text-muted">mobile</span>
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
        {groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-faint">
              {t(group.title)}
            </p>
            {group.items.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-brand-soft text-brand-dark"
                      : "text-muted hover:bg-canvas hover:text-ink",
                  )
                }
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={1.9} />
                {t(label)}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </>
  );
}
