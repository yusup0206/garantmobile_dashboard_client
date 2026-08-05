export type PromoStatusKey = "active" | "scheduled" | "expired";

export type Promocode = {
  code: string;
  kind: "percent" | "fixed";
  value: number;
  used: number;
  limit: number;
  period: string;
  st: PromoStatusKey;
};

/** Payload for create/update — everything except the usage counter. */
export type PromocodeInput = Omit<Promocode, "used">;
