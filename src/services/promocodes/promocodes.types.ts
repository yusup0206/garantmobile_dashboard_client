export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export type Promocode = {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  descriptionTk: string;
  descriptionRu: string;
  minOrderAmount: number;
  startsAt: string;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  isForNewClients: boolean;
  isActive: boolean;
};

/** Payload for create / update. */
export type PromocodeInput = Omit<Promocode, "id" | "usedCount">;

export type GetPromocodesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  discountType?: DiscountType;
  minOrderAmount?: number;
  usageLimit?: number;
  usedCount?: number;
  isForNewClients?: boolean;
  isActive?: boolean;
  startsAt?: string;
  expiresAt?: string;
  lang?: string;
};

export type GetPromocodesResponse = {
  count: number;
  promocodes: Promocode[];
};

export type DeletePromocodeResponse = {
  deleted: boolean;
};
