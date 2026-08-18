import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import type { ProductOptionValue } from "@/services/productOptionValues/productOptionValues.types";
import {
  productOptionValueSchema,
  type ProductOptionValueFormValues,
} from "../lib/productOptionValue.schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: ProductOptionValue | null;
  onSubmit: (values: ProductOptionValueFormValues) => void;
  pending?: boolean;
};

const EMPTY: ProductOptionValueFormValues = {
  valueRu: "",
  valueTm: "",
  hex: "",
  sortOrder: 0,
};

export function ProductOptionValueFormDialog({
  open,
  onOpenChange,
  value,
  onSubmit,
  pending,
}: Props) {
  const t = useT();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductOptionValueFormValues>({
    resolver: zodResolver(productOptionValueSchema),
    defaultValues: EMPTY,
  });

  const hexValue = watch("hex");

  useEffect(() => {
    if (!open) return;
    if (value) {
      reset({
        valueRu: value.valueRu ?? "",
        valueTm: value.valueTm ?? "",
        hex: value.hex ?? "",
        sortOrder: value.sortOrder ?? 0,
      });
    } else {
      reset(EMPTY);
    }
  }, [open, value, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {value ? "Редактировать значение опции" : "Новое значение опции"}
        </Dialog.Title>
        <Dialog.Description>
          Укажите значение на двух языках. Поле HEX заполняется только для
          цветовых опций.
        </Dialog.Description>

        <form
          onSubmit={handleSubmit((vals) => onSubmit(vals))}
          className="mt-4 flex flex-col gap-4"
        >
          <Field label="Значение (RU)" error={errors.valueRu?.message}>
            <Input
              {...register("valueRu")}
              invalid={!!errors.valueRu}
              placeholder="например: Красный"
            />
          </Field>

          <Field label="Значение (TM)" error={errors.valueTm?.message}>
            <Input
              {...register("valueTm")}
              invalid={!!errors.valueTm}
              placeholder="mysal: Gyzyl"
            />
          </Field>

          {/* HEX color picker */}
          <Field
            label="HEX-цвет (необязательно)"
            error={errors.hex?.message}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 shrink-0 rounded-lg border border-line shadow-sm"
                style={{ backgroundColor: hexValue || "transparent" }}
              />
              <div className="relative flex-1">
                <Input
                  {...register("hex")}
                  invalid={!!errors.hex}
                  placeholder="#ef4444"
                  className="pr-10"
                />
                <input
                  type="color"
                  value={hexValue || "#ffffff"}
                  onChange={(e) => {
                    // sync native color picker to text field
                    const syntheticEvent = {
                      target: { value: e.target.value },
                    } as React.ChangeEvent<HTMLInputElement>;
                    register("hex").onChange(syntheticEvent);
                  }}
                  className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer rounded border-0 bg-transparent p-0 opacity-0"
                  title="Выбрать цвет"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted">
                  🎨
                </span>
              </div>
            </div>
          </Field>

          <Field label="Порядок сортировки" error={errors.sortOrder?.message}>
            <Input
              type="number"
              {...register("sortOrder")}
              invalid={!!errors.sortOrder}
              placeholder="0"
            />
          </Field>

          <div className="mt-2 flex justify-end gap-2">
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
                : value
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
