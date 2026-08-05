import { useState } from "react";
import { ChevronDown, Edit2, Trash2 } from "lucide-react";

import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import type { FaqEntry } from "@/services/faq/faq.types";

interface FaqItemProps {
  entry: FaqEntry;
  onEdit: (entry: FaqEntry) => void;
  onDelete: (id: string) => void;
}

export function FaqItem({ entry, onEdit, onDelete }: FaqItemProps) {
  const [open, setOpen] = useState(false);

  const question = entry.questionTk || entry.questionRu;
  const answer = entry.answerTk || entry.answerRu;

  return (
    <div className="py-2">
      <div className="flex items-center justify-between gap-4 py-2 px-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex flex-1 items-center justify-between gap-4 text-left font-semibold text-ink"
        >
          <div className="flex items-center gap-3">
            <span>{question}</span>
            <div className="flex gap-1.5">
              {entry.isPublished ? (
                <Badge bg="rgba(16, 185, 129, 0.1)" fg="#10B981">
                  Published
                </Badge>
              ) : (
                <Badge bg="rgba(156, 163, 175, 0.1)" fg="#9CA3AF">
                  Draft
                </Badge>
              )}
              {entry.chatVisible && (
                <Badge bg="rgba(59, 130, 246, 0.1)" fg="#3B82F6">
                  Chat
                </Badge>
              )}
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-muted transition-transform",
              open && "rotate-180",
            )}
            strokeWidth={1.8}
          />
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(entry)}
            className="rounded-lg p-2 text-muted hover:bg-canvas hover:text-ink transition-colors"
            title="Redaktirlemek"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(entry.id)}
            className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
            title="Pozmak"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-1 pb-4 pt-2 text-sm text-muted space-y-2 border-t border-line/50 mt-2">
          <div>
            <span className="font-medium text-ink">TK: </span>
            {entry.answerTk}
          </div>
          {entry.answerRu && (
            <div>
              <span className="font-medium text-ink">RU: </span>
              {entry.answerRu}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
