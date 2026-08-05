export type PreorderStatusKey = "new" | "prepay" | "ready" | "done";

export type Preorder = {
  num: string;
  date: string;
  product: string;
  customer: string;
  prepay: number;
  total: number;
  st: PreorderStatusKey;
};
