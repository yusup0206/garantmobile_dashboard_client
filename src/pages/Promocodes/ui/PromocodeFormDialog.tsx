import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { Promocode, PromocodeInput } from "@/services/promocodes/promocodes.types";
import { promocodeSchema, type PromocodeFormValues } from "../lib/promocode.schema";

type PromocodeFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this promocode; otherwise it creates a new one. */
  promocode?: Promocode | null;
  onSubmit: (values: PromocodeInput) => void;
  pending?: boolean;
};

const EMPTY: PromocodeFormValues = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: 0,
  descriptionTk: "",
  descriptionRu: "",
  minOrderAmount: 0,
  startsAt: "",
  expiresAt: "",
  usageLimit: 1,
  isForNewClients: false,
  isActive: true,
};

/** Convert ISO string "2026-08-14T11:24:16.386Z" → "2026-08-14" for date input */
function toDateInput(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

/** Convert date input "2026-08-14" → ISO string */
function toIso(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString();
}

export function PromocodeFormDialog({
  open,
  onOpenChange,
  promocode,
  onSubmit,
  pending,
}: PromocodeFormDialogProps) {
  const t = useT();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PromocodeFormValues>({
    resolver: zodResolver(promocodeSchema),
    defaultValues: EMPTY,
  });

  // Reset the fields each time the dialog opens (add vs edit).
  useEffect(() => {
    if (!open) return;
    reset(
      promocode
        ? {
            code: promocode.code,
            discountType: promocode.discountType,
            discountValue: promocode.discountValue,
            descriptionTk: promocode.descriptionTk,
            descriptionRu: promocode.descriptionRu,
            minOrderAmount: promocode.minOrderAmount,
            startsAt: toDateInput(promocode.startsAt),
            expiresAt: toDateInput(promocode.expiresAt),
            usageLimit: promocode.usageLimit,
            isForNewClients: promocode.isForNewClients,
            isActive: promocode.isActive,
          }
        : EMPTY,
    );
  }, [open, promocode, reset]);

  const discountType = watch("discountType");
  const isForNewClients = watch("isForNewClients");
  const isActive = watch("isActive");

  function handleSubmitForm(values: PromocodeFormValues) {
    const payload: PromocodeInput = {
      ...values,
      startsAt: toIso(values.startsAt),
      expiresAt: toIso(values.expiresAt),
    };
    onSubmit(payload);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-lg">
        <Dialog.Title>
          {promocode ? t("promocodes.dialog.edit") : t("promocodes.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("promocodes.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="mt-4 flex flex-col gap-3"
        >
          {/* Code */}
          <Field
            label={t("form.code")}
            error={errors.code?.message ? t(errors.code.message as TKey) : undefined}
          >
            <Input
              {...register("code")}
              invalid={!!errors.code}
              placeholder="SUMMER20"
              style={{ textTransform: "uppercase" }}
            />
          </Field>

          {/* Discount type toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink/70">{t("form.discountType")}</label>
            <div className="inline-flex w-fit rounded-xl border border-line bg-canvas p-1">
              {(["PERCENTAGE", "FIXED_AMOUNT"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue("discountType", key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                    discountType === key
                      ? "bg-brand text-white"
                      : "text-muted hover:text-ink",
                  )}
                >
                  {key === "PERCENTAGE" ? t("form.percent") : t("form.amount")}
                </button>
              ))}
            </div>
          </div>

          {/* Discount value + min order amount */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label={t("form.discountValue")}
              error={
                errors.discountValue?.message
                  ? t(errors.discountValue.message as TKey)
                  : undefined
              }
            >
              <Input
                type="number"
                min={0}
                {...register("discountValue")}
                invalid={!!errors.discountValue}
              />
            </Field>
            <Field
              label={t("form.minOrderAmount")}
              error={
                errors.minOrderAmount?.message
                  ? t(errors.minOrderAmount.message as TKey)
                  : undefined
              }
            >
              <Input
                type="number"
                min={0}
                {...register("minOrderAmount")}
                invalid={!!errors.minOrderAmount}
              />
            </Field>
          </div>

          {/* Descriptions */}
          <Field
            label={t("form.descriptionTk")}
            error={
              errors.descriptionTk?.message
                ? t(errors.descriptionTk.message as TKey)
                : undefined
            }
          >
            <Input
              {...register("descriptionTk")}
              invalid={!!errors.descriptionTk}
              placeholder="Tomusky arzanladyş"
            />
          </Field>
          <Field
            label={t("form.descriptionRu")}
            error={
              errors.descriptionRu?.message
                ? t(errors.descriptionRu.message as TKey)
                : undefined
            }
          >
            <Input
              {...register("descriptionRu")}
              invalid={!!errors.descriptionRu}
              placeholder="Летняя скидка"
            />
          </Field>

          {/* Date range */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label={t("form.startsAt")}
              error={
                errors.startsAt?.message
                  ? t(errors.startsAt.message as TKey)
                  : undefined
              }
            >
              <Input
                type="date"
                {...register("startsAt")}
                invalid={!!errors.startsAt}
              />
            </Field>
            <Field
              label={t("form.expiresAt")}
              error={
                errors.expiresAt?.message
                  ? t(errors.expiresAt.message as TKey)
                  : undefined
              }
            >
              <Input
                type="date"
                {...register("expiresAt")}
                invalid={!!errors.expiresAt}
              />
            </Field>
          </div>

          {/* Usage limit */}
          <Field
            label={t("form.usageLimit")}
            error={
              errors.usageLimit?.message
                ? t(errors.usageLimit.message as TKey)
                : undefined
            }
          >
            <Input
              type="number"
              min={1}
              {...register("usageLimit")}
              invalid={!!errors.usageLimit}
            />
          </Field>

          {/* Boolean toggles */}
          <div className="flex flex-wrap gap-4">
            <Toggle
              label={t("form.isForNewClients")}
              active={isForNewClients}
              onChange={(v) => setValue("isForNewClients", v)}
            />
            <Toggle
              label={t("form.isActive")}
              active={isActive}
              onChange={(v) => setValue("isActive", v)}
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending
                ? t("common.saving")
                : promocode
                  ? t("common.save")
                  : t("common.add")}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

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

function Toggle({
  label,
  active,
  onChange,
}: {
  label: string;
  active: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className="flex items-center gap-2 text-sm font-medium text-ink"
    >
      {/* Track */}
      <span
        className={cn(
          "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
          active ? "bg-brand" : "bg-line",
        )}
      >
        {/* Thumb */}
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
            active ? "translate-x-4" : "translate-x-0",
          )}
        />
      </span>
      {label}
    </button>
  );
}
