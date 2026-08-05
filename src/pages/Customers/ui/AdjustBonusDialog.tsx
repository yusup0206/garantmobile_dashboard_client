import { useEffect, useState } from "react";

import { useT } from "@/i18n/useT";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { fmt } from "@/lib/format";
import type { TKey } from "@/i18n/dict";
import { useCustomerBonuses, useAdjustBonus } from "@/services/customers/useCustomers";
import type { BonusReason, Customer } from "@/services/customers/customers.types";

type AdjustBonusDialogProps = {
  customer: Customer | null;
  onOpenChange: (open: boolean) => void;
};

const REASON_LABEL: Record<BonusReason, TKey> = {
  earn: "cust.br.earn",
  spend: "cust.br.spend",
  refund: "cust.br.refund",
  revoke: "cust.br.revoke",
  adjust: "cust.br.adjust",
};

/** Staff manual loyalty correction with the customer's recent ledger for context. */
export function AdjustBonusDialog({ customer, onOpenChange }: AdjustBonusDialogProps) {
  const t = useT();
  const open = customer !== null;
  const { data: history = [] } = useCustomerBonuses(customer?.id ?? null);
  const adjust = useAdjustBonus();

  const [mode, setMode] = useState<"credit" | "deduct">("credit");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMode("credit");
      setAmount("");
      setNote("");
      setError(null);
    }
  }, [open, customer?.id]);

  if (!customer) return null;
  const balance = customer.bonusBalance;

  const submit = async () => {
    setError(null);
    const value = Number(amount);
    if (!Number.isInteger(value) || value <= 0) {
      setError(t("cust.bonus.err_amount"));
      return;
    }
    if (mode === "deduct" && value > balance) {
      setError(t("cust.bonus.err_over"));
      return;
    }
    try {
      await adjust.mutateAsync({
        id: customer.id,
        input: { delta: mode === "credit" ? value : -value, note: note.trim() || undefined },
      });
      onOpenChange(false);
    } catch {
      setError(t("cust.bonus.err_failed"));
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>{t("cust.bonus.title")}</Dialog.Title>
        <Dialog.Description>{customer.name}</Dialog.Description>

        <div className="mt-4 flex flex-col gap-3">
          <div className="rounded-xl border border-line bg-canvas px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">
              {t("cust.bonus.balance")}
            </div>
            <div className="font-display text-2xl font-bold text-ink tabular-nums">
              {fmt(balance)} <span className="text-sm font-semibold">{t("cust.bonus.unit")}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink/70">{t("cust.bonus.op")}</span>
            <div className="inline-flex w-fit rounded-xl border border-line bg-canvas p-1">
              {(["credit", "deduct"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                    mode === m ? "bg-brand text-white" : "text-muted hover:text-ink",
                  )}
                >
                  {t(m === "credit" ? "cust.bonus.credit" : "cust.bonus.deduct")}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink/70">{t("cust.bonus.amount")}</span>
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-ink/70">{t("cust.bonus.note")}</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("cust.bonus.note_ph")}
              className="h-16 w-full resize-none rounded-xl border border-line bg-canvas p-3 text-sm outline-none focus:border-brand"
            />
          </label>

          {history.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink/70">{t("cust.bonus.history")}</span>
              <ul className="flex max-h-40 flex-col gap-1 overflow-y-auto">
                {history.slice(0, 12).map((tx) => (
                  <li
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border border-line px-3 py-1.5 text-sm"
                  >
                    <span className="text-muted">
                      {t(REASON_LABEL[tx.reason])}
                      {tx.orderNumber ? ` · ${tx.orderNumber}` : ""}
                    </span>
                    <span
                      className={cn(
                        "font-semibold tabular-nums",
                        tx.delta >= 0 ? "text-emerald-600" : "text-red-600",
                      )}
                    >
                      {tx.delta >= 0 ? "+" : "−"}
                      {fmt(Math.abs(tx.delta))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error ? <p className="text-xs text-red-600">{error}</p> : null}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="button" onClick={submit} disabled={adjust.isPending}>
              {adjust.isPending ? t("cust.bonus.submitting") : t("cust.bonus.submit")}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
