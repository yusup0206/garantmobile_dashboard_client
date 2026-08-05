import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useBrands } from "@/services/brands/useBrands";
import type { Tag, TagInput } from "@/services/tags/tags.types";
import { tagSchema, type TagFormValues } from "../lib/tag.schema";

type TagFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag | null;
  onSubmit: (values: TagInput) => void;
  pending?: boolean;
};

const EMPTY: TagFormValues = {
  nameRu: "",
  nameTk: "",
  brandId: "",
};

export function TagFormDialog({
  open,
  onOpenChange,
  tag,
  onSubmit,
  pending,
}: TagFormDialogProps) {
  const t = useT();
  const { data: brandsData, isLoading: brandsLoading } = useBrands();
  const brands = brandsData?.brands ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      tag
        ? {
            nameRu: tag.nameRu ?? "",
            nameTk: tag.nameTk ?? "",
            brandId: tag.brandId ?? "",
          }
        : EMPTY,
    );
  }, [open, tag, reset]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>{tag ? "Редактировать тег" : "Новый тег"}</Dialog.Title>
        <Dialog.Description>Заполните названия тега и привязку к бренду.</Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex flex-col gap-3"
        >
          <Field label="Название (RU)" error={errors.nameRu?.message ? t(errors.nameRu?.message as TKey) : undefined}>
            <Input {...register("nameRu")} invalid={!!errors.nameRu} placeholder="Новинки" />
          </Field>

          <Field label="Название (TK)" error={errors.nameTk?.message ? t(errors.nameTk?.message as TKey) : undefined}>
            <Input {...register("nameTk")} invalid={!!errors.nameTk} placeholder="Täzelikler" />
          </Field>

          <Field label="Бренд (опционально)">
            <Select {...register("brandId")} disabled={brandsLoading}>
              <option value="">— Без бренда —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </Field>

          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : tag ? t("common.save") : t("common.add")}
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
