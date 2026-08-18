import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ProductSpecValue } from "@/services/productSpecValues/productSpecValues.types";
import {
  productSpecValueSchema,
  type ProductSpecValueFormValues,
} from "../lib/productSpecValue.schema";

type ProductSpecValueFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specValue?: ProductSpecValue | null;
  onSubmit: (values: ProductSpecValueFormValues) => void;
  pending?: boolean;
};

const EMPTY: ProductSpecValueFormValues = {
  valueRu: "",
  valueTm: "",
  sortOrder: 0,
};

export function ProductSpecValueFormDialog({
  open,
  onOpenChange,
  specValue,
  onSubmit,
  pending,
}: ProductSpecValueFormDialogProps) {
  const t = useT();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductSpecValueFormValues>({
    resolver: zodResolver(productSpecValueSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      specValue
        ? {
            valueRu: specValue.valueRu ?? "",
            valueTm: specValue.valueTm ?? "",
            sortOrder: specValue.sortOrder ?? 0,
          }
        : EMPTY,
    );
  }, [open, specValue, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {specValue
            ? "Редактировать значение"
            : "Новое значение"}
        </Dialog.Title>
        <Dialog.Description>
          Укажите значение спецификации на русском и туркменском языках.
        </Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex flex-col gap-3"
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
              placeholder="например: Gyzyl"
            />
          </Field>

          <Field label="Порядок сортировки" error={errors.sortOrder?.message}>
            <Input
              type="number"
              {...register("sortOrder")}
              invalid={!!errors.sortOrder}
              placeholder="0"
            />
          </Field>

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
                : specValue
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
