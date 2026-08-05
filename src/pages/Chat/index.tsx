import { useRef, useState } from "react";
import { useT } from "@/i18n/useT";

import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Card } from "@/components/ui/Card";
import { useChat } from "@/services/chat/useChat";
import type { ChatMessage } from "@/services/chat/chat.types";

import { DialogList } from "./ui/DialogList";
import { MessageThread } from "./ui/MessageThread";
import { findDialog } from "./lib/chat.helpers";

export default function ChatPage() {
  const t = useT();
  const { data, isLoading, isError, refetch } = useChat();

  // Selected dialog id (empty falls back to the first dialog on render).
  const [selectedId, setSelectedId] = useState("");
  // Locally-sent messages, kept per dialog (demo — no backend round-trip).
  const [sent, setSent] = useState<Record<string, ChatMessage[]>>({});
  const nextId = useRef(100000);

  const selected = data ? findDialog(data, selectedId) : undefined;
  const messages = selected ? [...selected.messages, ...(sent[selected.id] ?? [])] : [];

  function handleSend(text: string) {
    if (!selected) return;
    const message: ChatMessage = {
      id: nextId.current++,
      from: "me",
      text,
      time: t("chat.now"),
    };
    setSent((prev) => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] ?? []), message],
    }));
  }

  return (
    <div>
      <PageHeader title={t("page.chat.title")} subtitle={t("page.chat.subtitle")} />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !selected ? (
        <EmptyState title={t("chat.empty")} />
      ) : (
        <Card className="h-[calc(100vh-12rem)] min-h-[420px] overflow-hidden p-0">
          <div className="flex h-full flex-col md:flex-row">
            <DialogList
              dialogs={data ?? []}
              selectedId={selected.id}
              onSelect={setSelectedId}
            />
            <MessageThread name={selected.name} messages={messages} onSend={handleSend} />
          </div>
        </Card>
      )}
    </div>
  );
}
