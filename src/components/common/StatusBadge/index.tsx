import { Badge } from "@/components/ui/Badge";
import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";

export type StatusMeta = {
  labelKey: TKey;
  fg: string;
  bg: string;
  dot?: string;
};

/** Reusable status pill driven by a meta object (order / warranty / campaign). */
export function StatusBadge({ meta }: { meta: StatusMeta }) {
  const t = useT();
  return (
    <Badge fg={meta.fg} bg={meta.bg}>
      {meta.dot ? (
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.dot }} />
      ) : null}
      {t(meta.labelKey)}
    </Badge>
  );
}
