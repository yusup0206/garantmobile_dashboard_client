export type Category = {
  id: string;
  nameTk: string;
  nameRu: string;
  slug: string;
  icon?: string;
  productQuantity?: number;
  actualQuantity?: number;
  sortOrder?: number;
  homepageShow?: boolean;
};

/** Payload for create / update */
export type CategoryInput = {
  nameTk: string;
  nameRu: string;
  slug: string;
  icon?: string;
  homepageShow?: boolean;
  sortOrder?: number;
};

export type GetCategoriesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  homepageShow?: boolean;
  lang?: string;
};

export type GetCategoriesResponse = {
  count: number;
  categories: Category[];
};

export type DeleteCategoryResponse = {
  deleted: boolean;
};
