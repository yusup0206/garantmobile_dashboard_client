import { useEffect, useRef, useState, type FormEvent } from "react";
import { useT } from "@/i18n/useT";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { MessageThreadProps } from "../types";

export function MessageThread({ name, messages, onSend }: MessageThreadProps) {
  const t = useT();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Keep the latest message in view as the thread grows.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-line p-4 font-display font-bold text-ink">
        {name}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                m.from === "me"
                  ? "self-end bg-brand text-white"
                  : "self-start bg-canvas text-ink",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="flex gap-2 border-t border-line p-3">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("chat.inputPlaceholder")}
          aria-label={t("form.message")}
        />
        <Button type="submit">{t("chat.send")}</Button>
      </form>
    </div>
  );
}
