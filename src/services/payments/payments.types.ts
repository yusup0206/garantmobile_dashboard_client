export type PaymentStatusKey = "paid" | "pending" | "failed" | "refund";

export type PaymentMethod = "card" | "cash" | "transfer";

export type Payment = {
  id: string;
  order: string;
  method: PaymentMethod;
  amount: number;
  date: string;
  st: PaymentStatusKey;
};
