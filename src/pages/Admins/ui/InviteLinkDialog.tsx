import { useEffect, useState } from "react";
import { Check, Copy, MailCheck } from "lucide-react";

import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type InviteLinkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The staff member being invited (for the dialog copy). */
  name?: string;
  /** The full accept-invite URL to share, or null while it is being issued. */
  link: string | null;
  /** True when the backend also e-mailed the link to the member. */
  emailed?: boolean;
  /** The recipient address, shown in the "sent" note. */
  email?: string;
};

/**
 * Shows the generated invite link so an admin can hand it to the new staff
 * member. The link carries a short-lived token; the invitee opens it to set a
 * password and sign in (there is no e-mail delivery in this build).
 */
export function InviteLinkDialog({
  open,
  onOpenChange,
  name,
  link,
  emailed,
  email,
}: InviteLinkDialogProps) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  // Reset the "copied" acknowledgement whenever the dialog reopens.
  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>{t("users.invite.title")}</Dialog.Title>
        <Dialog.Description>
          {name
            ? `${name} — ${t("users.invite.desc")}`
            : t("users.invite.desc")}
        </Dialog.Description>

        <div className="mt-4 flex flex-col gap-3">
          {emailed && email ? (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3.5 py-2.5">
              <MailCheck className="h-4 w-4 shrink-0 text-green-600" />
              <span className="text-xs font-semibold text-green-700">
                {t("users.invite.sent", { email })}
              </span>
            </div>
          ) : null}
          <div className="flex items-stretch gap-2">
            <Input
              readOnly
              value={link ?? ""}
              onFocus={(e) => e.currentTarget.select()}
              className="font-mono text-xs"
              aria-label={t("users.invite.linkLabel")}
            />
            <Button
              type="button"
              variant="outline"
              onClick={copy}
              disabled={!link}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? t("users.invite.copied") : t("users.invite.copy")}
            </Button>
          </div>
          <p className="text-xs text-muted">{t("users.invite.expiryNote")}</p>

          <div className="mt-1 flex justify-end">
            <Button type="button" onClick={() => onOpenChange(false)}>
              {t("common.close")}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
