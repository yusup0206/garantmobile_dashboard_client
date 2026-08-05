import { MoreHorizontal, Check } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import type { StatusMeta } from "@/components/common/StatusBadge";
import { useT } from "@/i18n/useT";
import type { TKey } from "@/i18n/dict";

export type StatusOption = {
  key: string;
  meta: StatusMeta;
};

type StatusMenuProps = {
  options: StatusOption[];
  value: string;
  onSelect: (key: string) => void;
  label?: TKey;
};

/** Row-level status switcher: a ⋯ trigger listing the available statuses. */
export function StatusMenu({
  options,
  value,
  onSelect,
  label = "common.changeStatus",
}: StatusMenuProps) {
  const t = useT();
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button
          type="button"
          aria-label={t(label)}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        {options.map((o) => (
          <Dropdown.Item key={o.key} onSelect={() => onSelect(o.key)}>
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: o.meta.dot ?? o.meta.fg }}
            />
            <span className="flex-1">{t(o.meta.labelKey)}</span>
            {o.key === value ? <Check className="h-4 w-4 text-brand" /> : null}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
