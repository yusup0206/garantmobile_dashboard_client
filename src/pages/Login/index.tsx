import { useT } from "@/i18n/useT";

import { LoginForm } from "./ui/LoginForm";
import { LoginAside } from "./ui/LoginAside";

export default function LoginPage() {
  const t = useT();
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1 items-center justify-center px-6 py-12 lg:flex-none lg:basis-[46%]">
        <div className="w-full max-w-sm">
          <div className="mb-7 flex flex-col items-center gap-3 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand font-display text-xl font-extrabold text-white">
              G
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold text-ink">
                {t("login.title")}
              </h1>
              <p className="mt-1.5 text-[13px] text-muted">{t("login.subtitle")}</p>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
      <LoginAside />
    </div>
  );
}
