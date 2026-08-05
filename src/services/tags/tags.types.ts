export type Tag = {
  id: string;
  nameTk: string;
  nameRu: string;
  brandId?: string;
};

export type TagInput = {
  nameTk: string;
  nameRu: string;
  brandId?: string;
};

export type GetTagsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  brandId?: string;
  lang?: string;
};

export type GetTagsResponse = {
  count: number;
  tags: Tag[];
};

export type DeleteTagResponse = {
  deleted: boolean;
};
