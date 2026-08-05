export type CustomerTier = "vip" | "active" | "new";

export type Customer = {
  id: number;
  name: string;
  city: string;
  orders: number;
  spent: number;
  tier: CustomerTier;
  bonusBalance: number;
};

export type BonusReason = "earn" | "spend" | "adjust" | "revoke" | "refund";

export type BonusTxn = {
  id: number;
  delta: number;
  reason: BonusReason;
  orderNumber: string | null;
  note: string | null;
  date: string;
};

/** Signed manual bonus correction against one customer. */
export type AdjustBonusInput = { delta: number; note?: string };
