import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { cn } from "@/lib/cn";
import type {
  Category,
  CategoryInput,
} from "@/services/categories/categories.types";
import { categorySchema, type CategoryFormValues } from "../lib/category.schema";

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this category; otherwise it creates a new one. */
  category?: Category | null;
  onSubmit: (values: CategoryInput) => void;
  pending?: boolean;
};

const EMPTY: CategoryFormValues = {
  nameTk: "",
  nameRu: "",
  slug: "",
  icon: "",
  homepageShow: true,
  sortOrder: 0,
};

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  pending,
}: CategoryFormDialogProps) {
  const t = useT();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: EMPTY,
  });

  // Reset the fields each time the dialog opens (add vs edit).
  useEffect(() => {
    if (!open) return;
    reset(
      category
        ? {
            nameTk: category.nameTk,
            nameRu: category.nameRu,
            slug: category.slug,
            icon: category.icon ?? "",
            homepageShow: category.homepageShow ?? false,
            sortOrder: category.sortOrder ?? 0,
          }
        : EMPTY,
    );
  }, [open, category, reset]);

  const icon = watch("icon");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {category ? t("categories.dialog.edit") : t("categories.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("categories.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex flex-col gap-3"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Название (RU)" error={errors.nameRu?.message ? t(errors.nameRu?.message as TKey) : undefined}>
              <Input
                {...register("nameRu")}
                invalid={!!errors.nameRu}
                placeholder="Смартфоны"
              />
            </Field>
            <Field label="Название (TK)" error={errors.nameTk?.message ? t(errors.nameTk?.message as TKey) : undefined}>
              <Input
                {...register("nameTk")}
                invalid={!!errors.nameTk}
                placeholder="Smartfonlar"
              />
            </Field>
          </div>

          <Field label="Slug" error={errors.slug?.message ? t(errors.slug?.message as TKey) : undefined}>
            <Input {...register("slug")} invalid={!!errors.slug} placeholder="phones" />
          </Field>
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ImageUpload
              label="Иконка"
              value={icon}
              onChange={(url) => setValue("icon", url, { shouldValidate: true })}
            />
            <Field label="Порядок сортировки">
              <Input type="number" min={0} {...register("sortOrder")} />
            </Field>
          </div>

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

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : category ? t("common.save") : t("common.add")}
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
