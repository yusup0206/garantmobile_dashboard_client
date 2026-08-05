import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/i18n/useT";

export function ErrorState({ title, onRetry }: { title?: string; onRetry?: () => void }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-100 text-red-600">
        <AlertTriangle className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <p className="font-display font-bold text-ink">{title ?? t("common.error")}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t("common.retry")}
        </Button>
      ) : null}
    </div>
  );
}
