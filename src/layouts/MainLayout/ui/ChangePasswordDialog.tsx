import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { changePassword as changePasswordRequest } from "@/services/auth/auth.api";
import { useAuthStore } from "@/store/auth.store";

import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "../lib/changePassword.schema";

type ChangePasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EMPTY: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirm: "",
};

/** Self-service password change for the signed-in staff member. */
export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const t = useT();
  const setSession = useAuthStore((s) => s.setSession);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: EMPTY,
  });

  // Clear the fields each time the dialog opens.
  useEffect(() => {
    if (open) {
      reset(EMPTY);
      setFormError("");
    }
  }, [open, reset]);

  const mutation = useMutation({
    mutationFn: (values: ChangePasswordValues) =>
      changePasswordRequest(values.currentPassword, values.newPassword),
    onSuccess: (res) => {
      // Adopt the fresh token the backend issued after rotating sessions.
      setSession(res.user, res.token);
      onOpenChange(false);
    },
    onError: (err: Error) => setFormError(err.message),
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>{t("password.title")}</Dialog.Title>
        <Dialog.Description>{t("password.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => {
            setFormError("");
            mutation.mutate(values);
          })}
          className="mt-4 flex flex-col gap-3"
        >
          <Field
            label={t("password.current")}
            error={errors.currentPassword?.message ? t(errors.currentPassword.message as TKey) : undefined}
          >
            <Input
              type="password"
              autoComplete="current-password"
              invalid={!!errors.currentPassword}
              {...register("currentPassword")}
            />
          </Field>

          <Field
            label={t("password.new")}
            error={errors.newPassword?.message ? t(errors.newPassword.message as TKey) : undefined}
          >
            <Input
              type="password"
              autoComplete="new-password"
              placeholder={t("password.newPlaceholder")}
              invalid={!!errors.newPassword}
              {...register("newPassword")}
            />
          </Field>

          <Field
            label={t("password.confirm")}
            error={errors.confirm?.message ? t(errors.confirm.message as TKey) : undefined}
          >
            <Input
              type="password"
              autoComplete="new-password"
              invalid={!!errors.confirm}
              {...register("confirm")}
            />
          </Field>

          {formError ? (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span className="text-xs font-semibold text-red-700">
                {t(formError as TKey)}
              </span>
            </div>
          ) : null}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? t("common.saving") : t("password.submit")}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-ink/70">{label}</label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
