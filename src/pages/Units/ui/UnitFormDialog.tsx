import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { Unit, UnitInput, UnitKind, UnitStatus } from "@/services/units/units.types";
import { TYPE_LABEL, UNIT_STATUS } from "../lib/units.helpers";
import { unitSchema, type UnitFormValues } from "../lib/unit.schema";

type UnitFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this unit; otherwise it creates a new one. */
  unit?: Unit | null;
  onSubmit: (values: UnitInput) => void;
  pending?: boolean;
};

const KIND_ORDER: UnitKind[] = ["store", "warehouse", "service"];
const STATUS_ORDER: UnitStatus[] = ["open", "closed"];

const EMPTY: UnitFormValues = {
  name: "",
  city: "",
  kind: "store",
  staff: 0,
  st: "open",
};

export function UnitFormDialog({
  open,
  onOpenChange,
  unit,
  onSubmit,
  pending,
}: UnitFormDialogProps) {
  const t = useT();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: EMPTY,
  });

  // Reset the fields each time the dialog opens (add vs edit).
  useEffect(() => {
    if (!open) return;
    reset(
      unit
        ? {
            name: unit.name,
            city: unit.city,
            kind: unit.kind,
            staff: unit.staff,
            st: unit.st,
          }
        : EMPTY,
    );
  }, [open, unit, reset]);

  const kind = watch("kind");
  const st = watch("st");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {unit ? t("units.dialog.edit") : t("units.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("units.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex flex-col gap-3"
        >
          <Field label={t("form.name")} error={errors.name?.message ? t(errors.name?.message as TKey) : undefined}>
            <Input
              {...register("name")}
              invalid={!!errors.name}
              placeholder="Гарант Центр"
            />
          </Field>

          <Field label={t("form.city")} error={errors.city?.message ? t(errors.city?.message as TKey) : undefined}>
            <Input {...register("city")} invalid={!!errors.city} placeholder="Ашхабад" />
          </Field>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink/70">{t("form.type")}</label>
            <div className="inline-flex w-fit rounded-xl border border-line bg-canvas p-1">
              {KIND_ORDER.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue("kind", key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                    kind === key ? "bg-brand text-white" : "text-muted hover:text-ink",
                  )}
                >
                  {t(TYPE_LABEL[key])}
                </button>
              ))}
            </div>
          </div>

          <Field label={t("form.staffCount")} error={errors.staff?.message ? t(errors.staff?.message as TKey) : undefined}>
            <Input
              type="number"
              min={0}
              {...register("staff")}
              invalid={!!errors.staff}
            />
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
                  {t(UNIT_STATUS[key].labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : unit ? t("common.save") : t("common.add")}
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
