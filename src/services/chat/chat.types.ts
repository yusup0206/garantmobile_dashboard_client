export type ChatMessage = {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
};

export type Dialog = {
  id: string;
  name: string;
  last: string;
  time: string;
  unread: number;
  messages: ChatMessage[];
};
