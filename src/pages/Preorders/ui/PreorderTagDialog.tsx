import { useEffect, useState } from "react";
import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { PreorderTag, PreorderTagInput } from "@/services/preorders/preorders.types";

type PreorderTagDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: PreorderTag | null;
  onSubmit: (values: PreorderTagInput) => void;
  pending?: boolean;
};

export function PreorderTagDialog({
  open,
  onOpenChange,
  tag,
  onSubmit,
  pending,
}: PreorderTagDialogProps) {
  const t = useT();
  const [nameTk, setNameTk] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [errors, setErrors] = useState<{ nameTk?: boolean; nameRu?: boolean }>({});

  useEffect(() => {
    if (tag) {
      setNameTk(tag.nameTk || "");
      setNameRu(tag.nameRu || "");
    } else {
      setNameTk("");
      setNameRu("");
    }
    setErrors({});
  }, [tag, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: { nameTk?: boolean; nameRu?: boolean } = {};
    if (!nameTk.trim()) newErrors.nameTk = true;
    if (!nameRu.trim()) newErrors.nameRu = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      nameTk: nameTk.trim(),
      nameRu: nameRu.trim(),
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {tag ? t("preorders.tags.dialog.edit") : t("preorders.tags.dialog.new")}
        </Dialog.Title>
        <Dialog.Description>{t("preorders.tags.dialog.desc")}</Dialog.Description>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              {t("preorders.tags.field.nameTk")} *
            </label>
            <Input
              value={nameTk}
              onChange={(e) => {
                setNameTk(e.target.value);
                if (errors.nameTk) setErrors((prev) => ({ ...prev, nameTk: false }));
              }}
              invalid={errors.nameTk}
              placeholder={t("preorders.tags.placeholder.tk")}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              {t("preorders.tags.field.nameRu")} *
            </label>
            <Input
              value={nameRu}
              onChange={(e) => {
                setNameRu(e.target.value);
                if (errors.nameRu) setErrors((prev) => ({ ...prev, nameRu: false }));
              }}
              invalid={errors.nameRu}
              placeholder={t("preorders.tags.placeholder.ru")}
            />
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
              {pending ? t("common.saving") : tag ? t("common.save") : t("common.create")}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
