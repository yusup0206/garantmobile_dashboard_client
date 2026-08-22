import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { DeliveryType, DeliveryTypeInput } from "@/services/delivery/delivery.types";
import { deliveryTypeSchema, type DeliveryTypeFormValues } from "../lib/delivery.schema";

type DeliveryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deliveryType?: DeliveryType | null;
  onSubmit: (values: DeliveryTypeInput) => void;
  pending?: boolean;
};

const EMPTY: DeliveryTypeFormValues = {
  titleRu: "",
  titleTk: "",
  descriptionRu: "",
  descriptionTk: "",
  icon: "",
  price: 0,
  freeFrom: "",
  deliveryTime: "",
  discountForMethod: 0,
  isSelfPickup: false,
  isActive: true,
  sortOrder: 0,
};

export function DeliveryFormDialog({
  open,
  onOpenChange,
  deliveryType,
  onSubmit,
  pending,
}: DeliveryFormDialogProps) {
  const t = useT();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DeliveryTypeFormValues>({
    resolver: zodResolver(deliveryTypeSchema),
    defaultValues: EMPTY,
  });

  const icon = watch("icon");

  useEffect(() => {
    if (!open) return;
    reset(
      deliveryType
        ? {
            titleRu: deliveryType.titleRu ?? "",
            titleTk: deliveryType.titleTk ?? "",
            descriptionRu: deliveryType.descriptionRu ?? "",
            descriptionTk: deliveryType.descriptionTk ?? "",
            icon: deliveryType.icon ?? "",
            price: Number(deliveryType.price) || 0,
            freeFrom: deliveryType.freeFrom ?? "",
            deliveryTime: deliveryType.deliveryTime ?? "",
            discountForMethod: deliveryType.discountForMethod ?? 0,
            isSelfPickup: String(deliveryType.isSelfPickup) === "true",
            isActive: String(deliveryType.isActive) === "true",
            sortOrder: deliveryType.sortOrder ?? 0,
          }
        : EMPTY,
    );
  }, [open, deliveryType, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-lg">
        <Dialog.Title>
          {deliveryType ? t("delivery.dialog.edit") : t("delivery.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("delivery.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex max-h-[75vh] flex-col gap-3 overflow-y-auto pr-1"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={t("delivery.field.titleRu")} error={errors.titleRu?.message ? t(errors.titleRu?.message as TKey) : undefined}>
              <Input {...register("titleRu")} invalid={!!errors.titleRu} placeholder="Курьерская доставка" />
            </Field>
            <Field label={t("delivery.field.titleTk")} error={errors.titleTk?.message ? t(errors.titleTk?.message as TKey) : undefined}>
              <Input {...register("titleTk")} invalid={!!errors.titleTk} placeholder="Kuryer eltip bermek" />
            </Field>
          </div>

          <Field label={t("delivery.field.descriptionRu")}>
            <textarea
              {...register("descriptionRu")}
              rows={2}
              className="w-full rounded-xl border border-line bg-canvas p-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              placeholder="Доставка до двери по Ашхабаду…"
            />
          </Field>

          <Field label={t("delivery.field.descriptionTk")}>
            <textarea
              {...register("descriptionTk")}
              rows={2}
              className="w-full rounded-xl border border-line bg-canvas p-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              placeholder="Aşgabat boýunça gapya eltip bermek…"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={t("delivery.field.price")}>
              <Input type="number" min={0} {...register("price")} invalid={!!errors.price} />
            </Field>
            <Field label={t("delivery.field.deliveryTime")}>
              <Input {...register("deliveryTime")} placeholder="1-2 дня" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={t("delivery.field.freeFrom")}>
              <Input {...register("freeFrom")} placeholder="500 TMT" />
            </Field>
            <Field label={t("delivery.field.discount")}>
              <Input type="number" min={0} {...register("discountForMethod")} />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ImageUpload
              label={t("delivery.field.icon")}
              value={icon}
              onChange={(url) => setValue("icon", url, { shouldValidate: true })}
            />
            <Field label={t("delivery.field.sortOrder")}>
              <Input type="number" min={0} {...register("sortOrder")} />
            </Field>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isSelfPickup"
                {...register("isSelfPickup")}
                className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
              />
              <label htmlFor="isSelfPickup" className="text-sm font-medium text-ink cursor-pointer">
                {t("delivery.field.isSelfPickup")}
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
                {t("delivery.field.isActive")}
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : deliveryType ? t("common.save") : t("common.add")}
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
