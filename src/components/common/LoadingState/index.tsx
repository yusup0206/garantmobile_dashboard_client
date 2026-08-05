import { Loader2 } from "lucide-react";
import { useT } from "@/i18n/useT";

export function LoadingState({ label }: { label?: string }) {
  const t = useT();
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-muted">
      <Loader2 className="h-5 w-5 animate-spin text-brand" />
      <span className="text-sm font-medium">{label ?? t("common.loading")}</span>
    </div>
  );
}
