import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { Brand, BrandInput } from "@/services/brands/brands.types";
import { brandSchema, type BrandFormValues } from "../lib/brand.schema";

type BrandFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: Brand | null;
  onSubmit: (values: BrandInput) => void;
  pending?: boolean;
};

const EMPTY: BrandFormValues = {
  name: "",
  logo: "",
  description: "",
  homepageShow: true,
  sortOrder: 0,
};

export function BrandFormDialog({
  open,
  onOpenChange,
  brand,
  onSubmit,
  pending,
}: BrandFormDialogProps) {
  const t = useT();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: EMPTY,
  });

  const logo = watch("logo");

  useEffect(() => {
    if (!open) return;
    reset(
      brand
        ? {
            name: brand.name,
            logo: brand.logo ?? "",
            description: brand.description ?? "",
            homepageShow: brand.homepageShow ?? false,
            sortOrder: brand.sortOrder ?? 0,
          }
        : EMPTY,
    );
  }, [open, brand, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>{brand ? t("brands.dialog.edit") : t("brands.dialog.new")}</Dialog.Title>
        <Dialog.Description>{t("brands.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex flex-col gap-3"
        >
          <Field label={t("form.name")} error={errors.name?.message ? t(errors.name?.message as TKey) : undefined}>
            <Input {...register("name")} invalid={!!errors.name} placeholder="Apple" />
          </Field>

          <ImageUpload
            label="Логотип"
            value={logo}
            onChange={(url) => setValue("logo", url, { shouldValidate: true })}
          />

          <Field label="Описание">
            <textarea
              {...register("description")}
              rows={3}
              className="w-full rounded-xl border border-line bg-canvas p-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              placeholder="Краткое описание бренда…"
            />
          </Field>

          <Field label="Порядок сортировки">
            <Input
              type="number"
              min={0}
              {...register("sortOrder")}
              invalid={!!errors.sortOrder}
            />
          </Field>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="homepageShow"
              {...register("homepageShow")}
              className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
            />
            <label htmlFor="homepageShow" className="text-sm font-medium text-ink cursor-pointer">
              Показывать на главной странице
            </label>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : brand ? t("common.save") : t("common.add")}
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
