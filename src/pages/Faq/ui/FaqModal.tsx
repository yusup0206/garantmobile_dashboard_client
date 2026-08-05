import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { FaqEntry, CreateFaqDto } from "@/services/faq/faq.types";

interface FaqModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateFaqDto) => Promise<void> | void;
  initialData?: FaqEntry | null;
  isLoading?: boolean;
}

export function FaqModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
}: FaqModalProps) {
  const [questionTk, setQuestionTk] = useState("");
  const [answerTk, setAnswerTk] = useState("");
  const [questionRu, setQuestionRu] = useState("");
  const [answerRu, setAnswerRu] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [chatVisible, setChatVisible] = useState(true);

  useEffect(() => {
    if (initialData) {
      setQuestionTk(initialData.questionTk || "");
      setAnswerTk(initialData.answerTk || "");
      setQuestionRu(initialData.questionRu || "");
      setAnswerRu(initialData.answerRu || "");
      setIsPublished(initialData.isPublished ?? true);
      setChatVisible(initialData.chatVisible ?? true);
    } else {
      setQuestionTk("");
      setAnswerTk("");
      setQuestionRu("");
      setAnswerRu("");
      setIsPublished(true);
      setChatVisible(true);
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      questionTk,
      answerTk,
      questionRu,
      answerRu,
      isPublished,
      chatVisible,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Title>
          {initialData ? "FAQ redaktirlemek" : "Täze FAQ goşmak"}
        </Dialog.Title>
        <Dialog.Description>
          FAQ sorag-jogap maglumatlaryny giriziň
        </Dialog.Description>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase">
              Sorag (TK)
            </label>
            <Input
              value={questionTk}
              onChange={(e) => setQuestionTk(e.target.value)}
              placeholder="Türkmen dilinde sorag"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase">
              Jogap (TK)
            </label>
            <textarea
              className="w-full min-h-[80px] rounded-xl border border-line bg-canvas p-3 font-sans text-sm text-ink outline-none focus:border-brand focus:bg-white"
              value={answerTk}
              onChange={(e) => setAnswerTk(e.target.value)}
              placeholder="Türkmen dilinde jogap"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase">
              Sorag (RU)
            </label>
            <Input
              value={questionRu}
              onChange={(e) => setQuestionRu(e.target.value)}
              placeholder="Вопрос на русском"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase">
              Jogap (RU)
            </label>
            <textarea
              className="w-full min-h-[80px] rounded-xl border border-line bg-canvas p-3 font-sans text-sm text-ink outline-none focus:border-brand focus:bg-white"
              value={answerRu}
              onChange={(e) => setAnswerRu(e.target.value)}
              placeholder="Ответ на русском"
              required
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-ink">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
              />
              Ýaýlyma çykarylan (isPublished)
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-ink">
              <input
                type="checkbox"
                checked={chatVisible}
                onChange={(e) => setChatVisible(e.target.checked)}
                className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
              />
              Çatda görünýän (chatVisible)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Ýapmak
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Ýüklenýär..." : initialData ? "Ýatda sakla" : "Goş"}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
