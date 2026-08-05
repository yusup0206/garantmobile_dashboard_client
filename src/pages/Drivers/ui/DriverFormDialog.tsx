import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type {
  Driver,
  DriverInput,
  DriverStatusKey,
} from "@/services/drivers/drivers.types";
import { DRIVER_STATUS } from "../lib/drivers.helpers";
import { driverSchema, type DriverFormValues } from "../lib/driver.schema";

type DriverFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this driver; otherwise it creates a new one. */
  driver?: Driver | null;
  onSubmit: (values: DriverInput) => void;
  pending?: boolean;
};

const STATUS_ORDER: DriverStatusKey[] = ["online", "busy", "offline"];

const EMPTY: DriverFormValues = {
  name: "",
  phone: "",
  zone: "",
  st: "online",
};

export function DriverFormDialog({
  open,
  onOpenChange,
  driver,
  onSubmit,
  pending,
}: DriverFormDialogProps) {
  const t = useT();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: EMPTY,
  });

  // Reset the fields each time the dialog opens (add vs edit).
  useEffect(() => {
    if (!open) return;
    reset(
      driver
        ? {
            name: driver.name,
            phone: driver.phone,
            zone: driver.zone,
            st: driver.st,
          }
        : EMPTY,
    );
  }, [open, driver, reset]);

  const st = watch("st");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {driver ? t("drivers.dialog.edit") : t("drivers.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("drivers.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex flex-col gap-3"
        >
          <Field label={t("form.name2")} error={errors.name?.message ? t(errors.name?.message as TKey) : undefined}>
            <Input
              {...register("name")}
              invalid={!!errors.name}
              placeholder="Мерет Гулиев"
            />
          </Field>

          <Field label={t("form.phone")} error={errors.phone?.message ? t(errors.phone?.message as TKey) : undefined}>
            <Input
              {...register("phone")}
              invalid={!!errors.phone}
              placeholder="+993 61 234567"
            />
          </Field>

          <Field label={t("form.zone")} error={errors.zone?.message ? t(errors.zone?.message as TKey) : undefined}>
            <Input {...register("zone")} invalid={!!errors.zone} placeholder="Ашхабад" />
          </Field>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink/70">{t("form.status")}</label>
            <div className="inline-flex w-fit rounded-xl border border-line bg-canvas p-1">
              {STATUS_ORDER.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue("st", key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                    st === key ? "bg-brand text-white" : "text-muted hover:text-ink",
                  )}
                >
                  {t(DRIVER_STATUS[key].labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : driver ? t("common.save") : t("common.add")}
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
