import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { POST_STATUS } from "@/data/blog.mock";
import type { Post, PostInput, PostStatusKey } from "@/services/blog/blog.types";
import { postSchema, type PostFormValues } from "../lib/post.schema";

type PostFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this post; otherwise it creates a new one. */
  post?: Post | null;
  onSubmit: (values: PostInput) => void;
  pending?: boolean;
};

const STATUS_ORDER: PostStatusKey[] = ["published", "draft", "scheduled"];

const EMPTY: PostFormValues = {
  title: "",
  author: "",
  date: "",
  st: "published",
};

export function PostFormDialog({
  open,
  onOpenChange,
  post,
  onSubmit,
  pending,
}: PostFormDialogProps) {
  const t = useT();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: EMPTY,
  });

  // Reset the fields each time the dialog opens (add vs edit).
  useEffect(() => {
    if (!open) return;
    reset(
      post
        ? {
            title: post.title,
            author: post.author,
            date: post.date,
            st: post.st,
          }
        : EMPTY,
    );
  }, [open, post, reset]);

  const st = watch("st");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {post ? t("blog.dialog.edit") : t("blog.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("blog.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex flex-col gap-3"
        >
          <Field label={t("form.heading")} error={errors.title?.message ? t(errors.title?.message as TKey) : undefined}>
            <Input
              {...register("title")}
              invalid={!!errors.title}
              placeholder="Как выбрать смартфон в 2026"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={t("form.author")} error={errors.author?.message ? t(errors.author?.message as TKey) : undefined}>
              <Input
                {...register("author")}
                invalid={!!errors.author}
                placeholder="Мердан Аннаев"
              />
            </Field>
            <Field label={t("form.date")} error={errors.date?.message ? t(errors.date?.message as TKey) : undefined}>
              <Input {...register("date")} invalid={!!errors.date} placeholder="3 июл" />
            </Field>
          </div>

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
                  {t(POST_STATUS[key].labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : post ? t("common.save") : t("common.add")}
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
