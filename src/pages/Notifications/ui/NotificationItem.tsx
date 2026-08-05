import { useT } from "@/i18n/useT";
import { cn } from "@/lib/cn";
import type { AppNotification } from "@/services/notifications/notifications.types";
import { TYPE_META } from "../lib/notifications.helpers";

type NotificationItemProps = {
  item: AppNotification;
  onMarkRead: (id: number) => void;
};

export function NotificationItem({ item, onMarkRead }: NotificationItemProps) {
  const t = useT();
  const meta = TYPE_META[item.kind];
  const Icon = meta.icon;

  return (
    <button
      type="button"
      onClick={() => !item.read && onMarkRead(item.id)}
      disabled={item.read}
      className={cn(
        "flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors",
        item.read ? "cursor-default" : "bg-brand-soft/30 hover:bg-brand-soft/60",
      )}
      aria-label={item.read ? undefined : t("notifications.markReadAria") + item.text}
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
        style={{ color: meta.fg, background: meta.bg }}
      >
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className={cn("font-medium", item.read ? "text-muted" : "text-ink")}>
          {item.text}
        </p>
        <p className="text-xs text-muted">{item.time}</p>
      </div>

      {!item.read ? <span className="h-2 w-2 shrink-0 rounded-full bg-brand" /> : null}
    </button>
  );
}
