import { Plus, X } from "lucide-react";
import { useT } from "@/i18n/useT";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/common/ImageUploadField";

/** Ordered list of product image URLs, each editable/uploadable, with add/remove. */
export function PhotosEditor({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const t = useT();
  const setAt = (index: number, url: string) =>
    onChange(photos.map((p, i) => (i === index ? url : p)));
  const removeAt = (index: number) =>
    onChange(photos.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink/70">
          {t("products.photos.title")}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...photos, ""])}
        >
          <Plus className="h-4 w-4" />
          {t("products.photos.add")}
        </Button>
      </div>

      {photos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-3 py-3 text-center text-xs text-faint">
          {t("products.photos.empty")}
        </p>
      ) : (
        photos.map((photo, index) => (
          <div
            key={index}
            className="flex items-start gap-2 rounded-xl border border-line p-2"
          >
            <div className="min-w-0 flex-1">
              <ImageUploadField value={photo} onChange={(url) => setAt(index, url)} />
            </div>
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={t("common.delete")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
