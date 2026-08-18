export type ProductSpecValue = {
  id: string;
  specId: string;
  valueRu: string;
  valueTm: string;
  sortOrder: number;
};

export type ProductSpecValueInput = {
  specId: string;
  valueRu: string;
  valueTm: string;
  sortOrder: number;
};

export type GetProductSpecValuesParams = {
  page?: number;
  pageSize?: number;
  specId?: string;
  search?: string;
};

export type GetProductSpecValuesResponse = {
  count: number;
  values: ProductSpecValue[];
};
