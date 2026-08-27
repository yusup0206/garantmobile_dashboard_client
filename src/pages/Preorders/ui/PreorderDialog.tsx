import { useEffect, useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

import { useBrands } from "@/services/brands/useBrands";
import { useCategories } from "@/services/categories/useCategories";
import { useProducts } from "@/services/products/useProducts";
import { useProductVariants } from "@/services/productVariants/useProductVariants";
import { usePreorderTags } from "@/services/preorders/usePreorders";
import type { PreorderItem, PreorderInput } from "@/services/preorders/preorders.types";

type PreorderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preorder: PreorderItem | null;
  onSubmit: (values: PreorderInput) => void;
  pending?: boolean;
};

export function PreorderDialog({
  open,
  onOpenChange,
  preorder,
  onSubmit,
  pending,
}: PreorderDialogProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  // Form states
  const [titleTk, setTitleTk] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagId, setTagId] = useState("");
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [targetSize, setTargetSize] = useState<number | "">(0);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // External lookups
  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();
  const { data: tagsData } = usePreorderTags({ pageSize: 100 });
  const { data: productsData } = useProducts({ pageSize: 100 });
  const { data: variantsData } = useProductVariants(
    productId ? { productId, pageSize: 100 } : undefined,
  );

  const brands = useMemo(() => brandsData?.brands ?? [], [brandsData]);
  const categories = useMemo(() => categoriesData?.categories ?? [], [categoriesData]);
  const tags = useMemo(() => tagsData?.preorderTags ?? [], [tagsData]);
  const products = useMemo(() => productsData?.products ?? [], [productsData]);
  const variants = useMemo(() => variantsData?.variants ?? [], [variantsData]);

  useEffect(() => {
    if (preorder) {
      setTitleTk(preorder.titleTk || "");
      setTitleRu(preorder.titleRu || "");
      setBrandId(preorder.brandId || "");
      setCategoryId(preorder.categoryId || "");
      setTagId(preorder.tagId || "");
      setProductId(preorder.productId || "");
      setVariantId(preorder.variantId || "");
      setReleaseDate(
        preorder.releaseDate ? preorder.releaseDate.split("T")[0] : "",
      );
      setTargetSize(preorder.targetSize ?? 0);
    } else {
      setTitleTk("");
      setTitleRu("");
      setBrandId(brands[0]?.id || "");
      setCategoryId(categories[0]?.id || "");
      setTagId(tags[0]?.id || "");
      setProductId("");
      setVariantId("");
      setReleaseDate("");
      setTargetSize(10);
    }
    setErrors({});
  }, [preorder, open, brands, categories, tags]);

  // If product changed and has variants, pick the first or keep
  function handleProductChange(newProdId: string) {
    setProductId(newProdId);
    setVariantId("");
    // Auto-fill titles if empty
    const prod = products.find((p) => p.id === newProdId);
    if (prod && !titleTk && !titleRu) {
      setTitleTk(prod.nameTk || prod.nameRu || "");
      setTitleRu(prod.nameRu || prod.nameTk || "");
    }
    if (prod?.brandId) setBrandId(prod.brandId);
    if (prod?.categoryId) setCategoryId(prod.categoryId);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!titleTk.trim()) newErrors.titleTk = true;
    if (!titleRu.trim()) newErrors.titleRu = true;
    if (!brandId) newErrors.brandId = true;
    if (!categoryId) newErrors.categoryId = true;
    if (!tagId) newErrors.tagId = true;
    if (!productId) newErrors.productId = true;
    if (!variantId) newErrors.variantId = true;
    if (!releaseDate) newErrors.releaseDate = true;
    if (typeof targetSize !== "number" || targetSize < 0) newErrors.targetSize = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      titleTk: titleTk.trim(),
      titleRu: titleRu.trim(),
      brandId,
      categoryId,
      tagId,
      productId,
      variantId,
      releaseDate,
      targetSize: Number(targetSize),
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-xl max-h-[90vh] overflow-y-auto">
        <Dialog.Title>
          {preorder ? t("preorders.list.dialog.edit") : t("preorders.list.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("preorders.list.dialog.desc")}</Dialog.Description>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                {t("preorders.list.field.titleTk")} *
              </label>
              <Input
                value={titleTk}
                onChange={(e) => {
                  setTitleTk(e.target.value);
                  if (errors.titleTk) setErrors((prev) => ({ ...prev, titleTk: false }));
                }}
                invalid={errors.titleTk}
                placeholder="iPhone 16 Pro Max..."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                {t("preorders.list.field.titleRu")} *
              </label>
              <Input
                value={titleRu}
                onChange={(e) => {
                  setTitleRu(e.target.value);
                  if (errors.titleRu) setErrors((prev) => ({ ...prev, titleRu: false }));
                }}
                invalid={errors.titleRu}
                placeholder="iPhone 16 Pro Max..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                {t("preorders.list.field.product")} *
              </label>
              <Select
                value={productId}
                onChange={(e) => {
                  handleProductChange(e.target.value);
                  if (errors.productId) setErrors((prev) => ({ ...prev, productId: false }));
                }}
                invalid={errors.productId}
              >
                <option value="">{t("preorders.list.selectProduct")}</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {lang === "tk" ? p.nameTk || p.nameRu : p.nameRu || p.nameTk}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                {t("preorders.list.field.variant")} *
              </label>
              <Select
                value={variantId}
                onChange={(e) => {
                  setVariantId(e.target.value);
                  if (errors.variantId) setErrors((prev) => ({ ...prev, variantId: false }));
                }}
                invalid={errors.variantId}
                disabled={!productId}
              >
                <option value="">{t("preorders.list.selectVariant")}</option>
                {variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.barcode || v.id} ({v.price} TMT)
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                {t("preorders.list.field.category")} *
              </label>
              <Select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: false }));
                }}
                invalid={errors.categoryId}
              >
                <option value="">{t("preorders.list.selectCategory")}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {lang === "tk" ? c.nameTk || c.nameRu : c.nameRu || c.nameTk}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                {t("preorders.list.field.brand")} *
              </label>
              <Select
                value={brandId}
                onChange={(e) => {
                  setBrandId(e.target.value);
                  if (errors.brandId) setErrors((prev) => ({ ...prev, brandId: false }));
                }}
                invalid={errors.brandId}
              >
                <option value="">{t("preorders.list.selectBrand")}</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                {t("preorders.list.field.tag")} *
              </label>
              <Select
                value={tagId}
                onChange={(e) => {
                  setTagId(e.target.value);
                  if (errors.tagId) setErrors((prev) => ({ ...prev, tagId: false }));
                }}
                invalid={errors.tagId}
              >
                <option value="">{t("preorders.list.selectTag")}</option>
                {tags.map((tg) => (
                  <option key={tg.id} value={tg.id}>
                    {lang === "tk" ? tg.nameTk : tg.nameRu}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                {t("preorders.list.field.releaseDate")} *
              </label>
              <Input
                type="date"
                value={releaseDate}
                onChange={(e) => {
                  setReleaseDate(e.target.value);
                  if (errors.releaseDate) setErrors((prev) => ({ ...prev, releaseDate: false }));
                }}
                invalid={errors.releaseDate}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
                {t("preorders.list.field.targetSize")} *
              </label>
              <Input
                type="number"
                min="0"
                value={targetSize}
                onChange={(e) => {
                  setTargetSize(e.target.value === "" ? "" : Number(e.target.value));
                  if (errors.targetSize) setErrors((prev) => ({ ...prev, targetSize: false }));
                }}
                invalid={errors.targetSize}
                placeholder="100"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : preorder ? t("common.save") : t("common.create")}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
