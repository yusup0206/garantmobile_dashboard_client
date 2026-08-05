import { Inbox } from "lucide-react";
import { useT } from "@/i18n/useT";

export function EmptyState({ title, hint }: { title?: string; hint?: string }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-surface py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-canvas text-faint">
        <Inbox className="h-6 w-6" strokeWidth={1.7} />
      </span>
      <p className="font-display font-bold text-ink">{title ?? t("common.empty")}</p>
      {hint ? <p className="max-w-xs text-sm text-muted">{hint}</p> : null}
    </div>
  );
}
