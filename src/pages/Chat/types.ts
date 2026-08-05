import type { ChatMessage, Dialog } from "@/services/chat/chat.types";

export type DialogListProps = {
  dialogs: Dialog[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export type MessageThreadProps = {
  name: string;
  messages: ChatMessage[];
  onSend: (text: string) => void;
};
