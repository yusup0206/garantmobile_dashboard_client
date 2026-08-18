import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import type { ProductOption } from "@/services/productOptions/productOptions.types";
import {
  productOptionSchema,
  type ProductOptionFormValues,
} from "../lib/productOption.schema";

type ProductOptionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  option?: ProductOption | null;
  onSubmit: (values: ProductOptionFormValues) => void;
  pending?: boolean;
};

const EMPTY: ProductOptionFormValues = {
  nameRu: "",
  nameTm: "",
  sortOrder: 0,
};

export function ProductOptionFormDialog({
  open,
  onOpenChange,
  option,
  onSubmit,
  pending,
}: ProductOptionFormDialogProps) {
  const t = useT();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductOptionFormValues>({
    resolver: zodResolver(productOptionSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    if (option) {
      reset({
        nameRu: option.nameRu ?? "",
        nameTm: option.nameTm ?? "",
        sortOrder: option.sortOrder ?? 0,
      });
    } else {
      reset(EMPTY);
    }
  }, [open, option, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {option ? "Редактировать опцию товара" : "Новая опция товара"}
        </Dialog.Title>
        <Dialog.Description>
          Укажите название опции на русском и туркменском языках.
        </Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex flex-col gap-4"
        >
          <Field label="Название (RU)" error={errors.nameRu?.message}>
            <Input
              {...register("nameRu")}
              invalid={!!errors.nameRu}
              placeholder="например: Цвет"
            />
          </Field>

          <Field label="Название (TM)" error={errors.nameTm?.message}>
            <Input
              {...register("nameTm")}
              invalid={!!errors.nameTm}
              placeholder="mysal: Reňk"
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
                : option
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
