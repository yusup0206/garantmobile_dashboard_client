import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Lock, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { acceptInvite as acceptInviteRequest } from "@/services/auth/auth.api";
import { useAuthStore } from "@/store/auth.store";

import {
  acceptInviteSchema,
  type AcceptInviteValues,
} from "./lib/acceptInvite.schema";

/**
 * Public onboarding screen. A staff member opens the invite link they were
 * given, sets a first password, and is signed straight into the dashboard.
 */
export default function AcceptInvitePage() {
  const t = useT();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const setSession = useAuthStore((s) => s.setSession);

  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState("");

  const form = useForm<AcceptInviteValues>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: AcceptInviteValues) =>
      acceptInviteRequest(token, values.password),
    onSuccess: (res) => {
      setSession(res.user, res.token);
      navigate("/dashboard", { replace: true });
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const { errors } = form.formState;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-7 flex flex-col items-center gap-3 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand font-display text-xl font-extrabold text-white">
            G
          </span>
          <div>
            <h1 className="font-display text-xl font-extrabold text-ink">
              {t("accept.title")}
            </h1>
            <p className="mt-1.5 text-[13px] text-muted">{t("accept.subtitle")}</p>
          </div>
        </div>

        {!token ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <p className="text-sm font-semibold text-red-700">
              {t("accept.noToken")}
            </p>
            <Link
              to="/login"
              className="text-sm font-semibold text-brand-dark hover:underline"
            >
              {t("accept.backToLogin")}
            </Link>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit((values) => {
              setFormError("");
              mutation.mutate(values);
            })}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-ink/70">
                {t("accept.passwordLabel")}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                <Input
                  {...form.register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder={t("accept.passwordPlaceholder")}
                  autoComplete="new-password"
                  invalid={!!errors.password}
                  className="pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-faint hover:text-ink"
                  aria-label={showPw ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPw ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-red-600">
                  {t(errors.password.message as TKey)}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-ink/70">
                {t("accept.confirmLabel")}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                <Input
                  {...form.register("confirm")}
                  type={showPw ? "text" : "password"}
                  placeholder={t("accept.confirmPlaceholder")}
                  autoComplete="new-password"
                  invalid={!!errors.confirm}
                  className="pl-11"
                />
              </div>
              {errors.confirm ? (
                <p className="text-xs text-red-600">
                  {t(errors.confirm.message as TKey)}
                </p>
              ) : null}
            </div>

            {formError ? (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span className="text-xs font-semibold text-red-700">
                  {t(formError as TKey)}
                </span>
              </div>
            ) : null}

            <Button
              type="submit"
              size="lg"
              disabled={mutation.isPending}
              className="mt-1"
            >
              <ShieldCheck className="h-4 w-4" />
              {mutation.isPending ? t("accept.submitting") : t("accept.submit")}
            </Button>

            <Link
              to="/login"
              className="text-center text-xs font-semibold text-muted hover:text-ink"
            >
              {t("accept.backToLogin")}
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
