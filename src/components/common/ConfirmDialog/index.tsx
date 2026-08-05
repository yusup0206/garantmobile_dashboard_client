import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useT } from "@/i18n/useT";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  pending?: boolean;
  danger?: boolean;
};

/** Reusable confirmation dialog (delete, discard, …) built on the Radix wrapper. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  pending,
  danger,
}: ConfirmDialogProps) {
  const t = useT();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-sm">
        <Dialog.Title>{title}</Dialog.Title>
        {description ? <Dialog.Description>{description}</Dialog.Description> : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel ?? t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? "…" : (confirmLabel ?? t("common.confirm"))}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
