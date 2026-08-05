import { initials } from "@/lib/format";
import type { Dialog } from "@/services/chat/chat.types";

/** Two-letter avatar initials for a dialog's customer. */
export function dialogInitials(dialog: Dialog): string {
  return initials(dialog.name);
}

/** Find the active dialog, falling back to the first one. */
export function findDialog(dialogs: Dialog[], id: string): Dialog | undefined {
  return dialogs.find((d) => d.id === id) ?? dialogs[0];
}
