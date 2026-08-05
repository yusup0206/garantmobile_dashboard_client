import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { POST_STATUS } from "@/data/blog.mock";
import { useTags } from "@/services/tags/useTags";
import type { BlogPost, CreateBlogPostDto, BlogStatus } from "@/services/blog/blog.types";
import { postSchema, type PostFormValues } from "../lib/post.schema";

type PostFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: BlogPost | null;
  onSubmit: (values: CreateBlogPostDto) => void;
  pending?: boolean;
};

const STATUS_ORDER: BlogStatus[] = ["published", "draft"];

const EMPTY: PostFormValues = {
  titleRu: "",
  titleTk: "",
  teaserRu: "",
  teaserTk: "",
  descriptionRu: "",
  descriptionTk: "",
  publishedAt: new Date().toISOString(),
  readingTime: 0,
  cover: "",
  tagId: "",
  status: "draft",
};

export function PostFormDialog({
  open,
  onOpenChange,
  post,
  onSubmit,
  pending,
}: PostFormDialogProps) {
  const t = useT();
  const { data: tagsData, isLoading: tagsLoading } = useTags();
  const tags = tagsData?.tags ?? [];

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

  useEffect(() => {
    if (!open) return;
    reset(
      post
        ? {
            titleRu: post.titleRu ?? "",
            titleTk: post.titleTk ?? "",
            teaserRu: post.teaserRu ?? "",
            teaserTk: post.teaserTk ?? "",
            descriptionRu: post.descriptionRu ?? "",
            descriptionTk: post.descriptionTk ?? "",
            publishedAt: post.publishedAt ?? new Date().toISOString(),
            readingTime: post.readingTime ?? 0,
            cover: post.cover ?? "",
            tagId: post.tagId ?? "",
            status: post.status ?? "draft",
          }
        : EMPTY,
    );
  }, [open, post, reset]);

  const status = watch("status");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-lg">
        <Dialog.Title>
          {post ? t("blog.dialog.edit") : t("blog.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("blog.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values))}
          className="mt-4 flex max-h-[75vh] flex-col gap-3 overflow-y-auto pr-1"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Заголовок (RU)" error={errors.titleRu?.message ? t(errors.titleRu?.message as TKey) : undefined}>
              <Input
                {...register("titleRu")}
                invalid={!!errors.titleRu}
                placeholder="Обзор смартфона"
              />
            </Field>
            <Field label="Заголовок (TK)" error={errors.titleTk?.message ? t(errors.titleTk?.message as TKey) : undefined}>
              <Input
                {...register("titleTk")}
                invalid={!!errors.titleTk}
                placeholder="Smartfon syny"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Тизер / Краткое (RU)">
              <Input
                {...register("teaserRu")}
                placeholder="Краткое описание на русском"
              />
            </Field>
            <Field label="Тизер / Краткое (TK)">
              <Input
                {...register("teaserTk")}
                placeholder="Gysgaça mazmuny türkmençe"
              />
            </Field>
          </div>

          <Field label="Полный текст (RU)">
            <textarea
              {...register("descriptionRu")}
              rows={3}
              className="w-full rounded-xl border border-line bg-canvas p-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              placeholder="Полная статья на русском…"
            />
          </Field>

          <Field label="Полный текст (TK)">
            <textarea
              {...register("descriptionTk")}
              rows={3}
              className="w-full rounded-xl border border-line bg-canvas p-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              placeholder="Doly makala türkmençe…"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Обложка (URL)">
              <Input
                {...register("cover")}
                placeholder="https://example.com/image.png"
              />
            </Field>
            <Field label="Время чтения (мин)">
              <Input
                type="number"
                min={0}
                {...register("readingTime")}
                invalid={!!errors.readingTime}
              />
            </Field>
          </div>

          <Field label="Тег">
            <Select {...register("tagId")} disabled={tagsLoading}>
              <option value="">— Без тега —</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.nameRu || tag.nameTk}
                </option>
              ))}
            </Select>
          </Field>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink/70">{t("form.status")}</label>
            <div className="inline-flex w-fit rounded-xl border border-line bg-canvas p-1">
              {STATUS_ORDER.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue("status", key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                    status === key ? "bg-brand text-white" : "text-muted hover:text-ink",
                  )}
                >
                  {t(POST_STATUS[key].labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
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
