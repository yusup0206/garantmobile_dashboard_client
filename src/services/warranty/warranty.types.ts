export type WarrantyStatusKey = "new" | "service" | "resolved" | "rejected";

export type WarrantyClaim = {
  id: string;
  product: string;
  customer: string;
  date: string;
  st: WarrantyStatusKey;
};
