export type PaymentType = {
  id: string;
  titleTk: string;
  descriptionTk: string;
  titleRu: string;
  descriptionRu: string;
  icon?: string;
  isActive: boolean | string;
  paymentProcent: number;
  paymentBonus: number;
  isOverpayment: boolean | string;
  sortOrder: number;
};

export type PaymentTypeInput = {
  titleTk: string;
  descriptionTk: string;
  titleRu: string;
  descriptionRu: string;
  icon?: string;
  isActive: boolean;
  paymentProcent: number;
  paymentBonus: number;
  isOverpayment: boolean;
  sortOrder: number;
};

export type GetPaymentTypesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean | string;
  isOverpayment?: boolean | string;
  lang?: string;
};

export type GetPaymentTypesResponse = {
  count: number;
  paymentTypes: PaymentType[];
};

export type DeletePaymentTypeResponse = {
  deleted: boolean;
};

/** Backward compatibility aliases */
export type Payment = PaymentType;
