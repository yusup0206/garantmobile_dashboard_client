export type ProductSpecDefinition = {
  id: string;
  nameRu: string;
  nameTk: string;
};

export type ProductSpecDefinitionInput = {
  nameRu: string;
  nameTk: string;
};

export type GetProductSpecDefinitionsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  innerCategoryId?: string;
};

export type GetProductSpecDefinitionsResponse = {
  count: number;
  definitions: ProductSpecDefinition[];
};
