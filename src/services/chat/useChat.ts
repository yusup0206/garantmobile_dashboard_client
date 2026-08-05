import { useQuery } from "@tanstack/react-query";
import { getDialogs } from "./chat.api";

export const chatKeys = {
  all: ["chat"] as const,
};

export function useChat() {
  return useQuery({ queryKey: chatKeys.all, queryFn: getDialogs });
}
