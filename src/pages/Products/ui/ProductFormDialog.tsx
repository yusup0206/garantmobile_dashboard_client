import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { PRODUCT_STATUS } from "@/data/products.mock";
import { useProductDetail } from "@/services/products/useProducts";
import { useBrands } from "@/services/brands/useBrands";
import { useCategories } from "@/services/categories/useCategories";
import type {
  Product,
  ProductInput,
  ProductStatusKey,
  ProductVariant,
} from "@/services/products/products.types";
import { productSchema, type ProductFormValues } from "../lib/product.schema";
import { VariantsEditor } from "./VariantsEditor";
import { PhotosEditor } from "./PhotosEditor";

type ProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this product; otherwise it creates a new one. */
  product?: Product | null;
  onSubmit: (values: ProductInput) => void;
  pending?: boolean;
};

const STATUS_ORDER: ProductStatusKey[] = ["active", "draft", "archived"];

const EMPTY: ProductFormValues = {
  name: "",
  brand: "",
  category: "",
  price: 0,
  stock: 0,
  st: "active",
};

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  pending,
}: ProductFormDialogProps) {
  const t = useT();
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
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

  // Variants live outside RHF (a structured sub-entity). Editing loads the
  // product detail; adding starts empty. Until the detail arrives we mark
  // variants "not ready" and omit them from the payload, so a save that races
  // the load never wipes existing variants.
  const detailId = open && product ? product.id : null;
  const { data: detail } = useProductDetail(detailId);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [variantsReady, setVariantsReady] = useState(false);
  const [variantErrors, setVariantErrors] = useState<Record<number, TKey | undefined>>(
    {},
  );

  // Reset the fields each time the dialog opens (add vs edit).
  useEffect(() => {
    if (!open) return;
    setVariantErrors({});
    if (product) {
      reset({
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        stock: product.stock,
        st: product.st,
      });
      setVariantsReady(false);
    } else {
      reset(EMPTY);
      setVariants([]);
      setPhotos([]);
      setVariantsReady(true);
    }
  }, [open, product, reset]);

  // Seed variants + photos once the matching detail has loaded (edit mode).
  // Both share the `variantsReady` gate so a save that races the load never
  // wipes existing variants or photos.
  useEffect(() => {
    if (open && product && detail && detail.id === product.id) {
      setVariants(detail.variants);
      setPhotos(detail.photos);
      setVariantsReady(true);
    }
  }, [open, product, detail]);

  const st = watch("st");

  function handleFormSubmit(values: ProductFormValues) {
    // Validate SKUs client-side: non-empty and unique (the backend also
    // enforces global uniqueness with a 409).
    const nextErrors: Record<number, TKey> = {};
    const seen = new Set<string>();
    variants.forEach((variant, index) => {
      const sku = variant.sku.trim();
      if (!sku) {
        nextErrors[index] = "products.variant.err.sku";
        return;
      }
      const key = sku.toLowerCase();
      if (seen.has(key)) nextErrors[index] = "products.variant.err.skuDup";
      else seen.add(key);
    });
    if (Object.keys(nextErrors).length > 0) {
      setVariantErrors(nextErrors);
      return;
    }

    // Keep the variant id for existing variants so the backend reconciles by
    // id (updates in place); new variants have none and are created.
    const cleaned: ProductVariant[] = variants.map((variant) => ({
      ...(variant.id ? { id: variant.id } : {}),
      sku: variant.sku.trim(),
      price: variant.price,
      oldPrice: variant.oldPrice,
      stock: variant.stock,
      status: variant.status,
      options: variant.options
        .map((option) => ({ name: option.name.trim(), value: option.value.trim() }))
        .filter((option) => option.name && option.value),
    }));

    onSubmit({
      ...values,
      ...(variantsReady
        ? { photos: photos.map((p) => p.trim()).filter(Boolean), variants: cleaned }
        : {}),
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {product ? t("products.dialog.edit") : t("products.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("products.dialog.desc")}</Dialog.Description>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="mt-4 flex max-h-[70vh] flex-col gap-3 overflow-y-auto"
        >
          <Field
            label={t("form.name")}
            error={errors.name?.message ? t(errors.name?.message as TKey) : undefined}
          >
            <Input
              {...register("name")}
              invalid={!!errors.name}
              placeholder="iPhone 15 Pro"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label={t("form.brand")}
              error={errors.brand?.message ? t(errors.brand?.message as TKey) : undefined}
            >
              <Select
                {...register("brand")}
                invalid={!!errors.brand}
                disabled={brandsLoading}
              >
                <option value="">{brandsLoading ? t("common.loading") : "—"}</option>
                {brands?.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              label={t("form.category")}
              error={
                errors.category?.message ? t(errors.category?.message as TKey) : undefined
              }
            >
              <Select
                {...register("category")}
                invalid={!!errors.category}
                disabled={categoriesLoading}
              >
                <option value="">{categoriesLoading ? t("common.loading") : "—"}</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label={t("form.priceM")}
              error={errors.price?.message ? t(errors.price?.message as TKey) : undefined}
            >
              <Input
                type="number"
                min={0}
                {...register("price")}
                invalid={!!errors.price}
              />
            </Field>
            <Field
              label={t("form.stockPcs")}
              error={errors.stock?.message ? t(errors.stock?.message as TKey) : undefined}
            >
              <Input
                type="number"
                min={0}
                {...register("stock")}
                invalid={!!errors.stock}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink/70">
              {t("form.status")}
            </label>
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
                  {t(PRODUCT_STATUS[key].labelKey)}
                </button>
              ))}
            </div>
          </div>

          {product && !variantsReady ? (
            <p className="rounded-xl border border-dashed border-line px-3 py-4 text-center text-xs text-faint">
              {t("products.variant.loading")}
            </p>
          ) : (
            <>
              <PhotosEditor photos={photos} onChange={setPhotos} />
              <VariantsEditor
                variants={variants}
                onChange={setVariants}
                errors={variantErrors}
              />
            </>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
