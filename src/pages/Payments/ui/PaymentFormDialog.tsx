import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { PaymentType, PaymentTypeInput } from "@/services/payments/payments.types";
import { paymentTypeSchema, type PaymentTypeFormValues } from "../lib/payments.schema";

type PaymentFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentType?: PaymentType | null;
  onSubmit: (values: PaymentTypeInput) => void;
  pending?: boolean;
};

const EMPTY: PaymentTypeFormValues = {
  titleRu: "",
  titleTk: "",
  descriptionRu: "",
  descriptionTk: "",
  icon: "",
  paymentProcent: 0,
  paymentBonus: 0,
  isOverpayment: false,
  isActive: true,
  sortOrder: 0,
};

export function PaymentFormDialog({
  open,
  onOpenChange,
  paymentType,
  onSubmit,
  pending,
}: PaymentFormDialogProps) {
  const t = useT();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentTypeFormValues>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: EMPTY,
  });

  const icon = watch("icon");

  useEffect(() => {
    if (!open) return;
    reset(
      paymentType
        ? {
            titleRu: paymentType.titleRu ?? "",
            titleTk: paymentType.titleTk ?? "",
            descriptionRu: paymentType.descriptionRu ?? "",
            descriptionTk: paymentType.descriptionTk ?? "",
            icon: paymentType.icon ?? "",
            paymentProcent: Number(paymentType.paymentProcent) || 0,
            paymentBonus: Number(paymentType.paymentBonus) || 0,
            isOverpayment: String(paymentType.isOverpayment) === "true",
            isActive: String(paymentType.isActive) === "true",
            sortOrder: paymentType.sortOrder ?? 0,
          }
        : EMPTY,
    );
  }, [open, paymentType, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-lg">
        <Dialog.Title>
          {paymentType ? t("payments.dialog.edit") : t("payments.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("payments.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex max-h-[75vh] flex-col gap-3 overflow-y-auto pr-1"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={t("payments.field.titleRu")} error={errors.titleRu?.message ? t(errors.titleRu?.message as TKey) : undefined}>
              <Input {...register("titleRu")} invalid={!!errors.titleRu} placeholder="Наличный расчет" />
            </Field>
            <Field label={t("payments.field.titleTk")} error={errors.titleTk?.message ? t(errors.titleTk?.message as TKey) : undefined}>
              <Input {...register("titleTk")} invalid={!!errors.titleTk} placeholder="Nagt töleg" />
            </Field>
          </div>

          <Field label={t("payments.field.descriptionRu")}>
            <textarea
              {...register("descriptionRu")}
              rows={2}
              className="w-full rounded-xl border border-line bg-canvas p-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              placeholder="Оплата наличными при получении…"
            />
          </Field>

          <Field label={t("payments.field.descriptionTk")}>
            <textarea
              {...register("descriptionTk")}
              rows={2}
              className="w-full rounded-xl border border-line bg-canvas p-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              placeholder="Haryty alanyňyzda nagt töleg…"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={t("payments.field.percent")}>
              <Input type="number" step="any" min={0} {...register("paymentProcent")} invalid={!!errors.paymentProcent} />
            </Field>
            <Field label={t("payments.field.bonus")}>
              <Input type="number" step="any" min={0} {...register("paymentBonus")} invalid={!!errors.paymentBonus} />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ImageUpload
              label={t("payments.field.icon")}
              value={icon}
              onChange={(url) => setValue("icon", url, { shouldValidate: true })}
            />
            <Field label={t("payments.field.sortOrder")}>
              <Input type="number" min={0} {...register("sortOrder")} />
            </Field>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isOverpayment"
                {...register("isOverpayment")}
                className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
              />
              <label htmlFor="isOverpayment" className="text-sm font-medium text-ink cursor-pointer">
                {t("payments.field.isOverpayment")}
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                {...register("isActive")}
                className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-ink cursor-pointer">
                {t("payments.field.isActive")}
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : paymentType ? t("common.save") : t("common.add")}
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
