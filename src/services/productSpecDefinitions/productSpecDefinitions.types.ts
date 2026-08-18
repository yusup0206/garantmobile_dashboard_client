export type ProductSpecDefinition = {
  id: string;
  nameRu: string;
  nameTm: string;
};

export type ProductSpecDefinitionInput = {
  nameRu: string;
  nameTm: string;
};

export type GetProductSpecDefinitionsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type GetProductSpecDefinitionsResponse = {
  count: number;
  definitions: ProductSpecDefinition[];
};
