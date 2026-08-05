import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type {
  Category,
  CategoryInput,
  CategoryStatus,
} from "@/services/categories/categories.types";
import { CATEGORY_STATUS } from "../lib/categories.helpers";
import { categorySchema, type CategoryFormValues } from "../lib/category.schema";

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this category; otherwise it creates a new one. */
  category?: Category | null;
  onSubmit: (values: CategoryInput) => void;
  pending?: boolean;
};

const STATUS_ORDER: CategoryStatus[] = ["active", "hidden"];

const EMPTY: CategoryFormValues = {
  name: "",
  slug: "",
  st: "active",
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
            name: category.name,
            slug: category.slug,
            st: category.st,
          }
        : EMPTY,
    );
  }, [open, category, reset]);

  const st = watch("st");

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
          <Field label={t("form.name")} error={errors.name?.message ? t(errors.name?.message as TKey) : undefined}>
            <Input
              {...register("name")}
              invalid={!!errors.name}
              placeholder="Смартфоны"
            />
          </Field>

          <Field label="Slug" error={errors.slug?.message ? t(errors.slug?.message as TKey) : undefined}>
            <Input {...register("slug")} invalid={!!errors.slug} placeholder="phones" />
          </Field>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink/70">{t("form.status")}</label>
            <div className="inline-flex w-fit rounded-xl border border-line bg-canvas p-1">
              {STATUS_ORDER.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue("st", key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                    st === key ? "bg-brand text-white" : "text-muted hover:text-ink",
                  )}
                >
                  {t(CATEGORY_STATUS[key].labelKey)}
                </button>
              ))}
            </div>
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
