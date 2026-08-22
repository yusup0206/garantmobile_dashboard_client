import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

import { useProductSpecDefinitions } from "@/services/productSpecDefinitions/useProductSpecDefinitions";
import { useProductSpecValues } from "@/services/productSpecValues/useProductSpecValues";
import type { ProductSpec } from "@/services/productSpecs/productSpecs.types";
import {
  productSpecSchema,
  type ProductSpecFormValues,
} from "../lib/productSpec.schema";

type ProductSpecFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spec?: ProductSpec | null;
  onSubmit: (values: ProductSpecFormValues) => void;
  pending?: boolean;
};

const EMPTY: ProductSpecFormValues = {
  specId: "",
  specValueId: "",
  sortOrder: 0,
};

export function ProductSpecFormDialog({
  open,
  onOpenChange,
  spec,
  onSubmit,
  pending,
}: ProductSpecFormDialogProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductSpecFormValues>({
    resolver: zodResolver(productSpecSchema),
    defaultValues: EMPTY,
  });

  const selectedSpecId = watch("specId");

  // Fetch all spec definitions for the dropdown
  const { data: defsData, isLoading: defsLoading } = useProductSpecDefinitions();
  const definitions = defsData?.definitions ?? [];

  // Fetch values for the currently selected definition
  const { data: valuesData, isLoading: valuesLoading } = useProductSpecValues({
    specId: selectedSpecId || undefined,
  });
  const specValues = valuesData?.values ?? [];

  useEffect(() => {
    if (!open) return;
    if (spec) {
      reset({
        specId: spec.specId ?? "",
        specValueId: spec.specValueId ?? "",
        sortOrder: spec.sortOrder ?? 0,
      });
    } else {
      reset(EMPTY);
    }
  }, [open, spec, reset]);

  // When definition changes and is different from initial, clear chosen value
  function handleSpecChange(newSpecId: string) {
    setValue("specId", newSpecId, { shouldValidate: true });
    setValue("specValueId", "", { shouldValidate: true });
  }

  const defLabel = (item: { nameRu: string; nameTk: string }) =>
    (lang as string) === "tk" ? item.nameTk || item.nameRu : item.nameRu || item.nameTk;

  const valLabel = (item: { valueRu: string; valueTk: string }) =>
    (lang as string) === "tk" ? item.valueTk || item.valueRu : item.valueRu || item.valueTk;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {spec ? "Редактировать характеристику" : "Добавить характеристику"}
        </Dialog.Title>
        <Dialog.Description>
          Выберите характеристику и соответствующее значение для товара.
        </Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex flex-col gap-3"
        >
          <Field label="Спецификация (Определение)" error={errors.specId?.message}>
            <Select
              value={selectedSpecId}
              onChange={(e) => handleSpecChange(e.target.value)}
              invalid={!!errors.specId}
              disabled={defsLoading}
            >
              <option value="">-- Выберите спецификацию --</option>
              {definitions.map((d) => (
                <option key={d.id} value={d.id}>
                  {defLabel(d)}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Значение спецификации" error={errors.specValueId?.message}>
            <Select
              {...register("specValueId")}
              invalid={!!errors.specValueId}
              disabled={!selectedSpecId || valuesLoading}
            >
              <option value="">
                {!selectedSpecId
                  ? "Сначала выберите спецификацию"
                  : valuesLoading
                  ? "Загрузка значений…"
                  : specValues.length === 0
                  ? "Нет доступных значений"
                  : "-- Выберите значение --"}
              </option>
              {specValues.map((v) => (
                <option key={v.id} value={v.id}>
                  {valLabel(v)}
                </option>
              ))}
            </Select>
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
                : spec
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
