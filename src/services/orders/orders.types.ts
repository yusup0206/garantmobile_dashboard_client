export type OrderStatusKey = "proc" | "done" | "cancel";

export type Order = {
  num: string;
  date: string;
  st: OrderStatusKey;
  ids: number[];
  total: number;
};
