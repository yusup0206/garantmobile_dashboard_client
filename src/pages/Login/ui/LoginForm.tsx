import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { login as loginRequest } from "@/services/auth/auth.api";
import { useAuthStore } from "@/store/auth.store";

import { loginSchema } from "../lib/login.schema";
import { genCaptcha, captchaMatches } from "../lib/login.helpers";
import type { LoginFormValues } from "../types";

export function LoginForm() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);

  const [captcha, setCaptcha] = useState(genCaptcha);
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "", captcha: "" },
  });

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (res) => {
      setSession(res.user, res.token);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? "/dashboard", { replace: true });
    },
    onError: (err: Error) => setFormError(err.message),
  });

  function refreshCaptcha() {
    setCaptcha(genCaptcha());
    form.setValue("captcha", "");
    setFormError("");
  }

  function fillDemo() {
    form.setValue("login", "admin");
    form.setValue("password", "garant2026");
    form.setValue("captcha", captcha);
    setFormError("");
  }

  function onSubmit(values: LoginFormValues) {
    setFormError("");
    if (!captchaMatches(values.captcha, captcha)) {
      form.setError("captcha", { message: "login.err.captchaWrong" });
      refreshCaptcha();
      return;
    }
    mutation.mutate({ login: values.login, password: values.password });
  }

  const { errors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-ink/70">
          {t("login.loginLabel")}
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <Input
            {...form.register("login")}
            placeholder={t("login.loginPlaceholder")}
            autoComplete="username"
            invalid={!!errors.login}
            className="pl-11"
          />
        </div>
        {errors.login ? (
          <p className="text-xs text-red-600">{t(errors.login.message as TKey)}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-ink/70">
            {t("login.passwordLabel")}
          </label>
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-brand-dark hover:underline"
          >
            {t("login.forgot")}
          </Link>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <Input
            {...form.register("password")}
            type={showPw ? "text" : "password"}
            placeholder={t("login.passwordPlaceholder")}
            autoComplete="current-password"
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
          <p className="text-xs text-red-600">{t(errors.password.message as TKey)}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-ink/70">
          {t("login.captchaLabel")}
        </label>
        <div className="flex items-stretch gap-2.5">
          <div className="relative grid h-12 w-32 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-linear-to-br from-canvas to-brand-soft select-none">
            <span className="relative font-display text-2xl font-extrabold italic tracking-[0.28em] text-ink">
              {captcha}
            </span>
          </div>
          <button
            type="button"
            onClick={refreshCaptcha}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-canvas text-ink/70 transition-colors hover:bg-brand-soft"
            aria-label={t("login.refreshCaptcha")}
          >
            ↻
          </button>
          <Input
            {...form.register("captcha")}
            placeholder={t("login.captchaPlaceholder")}
            autoComplete="off"
            invalid={!!errors.captcha}
            className="uppercase tracking-widest"
          />
        </div>
        {errors.captcha ? (
          <p className="text-xs text-red-600">{t(errors.captcha.message as TKey)}</p>
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

      <Button type="submit" size="lg" disabled={mutation.isPending} className="mt-1">
        {mutation.isPending ? t("login.submitting") : t("login.submit")}
      </Button>

      <div className="mt-1 flex items-center gap-3 rounded-xl border border-dashed border-line bg-canvas px-3.5 py-3">
        <span className="rounded-md bg-brand-soft px-2 py-1 font-display text-[10px] font-bold tracking-wide text-brand-dark">
          {t("login.demoBadge")}
        </span>
        <p className="flex-1 text-[11px] leading-snug text-muted">
          {t("login.demoText")}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={fillDemo}>
          {t("login.fill")}
        </Button>
      </div>
    </form>
  );
}
