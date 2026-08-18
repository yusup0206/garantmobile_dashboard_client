export type VariantOptionValue = {
  variantId: string;
  optionValueId: string;
};

export type VariantOptionValueInput = {
  variantId: string;
  optionValueId: string;
};

export type GetVariantOptionValuesParams = {
  page?: number;
  pageSize?: number;
  variantId?: string;
  optionValueId?: string;
};

export type GetVariantOptionValuesResponse = {
  count: number;
  links: VariantOptionValue[];
};
