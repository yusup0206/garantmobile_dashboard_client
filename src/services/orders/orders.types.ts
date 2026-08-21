export type OrderStatusKey =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded" | string;

export type OrderItem = {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  productNameRu: string;
  productNameTk: string;
  photo?: string;
  selectedOptions?: Record<string, unknown>;
};

export type OrderCustomer = {
  id: string;
  name: string;
  phone: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerId?: string;
  status: OrderStatusKey;
  paymentStatus?: OrderPaymentStatus;
  currency?: string;
  itemsTotal?: string;
  deliveryCost?: string;
  discountTotal?: string;
  total: string;
  promoCodeId?: string;
  promoCode?: string;
  promoDiscountType?: "PERCENTAGE" | "FIXED" | string;
  promoDiscountValue?: string;
  recipientName?: string;
  recipientPhone?: string;
  deliveryAddress?: string;
  comment?: string;
  deliveryTypeId?: string;
  deliveryTitleRu?: string;
  deliveryTitleTk?: string;
  paymentTypeId?: string;
  paymentTitleRu?: string;
  paymentTitleTk?: string;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  created: string;
  updated: string;
  customer?: OrderCustomer;
  items?: OrderItem[];
};

export type GetOrdersParams = {
  page?: number;
  pageSize?: number;
  status?: OrderStatusKey;
  dateFrom?: string;
  dateTo?: string;
  customerId?: string;
  productId?: string;
  variantId?: string;
  lang?: string;
};

export type GetOrdersResponse = {
  count: number;
  orders: Order[];
};
