export type ProductOptionValue = {
  id: string;
  optionId: string;
  valueRu: string;
  valueTk: string;
  hex: string;
  sortOrder: number;
};

export type ProductOptionValueInput = {
  optionId: string;
  valueRu: string;
  valueTk: string;
  hex: string;
  sortOrder: number;
};

export type GetProductOptionValuesParams = {
  page?: number;
  pageSize?: number;
  optionId?: string;
};

export type GetProductOptionValuesResponse = {
  count: number;
  values: ProductOptionValue[];
};
