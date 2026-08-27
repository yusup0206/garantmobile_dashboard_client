export type InnerCategorySpec = {
  id: string;
  nameRu: string;
  nameTk: string;
};

export type InnerCategory = {
  id: string;
  name: string;
  categorySpecs: InnerCategorySpec[];
};

export type InnerCategoryInput = {
  name: string;
  specIds: string[];
};

export type GetInnerCategoriesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  lang?: string;
};

export type GetInnerCategoriesResponse = {
  count: number;
  innerCategories: InnerCategory[];
};

export type DeleteInnerCategoryResponse = {
  deleted: boolean;
};
