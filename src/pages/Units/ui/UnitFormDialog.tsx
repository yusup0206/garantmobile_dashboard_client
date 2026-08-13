import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Unit, UnitInput } from "@/services/units/units.types";
import { unitSchema, type UnitFormValues } from "../lib/unit.schema";

type UnitFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this unit; otherwise it creates a new one. */
  unit?: Unit | null;
  onSubmit: (values: UnitInput) => void;
  pending?: boolean;
};

const EMPTY: UnitFormValues = {
  nameTk: "",
  nameRu: "",
  shortName: "",
  isDefault: false,
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      unit
        ? {
            nameTk: unit.nameTk,
            nameRu: unit.nameRu,
            shortName: unit.shortName,
            isDefault: unit.isDefault ?? false,
          }
        : EMPTY,
    );
  }, [open, unit, reset]);

  const isDefault = watch("isDefault");

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
          <Field
            label={t("units.field.nameTk")}
            error={errors.nameTk?.message ? t(errors.nameTk.message as TKey) : undefined}
          >
            <Input
              {...register("nameTk")}
              invalid={!!errors.nameTk}
              placeholder="Sany"
            />
          </Field>

          <Field
            label={t("units.field.nameRu")}
            error={errors.nameRu?.message ? t(errors.nameRu.message as TKey) : undefined}
          >
            <Input
              {...register("nameRu")}
              invalid={!!errors.nameRu}
              placeholder="Штука"
            />
          </Field>

          <Field
            label={t("units.field.shortName")}
            error={errors.shortName?.message ? t(errors.shortName.message as TKey) : undefined}
          >
            <Input
              {...register("shortName")}
              invalid={!!errors.shortName}
              placeholder="шт"
            />
          </Field>

          <label className="mt-1 flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setValue("isDefault", e.target.checked)}
              className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
            />
            {t("units.field.isDefault")}
          </label>

          <div className="mt-4 flex justify-end gap-2">
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
