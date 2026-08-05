import { ArrowUp, ArrowDown, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { HomeBlock } from "@/services/home/home.types";
import { KIND_LABEL } from "../lib/home.helpers";

type BlockListProps = {
  blocks: HomeBlock[];
  onMove: (id: number, dir: -1 | 1) => void;
  onToggle: (id: number) => void;
  onEdit: (block: HomeBlock) => void;
  onDelete: (block: HomeBlock) => void;
};

export function BlockList({
  blocks,
  onMove,
  onToggle,
  onEdit,
  onDelete,
}: BlockListProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);
  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <Card className="p-0">
      <div className="flex flex-col divide-y divide-line">
        {/* Статичный Header — вне динамической зоны (ADR). */}
        <StaticRow label={t("home.static.header")} />

        {sorted.map((block, index) => {
          const name = lang === "ru" ? block.title.ru : block.title.tm || block.title.ru;
          return (
            <div
              key={block.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                !block.visible && "opacity-55",
              )}
            >
              <span className="w-6 shrink-0 text-center text-sm font-bold text-muted">
                {block.order}
              </span>

              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-bold text-ink">
                  {t(KIND_LABEL[block.kind])}
                </span>
                <span className="truncate text-xs text-muted">
                  {name || "—"}
                  {block.categorySlug ? (
                    <span className="ml-1.5 rounded bg-canvas px-1.5 py-0.5 text-[11px] font-semibold text-ink/70">
                      {block.categorySlug}
                    </span>
                  ) : null}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-1">
                <IconButton
                  onClick={() => onToggle(block.id)}
                  aria-label={
                    block.visible ? t("home.action.hide") : t("home.action.show")
                  }
                >
                  {block.visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </IconButton>
                <IconButton
                  onClick={() => onMove(block.id, -1)}
                  disabled={index === 0}
                  aria-label={t("home.action.up")}
                >
                  <ArrowUp className="h-4 w-4" />
                </IconButton>
                <IconButton
                  onClick={() => onMove(block.id, 1)}
                  disabled={index === sorted.length - 1}
                  aria-label={t("home.action.down")}
                >
                  <ArrowDown className="h-4 w-4" />
                </IconButton>
                <IconButton onClick={() => onEdit(block)} aria-label={t("common.edit")}>
                  <Pencil className="h-4 w-4" />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(block)}
                  danger
                  aria-label={t("common.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
          );
        })}

        <StaticRow label={t("home.static.footer")} />
      </div>
    </Card>
  );
}

function StaticRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 bg-canvas/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-faint">
      {label}
    </div>
  );
}

function IconButton({
  children,
  onClick,
  disabled,
  danger,
  ...rest
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
} & React.AriaAttributes) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors",
        "hover:bg-canvas hover:text-ink disabled:pointer-events-none disabled:opacity-30",
        danger && "hover:bg-red-50 hover:text-red-600",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
