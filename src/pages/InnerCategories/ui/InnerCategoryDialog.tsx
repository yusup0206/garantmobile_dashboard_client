import { useEffect, useMemo, useState } from "react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useProductSpecDefinitions } from "@/services/productSpecDefinitions/useProductSpecDefinitions";
import type {
  InnerCategory,
  InnerCategoryInput,
} from "@/services/innerCategories/innerCategories.types";

type InnerCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: InnerCategory | null;
  onSubmit: (values: InnerCategoryInput) => void;
  pending?: boolean;
};

export function InnerCategoryDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  pending,
}: InnerCategoryDialogProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const [name, setName] = useState("");
  const [selectedSpecIds, setSelectedSpecIds] = useState<string[]>([]);
  const [specSearch, setSpecSearch] = useState("");
  const [errors, setErrors] = useState<{ name?: boolean }>({});

  const { data: specDefsData } = useProductSpecDefinitions({ pageSize: 100 });
  const allSpecs = useMemo(
    () => specDefsData?.definitions ?? [],
    [specDefsData?.definitions],
  );

  const filteredSpecs = useMemo(() => {
    if (!specSearch.trim()) return allSpecs;
    const q = specSearch.toLowerCase();
    return allSpecs.filter((s) => {
      const label = lang === "tk" ? s.nameTk || s.nameRu : s.nameRu || s.nameTk;
      return label.toLowerCase().includes(q);
    });
  }, [allSpecs, specSearch, lang]);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSelectedSpecIds(category.categorySpecs?.map((s) => s.id) || []);
    } else {
      setName("");
      setSelectedSpecIds([]);
    }
    setSpecSearch("");
    setErrors({});
  }, [category, open]);

  function toggleSpec(id: string) {
    setSelectedSpecIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: true });
      return;
    }

    onSubmit({
      name: name.trim(),
      specIds: selectedSpecIds,
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-lg max-h-[90vh] overflow-y-auto">
        <Dialog.Title>
          {category
            ? t("innerCategories.dialog.edit")
            : t("innerCategories.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>
          {t("innerCategories.dialog.desc")}
        </Dialog.Description>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              {t("innerCategories.field.name")} *
            </label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ name: false });
              }}
              invalid={errors.name}
              placeholder="Флагманы, Ультрабуки..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              {t("innerCategories.field.specs")}
            </label>
            
            <Input
              value={specSearch}
              onChange={(e) => setSpecSearch(e.target.value)}
              placeholder={t("common.search")}
              className="mb-2 h-9 text-xs"
            />

            <div className="max-h-48 overflow-y-auto rounded-xl border border-line p-2 space-y-1.5 bg-canvas/50">
              {filteredSpecs.length === 0 ? (
                <div className="p-3 text-center text-xs text-muted">
                  {t("common.empty")}
                </div>
              ) : (
                filteredSpecs.map((spec) => {
                  const isChecked = selectedSpecIds.includes(spec.id);
                  const specName =
                    lang === "tk"
                      ? spec.nameTk || spec.nameRu
                      : spec.nameRu || spec.nameTk;

                  return (
                    <label
                      key={spec.id}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm hover:bg-surface transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSpec(spec.id)}
                        className="rounded border-line text-brand focus:ring-brand h-4 w-4"
                      />
                      <span className="text-ink font-medium">{specName}</span>
                    </label>
                  );
                })
              )}
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
              {pending
                ? t("common.saving")
                : category
                  ? t("common.save")
                  : t("common.create")}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
