import { ShieldCheck, Truck, CreditCard, type LucideIcon } from "lucide-react";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";

const FEATURES: { icon: LucideIcon; labelKey: TKey }[] = [
  { icon: ShieldCheck, labelKey: "login.aside.f1" },
  { icon: Truck, labelKey: "login.aside.f2" },
  { icon: CreditCard, labelKey: "login.aside.f3" },
];

/** Brand panel shown alongside the login form on wide screens. */
export function LoginAside() {
  const t = useT();
  return (
    <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-linear-to-br from-brand-ink via-brand-dark to-[#082017] p-14 text-white lg:flex">
      <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-white/10 blur-2xl" />
      <div className="relative">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">
          {t("login.aside.badge")}
        </p>
        <h2 className="mt-4 max-w-md font-display text-3xl font-extrabold leading-tight">
          {t("login.aside.title")}
        </h2>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/70">
          {t("login.aside.text")}
        </p>
      </div>

      <div className="relative flex flex-wrap gap-6">
        {FEATURES.map(({ icon: Icon, labelKey }) => (
          <div key={labelKey} className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
              <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
            </span>
            <span className="max-w-[7rem] text-[13px] font-semibold text-white/85">
              {t(labelKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
