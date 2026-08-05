export type DeliveryType = {
  id: string;
  titleTk: string;
  descriptionTk: string;
  titleRu: string;
  descriptionRu: string;
  icon?: string;
  price: string | number;
  freeFrom?: string;
  deliveryTime?: string;
  discountForMethod: number;
  isSelfPickup: boolean | string;
  isActive: boolean | string;
  sortOrder: number;
};

export type DeliveryTypeInput = {
  titleTk: string;
  descriptionTk: string;
  titleRu: string;
  descriptionRu: string;
  icon?: string;
  price: number;
  freeFrom?: string;
  deliveryTime?: string;
  discountForMethod: number;
  isSelfPickup: boolean;
  isActive: boolean;
  sortOrder: number;
};

export type GetDeliveryTypesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean | string;
  isSelfPickup?: boolean | string;
  lang?: string;
};

export type GetDeliveryTypesResponse = {
  count: number;
  deliveryTypes: DeliveryType[];
};

export type DeleteDeliveryTypeResponse = {
  deleted: boolean;
};

/** Backward compatibility aliases */
export type Shipment = DeliveryType;
