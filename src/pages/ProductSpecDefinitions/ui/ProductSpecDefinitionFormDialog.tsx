import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type {
  ProductSpecDefinition,
  ProductSpecDefinitionInput,
} from "@/services/productSpecDefinitions/productSpecDefinitions.types";
import {
  productSpecDefinitionSchema,
  type ProductSpecDefinitionFormValues,
} from "../lib/productSpecDefinition.schema";

type ProductSpecDefinitionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  definition?: ProductSpecDefinition | null;
  onSubmit: (values: ProductSpecDefinitionInput) => void;
  pending?: boolean;
};

const EMPTY: ProductSpecDefinitionFormValues = {
  nameRu: "",
  nameTk: "",
};

export function ProductSpecDefinitionFormDialog({
  open,
  onOpenChange,
  definition,
  onSubmit,
  pending,
}: ProductSpecDefinitionFormDialogProps) {
  const t = useT();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductSpecDefinitionFormValues>({
    resolver: zodResolver(productSpecDefinitionSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      definition
        ? {
            nameRu: definition.nameRu ?? "",
            nameTk: definition.nameTk ?? "",
          }
        : EMPTY,
    );
  }, [open, definition, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {definition
            ? t("spec.dialog.edit")
            : t("spec.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>
          {t("spec.dialog.desc")}
        </Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex flex-col gap-3"
        >
          <Field label={t("spec.field.nameRu")} error={errors.nameRu?.message}>
            <Input
              {...register("nameRu")}
              invalid={!!errors.nameRu}
              placeholder="например: Цвет"
            />
          </Field>

          <Field label={t("spec.field.nameTk")} error={errors.nameTk?.message}>
            <Input
              {...register("nameTk")}
              invalid={!!errors.nameTk}
              placeholder="например: Reňk"
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
                : definition
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
