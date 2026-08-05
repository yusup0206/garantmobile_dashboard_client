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
  Promocode,
  PromocodeInput,
  PromoStatusKey,
} from "@/services/promocodes/promocodes.types";
import { PROMO_STATUS } from "../lib/promocodes.helpers";
import { promocodeSchema, type PromocodeFormValues } from "../lib/promocode.schema";

type PromocodeFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this promocode; otherwise it creates a new one. */
  promocode?: Promocode | null;
  onSubmit: (values: PromocodeInput) => void;
  pending?: boolean;
};

const KIND_ORDER: { key: "percent" | "fixed"; label: TKey }[] = [
  { key: "percent", label: "form.percent" },
  { key: "fixed", label: "form.amount" },
];

const STATUS_ORDER: PromoStatusKey[] = ["active", "scheduled", "expired"];

const EMPTY: PromocodeFormValues = {
  code: "",
  kind: "percent",
  value: 0,
  limit: 1,
  period: "",
  st: "active",
};

export function PromocodeFormDialog({
  open,
  onOpenChange,
  promocode,
  onSubmit,
  pending,
}: PromocodeFormDialogProps) {
  const t = useT();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PromocodeFormValues>({
    resolver: zodResolver(promocodeSchema),
    defaultValues: EMPTY,
  });

  // Reset the fields each time the dialog opens (add vs edit).
  useEffect(() => {
    if (!open) return;
    reset(
      promocode
        ? {
            code: promocode.code,
            kind: promocode.kind,
            value: promocode.value,
            limit: promocode.limit,
            period: promocode.period,
            st: promocode.st,
          }
        : EMPTY,
    );
  }, [open, promocode, reset]);

  const kind = watch("kind");
  const st = watch("st");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {promocode ? t("promocodes.dialog.edit") : t("promocodes.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("promocodes.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex flex-col gap-3"
        >
          <Field label={t("form.code")} error={errors.code?.message ? t(errors.code?.message as TKey) : undefined}>
            <Input {...register("code")} invalid={!!errors.code} placeholder="SUMMER15" />
          </Field>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink/70">{t("form.type")}</label>
            <div className="inline-flex w-fit rounded-xl border border-line bg-canvas p-1">
              {KIND_ORDER.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue("kind", key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                    kind === key ? "bg-brand text-white" : "text-muted hover:text-ink",
                  )}
                >
                  {t(label)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={t("form.value")} error={errors.value?.message ? t(errors.value?.message as TKey) : undefined}>
              <Input
                type="number"
                min={0}
                {...register("value")}
                invalid={!!errors.value}
              />
            </Field>
            <Field label={t("form.limit")} error={errors.limit?.message ? t(errors.limit?.message as TKey) : undefined}>
              <Input
                type="number"
                min={1}
                {...register("limit")}
                invalid={!!errors.limit}
              />
            </Field>
          </div>

          <Field label={t("form.period")} error={errors.period?.message ? t(errors.period?.message as TKey) : undefined}>
            <Input
              {...register("period")}
              invalid={!!errors.period}
              placeholder="1 – 31 июл"
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
                  {t(PROMO_STATUS[key].labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : promocode ? t("common.save") : t("common.add")}
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
