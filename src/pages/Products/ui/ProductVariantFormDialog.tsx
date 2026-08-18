import { useEffect, type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MultiImageUpload } from "@/components/ui/ImageUpload/MultiImageUpload";

import type { ProductVariant } from "@/services/productVariants/productVariants.types";
import {
  productVariantSchema,
  type ProductVariantFormValues,
} from "../lib/productVariant.schema";

type ProductVariantFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: ProductVariant | null;
  onSubmit: (values: ProductVariantFormValues) => void;
  pending?: boolean;
};

const EMPTY: ProductVariantFormValues = {
  barcode: "",
  price: 0,
  oldPrice: 0,
  stock: 0,
  isActive: true,
  photos: [],
};

export function ProductVariantFormDialog({
  open,
  onOpenChange,
  variant,
  onSubmit,
  pending,
}: ProductVariantFormDialogProps) {
  const t = useT();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductVariantFormValues>({
    resolver: zodResolver(productVariantSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    if (variant) {
      reset({
        barcode: variant.barcode ?? "",
        price: Number(variant.price) || 0,
        oldPrice: Number(variant.oldPrice) || 0,
        stock: Number(variant.stock) || 0,
        isActive: variant.isActive ?? true,
        photos: variant.photos ?? [],
      });
    } else {
      reset(EMPTY);
    }
  }, [open, variant, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-lg max-h-[85vh] overflow-y-auto">
        <Dialog.Title>
          {variant ? "Редактировать вариант товара" : "Новый вариант товара"}
        </Dialog.Title>
        <Dialog.Description>
          Укажите параметры варианта: штрихкод, цену, остаток и фотографии.
        </Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex flex-col gap-4"
        >
          {/* Multiple Image Upload */}
          <Controller
            control={control}
            name="photos"
            render={({ field }) => (
              <MultiImageUpload
                label="Фотографии варианта (множественная загрузка)"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Field label="Штрихкод / Barcode" error={errors.barcode?.message}>
            <Input
              {...register("barcode")}
              invalid={!!errors.barcode}
              placeholder="например: 8680001001"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Цена (TMT)" error={errors.price?.message}>
              <Input
                type="number"
                step="any"
                {...register("price")}
                invalid={!!errors.price}
                placeholder="0"
              />
            </Field>

            <Field label="Старая цена (TMT)" error={errors.oldPrice?.message}>
              <Input
                type="number"
                step="any"
                {...register("oldPrice")}
                invalid={!!errors.oldPrice}
                placeholder="0"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <Field label="Остаток на складе" error={errors.stock?.message}>
              <Input
                type="number"
                {...register("stock")}
                invalid={!!errors.stock}
                placeholder="0"
              />
            </Field>

            <div className="flex items-center gap-2 pt-5">
              <input
                id="isActive"
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-ink cursor-pointer">
                Активен для продажи
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending
                ? t("common.saving")
                : variant
                ? t("common.save")
                : t("common.add")}
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
