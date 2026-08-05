export type TradeinStatusKey = "new" | "review" | "approved" | "rejected";

export type TradeinRequest = {
  id: string;
  device: string;
  customer: string;
  estimate: number;
  date: string;
  st: TradeinStatusKey;
};
