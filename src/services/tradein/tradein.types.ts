export type TradeinConditionKey = "excellent" | "good" | "fair";
export type TradeinStatusKey = "new" | "review" | "approved" | "rejected";

export type TradeinItem = {
  id: string;
  seq?: number;
  customerId?: string;
  customerName?: string;
  phone?: string;
  brand?: string;
  model?: string;
  condition?: TradeinConditionKey | string;
  status: TradeinStatusKey;
  created?: string;
  // Legacy / fallback fields if needed
  device?: string;
  customer?: string;
  date?: string;
  estimate?: number;
  st?: TradeinStatusKey;
};

/** Alias for backward compatibility */
export type TradeinRequest = TradeinItem;

export type UpdateTradeinStatusInput = {
  id: string;
  status: TradeinStatusKey;
};

export type GetTradeinParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  customerId?: string;
  condition?: TradeinConditionKey | string;
  status?: TradeinStatusKey | string;
  lang?: string;
};

export type GetTradeinResponse = {
  count: number;
  tradeIn: TradeinItem[];
};

export type DeleteTradeinResponse = {
  deleted: boolean;
};

export type UpdateTradeinStatusResponse = {
  completed: boolean;
};
