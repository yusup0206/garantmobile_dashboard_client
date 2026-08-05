import { cn } from "@/lib/cn";
import type { DialogListProps } from "../types";
import { dialogInitials } from "../lib/chat.helpers";

export function DialogList({ dialogs, selectedId, onSelect }: DialogListProps) {
  return (
    <div className="max-h-44 w-full shrink-0 overflow-y-auto border-b border-line sm:max-h-none sm:w-72 sm:border-b-0 sm:border-r">
      {dialogs.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => onSelect(d.id)}
          className={cn(
            "flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition-colors hover:bg-canvas/60",
            d.id === selectedId && "bg-brand-soft hover:bg-brand-soft",
          )}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft font-display text-xs font-bold text-brand-dark">
            {dialogInitials(d)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-semibold text-ink">{d.name}</span>
              <span className="shrink-0 text-xs text-faint">{d.time}</span>
            </div>
            <div className="mt-0.5 flex items-center justify-between gap-2">
              <span className="truncate text-xs text-muted">{d.last}</span>
              {d.unread > 0 ? (
                <span className="shrink-0 rounded-full bg-brand px-1.5 text-xs font-semibold text-white">
                  {d.unread}
                </span>
              ) : null}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
