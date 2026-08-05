import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { forgotSchema, type ForgotFormValues } from "./lib/forgot.schema";

export default function ForgotPasswordPage() {
  const t = useT();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotFormValues) {
    // Demo: no backend — just show the confirmation state.
    setSentTo(values.email);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-7 flex flex-col items-center gap-3 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand font-display text-xl font-extrabold text-white">
            G
          </span>
          <div>
            <h1 className="font-display text-xl font-extrabold text-ink">
              {t("forgot.title")}
            </h1>
            <p className="mt-1.5 text-[13px] text-muted">{t("forgot.subtitle")}</p>
          </div>
        </div>

        {sentTo ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-canvas p-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-brand" strokeWidth={1.8} />
            <p className="text-sm text-ink">
              {t("forgot.sent")} <span className="font-semibold">{sentTo}</span>.
            </p>
            <p className="text-xs text-muted">{t("forgot.hint")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-ink/70">
                {t("forgot.emailLabel")}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="you@garantmobile.tm"
                  autoComplete="email"
                  invalid={!!errors.email}
                  className="pl-11"
                />
              </div>
              {errors.email ? (
                <p className="text-xs text-red-600">{t(errors.email.message as TKey)}</p>
              ) : null}
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {t("forgot.submit")}
            </Button>
          </form>
        )}

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-dark hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("forgot.back")}
        </Link>
      </div>
    </div>
  );
}
