import { ArrowUp, ArrowDown, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useT } from "@/i18n/useT";
import { useLangStore } from "@/store/i18n.store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { HomeBlock } from "@/services/home/home.types";
import { KIND_LABEL } from "../lib/home.helpers";

type BlockListProps = {
  blocks: HomeBlock[];
  onMove: (index: number, dir: -1 | 1) => void;
  onToggleStatus: (block: HomeBlock) => void;
  onEdit: (block: HomeBlock) => void;
  onDelete: (block: HomeBlock) => void;
  isReordering?: boolean;
};

export function BlockList({
  blocks,
  onMove,
  onToggleStatus,
  onEdit,
  onDelete,
  isReordering,
}: BlockListProps) {
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex flex-col divide-y divide-line">
        {/* Header indicator */}
        <StaticRow label={t("home.static.header")} />

        {blocks.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">
            {t("common.empty")}
          </div>
        ) : (
          blocks.map((block, index) => {
            const title = lang === "tk" ? (block.titleTk || block.titleRu) : (block.titleRu || block.titleTk);
            const subtitle = lang === "tk" ? (block.subtitleTk || block.subtitleRu) : (block.subtitleRu || block.subtitleTk);
            const isActive = block.status === "active";

            return (
              <div
                key={block.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-canvas/40",
                  !isActive && "opacity-60 bg-canvas/20",
                )}
              >
                <span className="w-7 shrink-0 text-center text-sm font-bold text-muted">
                  {index + 1}
                </span>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="truncate text-sm font-bold text-ink">
                      {title || t(KIND_LABEL[block.kind] || block.kind)}
                    </span>
                    <Badge variant="outline" className="text-[11px] font-normal capitalize">
                      {t(KIND_LABEL[block.kind] || block.kind)}
                    </Badge>
                    {block.productSource && (
                      <span className="rounded bg-brand-soft/60 px-1.5 py-0.5 text-[11px] font-semibold text-brand-dark">
                        {block.productSource}
                      </span>
                    )}
                    {block.category && (
                      <span className="rounded bg-canvas px-1.5 py-0.5 text-[11px] font-medium text-ink/70">
                        {lang === "tk" ? block.category.nameTk : block.category.nameRu}
                      </span>
                    )}
                  </div>
                  {subtitle && (
                    <span className="truncate text-xs text-muted mt-0.5">
                      {subtitle}
                    </span>
                  )}
                </div>

                <div className="ml-auto flex items-center gap-1">
                  <IconButton
                    onClick={() => onToggleStatus(block)}
                    aria-label={
                      isActive ? t("home.action.hide") : t("home.action.show")
                    }
                    title={isActive ? t("home.action.hide") : t("home.action.show")}
                  >
                    {isActive ? (
                      <Eye className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted" />
                    )}
                  </IconButton>
                  <IconButton
                    onClick={() => onMove(index, -1)}
                    disabled={index === 0 || isReordering}
                    aria-label={t("home.action.up")}
                    title={t("home.action.up")}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    onClick={() => onMove(index, 1)}
                    disabled={index === blocks.length - 1 || isReordering}
                    aria-label={t("home.action.down")}
                    title={t("home.action.down")}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    onClick={() => onEdit(block)}
                    aria-label={t("common.edit")}
                    title={t("common.edit")}
                  >
                    <Pencil className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(block)}
                    danger
                    aria-label={t("common.delete")}
                    title={t("common.delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            );
          })
        )}

        {/* Footer indicator */}
        <StaticRow label={t("home.static.footer")} />
      </div>
    </Card>
  );
}

function StaticRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 bg-canvas/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-faint">
      {label}
    </div>
  );
}

function IconButton({
  children,
  onClick,
  disabled,
  danger,
  title,
  ...rest
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
} & React.AriaAttributes) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
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
