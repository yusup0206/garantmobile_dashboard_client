import { useEffect, useState, type ReactNode } from "react";
import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/common/ImageUploadField";
import { cn } from "@/lib/cn";
import type {
  Banner,
  BannerInput,
  BannerPlacement,
  BannerLinkType,
} from "@/services/banners/banners.types";
import {
  PLACEMENT_LABEL,
  LINK_TYPE_LABEL,
  PLACEMENTS,
  LINK_TYPES,
} from "../lib/banners.helpers";

type BannerFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner | null;
  onSubmit: (values: BannerInput) => void;
  pending?: boolean;
};

type Draft = {
  titleRu: string;
  titleTk: string;
  subtitleRu: string;
  subtitleTk: string;
  imageRu: string;
  imageTk: string;
  price: string;
  oldPrice: string;
  sortOrder: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  placement: BannerPlacement;
  linkType: BannerLinkType;
  linkId: string;
};

const EMPTY: Draft = {
  titleRu: "",
  titleTk: "",
  subtitleRu: "",
  subtitleTk: "",
  imageRu: "",
  imageTk: "",
  price: "0",
  oldPrice: "0",
  sortOrder: "0",
  startDate: "",
  endDate: "",
  isActive: true,
  placement: "main_slider",
  linkType: "product",
  linkId: "",
};

/** ISO → value for <input type="datetime-local"> (first 16 chars). */
const toLocal = (iso: string | null): string => (iso ? iso.slice(0, 16) : "");

export function BannerFormDialog({
  open,
  onOpenChange,
  banner,
  onSubmit,
  pending,
}: BannerFormDialogProps) {
  const t = useT();
  const [draft, setDraft] = useState<Draft>(EMPTY);

  useEffect(() => {
    if (!open) return;
    setDraft(
      banner
        ? {
            titleRu: banner.titleRu,
            titleTk: banner.titleTk,
            subtitleRu: banner.subtitleRu,
            subtitleTk: banner.subtitleTk,
            imageRu: banner.imageRu,
            imageTk: banner.imageTk,
            price: String(banner.price ?? 0),
            oldPrice: String(banner.oldPrice ?? 0),
            sortOrder: String(banner.sortOrder ?? 0),
            startDate: toLocal(banner.startDate),
            endDate: toLocal(banner.endDate),
            isActive: banner.isActive,
            placement: banner.placement,
            linkType: banner.linkType,
            linkId: banner.linkId ?? "",
          }
        : EMPTY,
    );
  }, [open, banner]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function submit() {
    const input: BannerInput = {
      titleRu: draft.titleRu.trim(),
      titleTk: draft.titleTk.trim(),
      subtitleRu: draft.subtitleRu.trim(),
      subtitleTk: draft.subtitleTk.trim(),
      imageRu: draft.imageRu.trim(),
      imageTk: draft.imageTk.trim(),
      price: Number(draft.price) || 0,
      oldPrice: Number(draft.oldPrice) || 0,
      sortOrder: Number(draft.sortOrder) || 0,
      startDate: draft.startDate ? new Date(draft.startDate).toISOString() : null,
      endDate: draft.endDate ? new Date(draft.endDate).toISOString() : null,
      isActive: draft.isActive,
      placement: draft.placement,
      linkType: draft.linkType,
      linkId: draft.linkId.trim() || null,
    };
    onSubmit(input);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Title>
          {banner ? t("banners.dialog.edit") : t("banners.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("banners.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mt-4 flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1"
        >
          {/* Titles */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("banners.form.titleRu")}>
              <Input
                value={draft.titleRu}
                onChange={(e) => set("titleRu", e.target.value)}
                placeholder="Заголовок (RU)"
              />
            </Field>
            <Field label={t("banners.form.titleTk")}>
              <Input
                value={draft.titleTk}
                onChange={(e) => set("titleTk", e.target.value)}
                placeholder="Заголовок (TK)"
              />
            </Field>
            <Field label={t("banners.form.subtitleRu")}>
              <Input
                value={draft.subtitleRu}
                onChange={(e) => set("subtitleRu", e.target.value)}
                placeholder="Подзаголовок (RU)"
              />
            </Field>
            <Field label={t("banners.form.subtitleTk")}>
              <Input
                value={draft.subtitleTk}
                onChange={(e) => set("subtitleTk", e.target.value)}
                placeholder="Подзаголовок (TK)"
              />
            </Field>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 gap-3">
            <Field label={t("banners.form.imageRu")}>
              <ImageUploadField
                value={draft.imageRu}
                onChange={(url) => set("imageRu", url)}
                placeholder="https://…"
              />
            </Field>
            <Field label={t("banners.form.imageTk")}>
              <ImageUploadField
                value={draft.imageTk}
                onChange={(url) => set("imageTk", url)}
                placeholder="https://…"
              />
            </Field>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-3 gap-3">
            <Field label={t("banners.form.price")}>
              <Input
                type="number"
                min={0}
                value={draft.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </Field>
            <Field label={t("banners.form.oldPrice")}>
              <Input
                type="number"
                min={0}
                value={draft.oldPrice}
                onChange={(e) => set("oldPrice", e.target.value)}
              />
            </Field>
            <Field label={t("banners.form.sortOrder")}>
              <Input
                type="number"
                min={0}
                value={draft.sortOrder}
                onChange={(e) => set("sortOrder", e.target.value)}
              />
            </Field>
          </div>

          {/* Placement */}
          <Segmented
            label={t("form.placement")}
            value={draft.placement}
            options={PLACEMENTS.map((p) => ({ value: p, label: PLACEMENT_LABEL[p] }))}
            onChange={(v) => set("placement", v as BannerPlacement)}
          />

          {/* Link */}
          <div className="grid grid-cols-2 gap-3">
            <Segmented
              label={t("banners.form.linkType")}
              value={draft.linkType}
              options={LINK_TYPES.map((lt) => ({
                value: lt,
                label: LINK_TYPE_LABEL[lt],
              }))}
              onChange={(v) => set("linkType", v as BannerLinkType)}
            />
            <Field label={t("banners.form.linkId")}>
              <Input
                value={draft.linkId}
                onChange={(e) => set("linkId", e.target.value)}
                placeholder="ID товара / категории / ..."
              />
            </Field>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("banners.form.startsAt")}>
              <Input
                type="datetime-local"
                value={draft.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label={t("banners.form.endsAt")}>
              <Input
                type="datetime-local"
                value={draft.endDate}
                onChange={(e) => set("endDate", e.target.value)}
              />
            </Field>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={draft.isActive}
              onClick={() => set("isActive", !draft.isActive)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                draft.isActive ? "bg-brand" : "bg-muted/30",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform",
                  draft.isActive ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
            <span className="text-sm font-medium text-ink">
              {draft.isActive ? t("status.banner.active") : t("status.banner.paused")}
            </span>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : banner ? t("common.save") : t("common.add")}
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

function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-ink/70">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
              value === o.value
                ? "border-brand bg-brand text-white"
                : "border-line bg-canvas text-muted hover:text-ink",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
