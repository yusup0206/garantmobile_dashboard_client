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
import { useCategories } from "@/services/categories/useCategories";
import { useUnits } from "@/services/units/useUnits";
import type { Product, ProductInput } from "@/services/products/products.types";
import { productSchema, type ProductFormValues } from "../lib/product.schema";
import { PhotosEditor } from "./PhotosEditor";

type ProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this product; otherwise it creates a new one. */
  product?: Product | null;
  onSubmit: (values: ProductInput) => void;
  pending?: boolean;
};

const EMPTY: ProductFormValues = {
  nameRu: "",
  nameTm: "",
  shortRu: "",
  shortTm: "",
  price: 0,
  oldPrice: 0,
  stock: 0,
  brandId: "",
  categoryId: "",
  unitId: "",
  photos: [],
};

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  pending,
}: ProductFormDialogProps) {
  const t = useT();
  const { data: brandsData, isLoading: brandsLoading } = useBrands();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const { data: unitsData, isLoading: unitsLoading } = useUnits();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: EMPTY,
  });

  const photos = watch("photos");

  // Reset the fields each time the dialog opens (add vs edit).
  useEffect(() => {
    if (!open) return;
    if (product) {
      reset({
        nameRu: product.nameRu,
        nameTm: product.nameTm,
        shortRu: product.shortRu,
        shortTm: product.shortTm,
        price: product.price,
        oldPrice: product.oldPrice,
        stock: product.stock,
        brandId: product.brandId,
        categoryId: product.categoryId,
        unitId: product.unitId,
        photos: product.photos,
      });
    } else {
      reset(EMPTY);
    }
  }, [open, product, reset]);

  function handleFormSubmit(values: ProductFormValues) {
    onSubmit({
      nameRu: values.nameRu,
      nameTm: values.nameTm,
      shortRu: values.shortRu,
      shortTm: values.shortTm,
      price: values.price,
      oldPrice: values.oldPrice,
      stock: values.stock,
      brandId: values.brandId,
      categoryId: values.categoryId,
      unitId: values.unitId,
      photos: values.photos.map((p) => p.trim()).filter(Boolean),
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-lg">
        <Dialog.Title>
          {product ? t("products.dialog.edit") : t("products.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("products.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="mt-4 flex max-h-[70vh] flex-col gap-3 overflow-y-auto"
        >
          {/* Bilingual names */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label={t("form.nameRu")}
              error={
                errors.nameRu?.message
                  ? t(errors.nameRu.message as TKey)
                  : undefined
              }
            >
              <Input
                {...register("nameRu")}
                invalid={!!errors.nameRu}
                placeholder="iPhone 15 Pro"
              />
            </Field>
            <Field
              label={t("form.nameTm")}
              error={
                errors.nameTm?.message
                  ? t(errors.nameTm.message as TKey)
                  : undefined
              }
            >
              <Input
                {...register("nameTm")}
                invalid={!!errors.nameTm}
                placeholder="iPhone 15 Pro"
              />
            </Field>
          </div>

          {/* Short descriptions */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label={t("form.shortRu")}
              error={
                errors.shortRu?.message
                  ? t(errors.shortRu.message as TKey)
                  : undefined
              }
            >
              <Input
                {...register("shortRu")}
                invalid={!!errors.shortRu}
                placeholder="Краткое описание"
              />
            </Field>
            <Field
              label={t("form.shortTm")}
              error={
                errors.shortTm?.message
                  ? t(errors.shortTm.message as TKey)
                  : undefined
              }
            >
              <Input
                {...register("shortTm")}
                invalid={!!errors.shortTm}
                placeholder="Gysgaça beýan"
              />
            </Field>
          </div>

          {/* Brand / Category / Unit */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field
              label={t("form.brand")}
              error={
                errors.brandId?.message
                  ? t(errors.brandId.message as TKey)
                  : undefined
              }
            >
              <Select
                {...register("brandId")}
                invalid={!!errors.brandId}
                disabled={brandsLoading}
              >
                <option value="">
                  {brandsLoading ? t("common.loading") : "—"}
                </option>
                {brandsData?.brands?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label={t("form.category")}
              error={
                errors.categoryId?.message
                  ? t(errors.categoryId.message as TKey)
                  : undefined
              }
            >
              <Select
                {...register("categoryId")}
                invalid={!!errors.categoryId}
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? t("common.loading") : "—"}
                </option>
                {categoriesData?.categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameRu || c.nameTk}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label={t("form.unit")}
              error={
                errors.unitId?.message
                  ? t(errors.unitId.message as TKey)
                  : undefined
              }
            >
              <Select
                {...register("unitId")}
                invalid={!!errors.unitId}
                disabled={unitsLoading}
              >
                <option value="">
                  {unitsLoading ? t("common.loading") : "—"}
                </option>
                {unitsData?.units?.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nameRu} ({u.shortName})
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          {/* Price / Old Price / Stock */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field
              label={t("form.priceM")}
              error={
                errors.price?.message
                  ? t(errors.price.message as TKey)
                  : undefined
              }
            >
              <Input
                type="number"
                min={0}
                step="0.01"
                {...register("price")}
                invalid={!!errors.price}
              />
            </Field>
            <Field
              label={t("form.oldPriceM")}
              error={
                errors.oldPrice?.message
                  ? t(errors.oldPrice.message as TKey)
                  : undefined
              }
            >
              <Input
                type="number"
                min={0}
                step="0.01"
                {...register("oldPrice")}
                invalid={!!errors.oldPrice}
              />
            </Field>
            <Field
              label={t("form.stockPcs")}
              error={
                errors.stock?.message
                  ? t(errors.stock.message as TKey)
                  : undefined
              }
            >
              <Input
                type="number"
                min={0}
                {...register("stock")}
                invalid={!!errors.stock}
              />
            </Field>
          </div>

          {/* Photos */}
          <PhotosEditor
            photos={photos}
            onChange={(next) =>
              setValue("photos", next, { shouldValidate: true })
            }
          />

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
                : product
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
