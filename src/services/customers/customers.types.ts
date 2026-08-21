export type CustomerTier = "vip" | "active" | "new";

export type CustomerFilterType =
  | "createdDate"
  | "orderCount"
  | "bonusBalance"
  | "repeatCustomers"
  | "newsForMonth";

export type Customer = {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  city: string | null;
  tier: CustomerTier;
  bonusBalance: number;
  ordersCount: number;
  theme?: string;
  isBlocked: boolean;
};

export type GetCustomersParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  filterType?: CustomerFilterType;
};

export type GetCustomersResponse = {
  count: number;
  customers: Customer[];
};
